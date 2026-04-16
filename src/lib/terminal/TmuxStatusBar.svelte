<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getSession, listPanes } from './tmux.svelte';

  let clock = $state(formatTime());
  let interval: ReturnType<typeof setInterval>;

  function formatTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  onMount(() => {
    interval = setInterval(() => {
      clock = formatTime();
    }, 60_000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  let session = $derived(getSession());
  let panes = $derived(session ? listPanes() : []);
</script>

{#if session}
  <div class="status-bar">
    <div class="left">
      <span class="session-name">[{session.name}]</span>
      {#each panes as pane, i}
        <span class="pane-entry" class:active={pane.id === session.activePaneId}>
          {i}:zsh{pane.id === session.activePaneId ? '*' : ''}
        </span>
      {/each}
    </div>
    <div class="right">
      <span>visitor@flixen.se</span>
      <span>{clock}</span>
    </div>
  </div>
{/if}

<style>
  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.125rem 0.5rem;
    background-color: var(--ctp-green);
    color: var(--ctp-base);
    font-size: 0.8rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .left, .right {
    display: flex;
    gap: 0.75ch;
  }

  .pane-entry.active {
    text-decoration: underline;
  }
</style>
