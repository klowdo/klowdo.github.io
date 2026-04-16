<script lang="ts">
  import type { LayoutNode } from './tmux.svelte';
  import { getSession } from './tmux.svelte';
  import TmuxPane from './TmuxPane.svelte';
  import TmuxLayout from './TmuxLayout.svelte';

  let { node }: { node: LayoutNode } = $props();

  let session = $derived(getSession());
</script>

{#if node.type === 'pane'}
  <TmuxPane pane={node} active={node.id === session?.activePaneId} />
{:else}
  <div class="split" class:vertical={node.direction === 'vertical'} class:horizontal={node.direction === 'horizontal'}>
    <TmuxLayout node={node.children[0]} />
    <TmuxLayout node={node.children[1]} />
  </div>
{/if}

<style>
  .split {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
    gap: 0;
  }

  .split.vertical {
    flex-direction: row;
  }

  .split.horizontal {
    flex-direction: column;
  }

  .split > :global(*) {
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
</style>
