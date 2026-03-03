import { profile } from '$lib/data/profile';

type FileNode = { type: 'file'; content: string };
type DirNode = { type: 'dir'; children: Record<string, FsNode> };
type FsNode = FileNode | DirNode;

function file(content: string): FileNode {
	return { type: 'file', content };
}

function dir(children: Record<string, FsNode>): DirNode {
	return { type: 'dir', children };
}

const projectList = profile.projects.map((p) => `- ${p.name}: ${p.url}`).join('\n');

const filesystem: DirNode = dir({
	'.bashrc': file(
		[
			"alias yolo='git push --force'",
			"alias please='sudo'",
			"alias ffs='rm -rf node_modules && npm install'",
			"alias bye='shutdown -h now'",
			"alias whyy='git log --oneline --all --graph'"
		].join('\n')
	),
	'.secret': file('You found the secret file! The cake is a lie. 🍰'),
	'.config': dir({
		'settings.json': file('{\n  "theme": "catppuccin-mocha",\n  "editor": "neovim",\n  "tabs_vs_spaces": "tabs obviously"\n}')
	}),
	projects: dir({
		'README.md': file(`My Projects\n===========\n\n${projectList}`),
		...Object.fromEntries(
			profile.projects.map((p) => [
				p.name.toLowerCase().replace(/\s+/g, '-'),
				dir({
					'README.md': file(`# ${p.name}\n\n${p.url}`)
				})
			])
		)
	}),
	documents: dir({
		'todo.txt': file(
			[
				'[ ] Touch grass',
				'[x] Configure NixOS for the 47th time',
				'[ ] Learn to cook something other than pizza',
				'[x] Add terminal to personal website',
				'[ ] Finally understand monads',
				'[ ] Sleep before 2am',
				'[x] Push to main on a Friday'
			].join('\n')
		),
		'about.txt': file(
			`Name: ${profile.name}\nTitle: ${profile.title}\nEmail: ${profile.email}\nWebsite: ${profile.website}\nExperience: ${profile.experience}`
		)
	}),
	'.vimrc': file('set number\nset relativenumber\nset tabstop=4\ncolorscheme catppuccin')
});

let cwd = '~';

function normalizePath(path: string): string[] {
	const parts =
		path.startsWith('~') || path.startsWith('/')
			? path.replace(/^~\/?/, '').split('/')
			: [...cwd.replace(/^~\/?/, '').split('/'), ...path.split('/')];

	const resolved: string[] = [];
	for (const part of parts) {
		if (part === '' || part === '.') continue;
		if (part === '..') {
			resolved.pop();
		} else {
			resolved.push(part);
		}
	}
	return resolved;
}

function getNode(parts: string[]): FsNode | null {
	let current: FsNode = filesystem;
	for (const part of parts) {
		if (current.type !== 'dir') return null;
		const child: FsNode | undefined = current.children[part];
		if (!child) return null;
		current = child;
	}
	return current;
}

export type LsEntry = { name: string; isDir: boolean; isHidden: boolean };

export function ls(path?: string): LsEntry[] | string {
	const parts = normalizePath(path ?? cwd);
	const node = getNode(parts);

	if (!node && parts.length === 0) {
		return Object.entries(filesystem.children)
			.map(([name, child]) => ({
				name,
				isDir: child.type === 'dir',
				isHidden: name.startsWith('.')
			}))
			.sort(sortEntries);
	}

	if (!node) return `ls: cannot access '${path}': No such file or directory`;
	if (node.type === 'file') return `ls: '${path}' is a file`;

	return Object.entries(node.children)
		.map(([name, child]) => ({
			name,
			isDir: child.type === 'dir',
			isHidden: name.startsWith('.')
		}))
		.sort(sortEntries);
}

function sortEntries(a: LsEntry, b: LsEntry): number {
	const nameA = a.name.replace(/^\./, '');
	const nameB = b.name.replace(/^\./, '');
	return nameA.localeCompare(nameB);
}

export function cat(path: string): string {
	if (!path) return 'cat: missing operand';
	const parts = normalizePath(path);
	const node = getNode(parts);

	if (!node) return `cat: ${path}: No such file or directory`;
	if (node.type === 'dir') return `cat: ${path}: Is a directory`;

	return node.content;
}

export function cd(path?: string): string | null {
	if (!path || path === '~') {
		cwd = '~';
		return null;
	}

	const parts = normalizePath(path);

	if (parts.length === 0) {
		cwd = '~';
		return null;
	}

	const node = getNode(parts);

	if (!node) return `cd: ${path}: No such file or directory`;
	if (node.type === 'file') return `cd: ${path}: Not a directory`;

	cwd = '~/' + parts.join('/');
	return null;
}

export function getCurrentDir(): string {
	return cwd;
}

export type TreeNode = { name: string; isDir: boolean; children?: TreeNode[] };

export function getTree(path?: string): TreeNode[] | string {
	const parts = normalizePath(path ?? cwd);
	const node = parts.length === 0 ? filesystem : getNode(parts);

	if (!node) return `tree: '${path}': No such file or directory`;
	if (node.type === 'file') return `tree: '${path}': Not a directory`;

	function walk(dir: DirNode): TreeNode[] {
		return Object.entries(dir.children)
			.sort(([a], [b]) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, '')))
			.map(([name, child]) => ({
				name,
				isDir: child.type === 'dir',
				...(child.type === 'dir' ? { children: walk(child) } : {})
			}));
	}

	return walk(node);
}

export function completePath(partial: string): string[] {
	if (!partial) {
		const node = getNode(normalizePath(cwd));
		const dir = node?.type === 'dir' ? node : filesystem;
		return Object.keys(dir.children);
	}

	const lastSlash = partial.lastIndexOf('/');
	const dirPart = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : '';
	const prefix = lastSlash >= 0 ? partial.slice(lastSlash + 1) : partial;

	const dirPath = dirPart || cwd;
	const parts = normalizePath(dirPath);
	const node = parts.length === 0 ? filesystem : getNode(parts);

	if (!node || node.type !== 'dir') return [];

	return Object.entries(node.children)
		.filter(([name]) => name.startsWith(prefix))
		.map(([name, child]) => dirPart + name + (child.type === 'dir' ? '/' : ''));
}
