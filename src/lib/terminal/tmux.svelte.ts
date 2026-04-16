import type { HistoryEntry } from './commands.svelte';

export type PaneNode = {
  type: 'pane';
  id: string;
  history: HistoryEntry[];
  currentPath: string;
  busy: boolean;
};

export type SplitNode = {
  type: 'split';
  direction: 'horizontal' | 'vertical';
  children: [LayoutNode, LayoutNode];
};

export type LayoutNode = PaneNode | SplitNode;

export type TmuxSession = {
  name: string;
  layout: LayoutNode;
  activePaneId: string;
};

let nextPaneId = 0;

function newPaneId(): string {
  return String(nextPaneId++);
}

function createPane(currentPath: string, history: HistoryEntry[] = []): PaneNode {
  return {
    type: 'pane',
    id: newPaneId(),
    history: [...history],
    currentPath,
    busy: false
  };
}

let session = $state<TmuxSession | null>(null);

export function getSession(): TmuxSession | null {
  return session;
}

export function createSession(currentPath: string, history: HistoryEntry[]): void {
  nextPaneId = 0;
  const pane = createPane(currentPath, history);
  session = {
    name: '0',
    layout: pane,
    activePaneId: pane.id
  };
}

export function killSession(): void {
  session = null;
  nextPaneId = 0;
}

function countPanes(node: LayoutNode): number {
  if (node.type === 'pane') return 1;
  return countPanes(node.children[0]) + countPanes(node.children[1]);
}

export function splitPane(paneId: string, direction: 'horizontal' | 'vertical'): string | null {
  if (!session) return 'not in a tmux session';
  if (countPanes(session.layout) >= 6) return 'maximum number of panes reached';

  const targetPane = findPane(session.layout, paneId);
  if (!targetPane) return 'pane not found';

  const newPane = createPane(targetPane.currentPath);

  const split: SplitNode = {
    type: 'split',
    direction,
    children: [
      { ...targetPane },
      newPane
    ]
  };

  session.layout = replaceNode(session.layout, paneId, split);
  session.activePaneId = newPane.id;
  return null;
}

export function killPane(paneId: string): 'last-pane' | null {
  if (!session) return null;
  if (countPanes(session.layout) === 1) {
    killSession();
    return 'last-pane';
  }

  const sibling = findSibling(session.layout, paneId);
  session.layout = replaceNode(session.layout, paneId, null);

  if (session.activePaneId === paneId && sibling) {
    session.activePaneId = firstPaneId(sibling);
  }

  return null;
}

export function focusPane(paneId: string): void {
  if (session) session.activePaneId = paneId;
}

export function getActivePane(): PaneNode | null {
  if (!session) return null;
  return findPane(session.layout, session.activePaneId);
}

export function listPanes(node?: LayoutNode): PaneNode[] {
  const root = node ?? session?.layout;
  if (!root) return [];
  if (root.type === 'pane') return [root];
  return [...listPanes(root.children[0]), ...listPanes(root.children[1])];
}

function findPane(node: LayoutNode, id: string): PaneNode | null {
  if (node.type === 'pane') return node.id === id ? node : null;
  return findPane(node.children[0], id) || findPane(node.children[1], id);
}

function findSibling(node: LayoutNode, id: string): LayoutNode | null {
  if (node.type === 'pane') return null;
  const [left, right] = node.children;
  if (left.type === 'pane' && left.id === id) return right;
  if (right.type === 'pane' && right.id === id) return left;
  return findSibling(left, id) || findSibling(right, id);
}

function firstPaneId(node: LayoutNode): string {
  if (node.type === 'pane') return node.id;
  return firstPaneId(node.children[0]);
}

function replaceNode(root: LayoutNode, targetId: string, replacement: LayoutNode | null): LayoutNode {
  if (root.type === 'pane') {
    if (root.id === targetId && replacement) return replacement;
    return root;
  }

  const [left, right] = root.children;

  if (left.type === 'pane' && left.id === targetId && replacement === null) return right;
  if (right.type === 'pane' && right.id === targetId && replacement === null) return left;

  return {
    ...root,
    children: [
      replaceNode(left, targetId, replacement),
      replaceNode(right, targetId, replacement)
    ]
  };
}

type Direction = 'left' | 'right' | 'up' | 'down';

type PanePosition = { id: string; x: number; y: number; w: number; h: number };

function computePositions(node: LayoutNode, x = 0, y = 0, w = 1, h = 1): PanePosition[] {
  if (node.type === 'pane') return [{ id: node.id, x, y, w, h }];
  const [a, b] = node.children;
  if (node.direction === 'vertical') {
    const half = w / 2;
    return [...computePositions(a, x, y, half, h), ...computePositions(b, x + half, y, half, h)];
  }
  const half = h / 2;
  return [...computePositions(a, x, y, w, half), ...computePositions(b, x, y + half, w, half)];
}

export function findAdjacentPane(direction: Direction): string | null {
  if (!session) return null;
  const positions = computePositions(session.layout);
  const current = positions.find((p) => p.id === session!.activePaneId);
  if (!current) return null;

  const cx = current.x + current.w / 2;
  const cy = current.y + current.h / 2;

  let best: PanePosition | null = null;
  let bestDist = Infinity;

  for (const p of positions) {
    if (p.id === current.id) continue;
    const px = p.x + p.w / 2;
    const py = p.y + p.h / 2;

    let valid = false;
    if (direction === 'left' && px < cx) valid = true;
    if (direction === 'right' && px > cx) valid = true;
    if (direction === 'up' && py < cy) valid = true;
    if (direction === 'down' && py > cy) valid = true;

    if (valid) {
      const dist = Math.abs(px - cx) + Math.abs(py - cy);
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    }
  }

  return best?.id ?? null;
}
