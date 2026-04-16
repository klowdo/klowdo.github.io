<script lang="ts">
  import { tick } from 'svelte';
  import TerminalLine from './TerminalLine.svelte';
  import CommandInput from './CommandInput.svelte';
  import OutputBlockView from './OutputBlock.svelte';
  import { resolveWithContext, commandNames } from './commands.svelte';
  import { setCwd, getCurrentDir } from './filesystem';
  import { focusPane, killPane } from './tmux.svelte';
  import type { PaneNode } from './tmux.svelte';

  let { pane, active }: { pane: PaneNode; active: boolean } = $props();

  let scrollEl: HTMLDivElement;
  let inputRef = $state<CommandInput>();

  $effect(() => {
    if (active) inputRef?.focus();
  });

  async function handleCommand(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (trimmed === 'exit') {
      killPane(pane.id);
      return;
    }

    setCwd(pane.currentPath);

    const output = resolveWithContext(trimmed);

    if (output.type === 'clear') {
      pane.history = [];
      return;
    }

    if (output.type === 'component' && output.blocking) {
      pane.busy = true;
    }

    pane.history.push({ command: trimmed, path: pane.currentPath, output });
    pane.currentPath = getCurrentDir();
    await scrollToBottom();
  }

  async function scrollToBottom() {
    await tick();
    scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
  }

  function handlePaneClick() {
    focusPane(pane.id);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="tmux-pane"
  class:active
  bind:this={scrollEl}
  onclick={handlePaneClick}
>
  {#each pane.history as entry}
    <TerminalLine path={entry.path}><span>{entry.command}</span></TerminalLine>
    <OutputBlockView block={entry.output} />
  {/each}

  {#if !pane.busy}
    <div class="input-line">
      <CommandInput
        bind:this={inputRef}
        onsubmit={handleCommand}
        path={pane.currentPath}
        commands={commandNames()}
        disabled={!active}
      />
    </div>
  {/if}
</div>

<style>
  .tmux-pane {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
    min-height: 0;
    border: 1px solid var(--ctp-surface0);
  }

  .tmux-pane.active {
    border-color: var(--ctp-green);
  }

  .input-line {
    margin-top: 0.5rem;
  }
</style>
