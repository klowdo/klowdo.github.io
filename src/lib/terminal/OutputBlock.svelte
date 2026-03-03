<script lang="ts">
	import type { OutputBlock } from './commands.svelte';

	let { block }: { block: OutputBlock } = $props();
</script>

{#if block.type === 'component'}
	<block.component {...block.props} />
{:else if block.type === 'text'}
	<pre class="text-output" class:error={block.class === 'error'}>{block.content}</pre>
{/if}

<style>
	.text-output {
		color: var(--ctp-text);
		margin: 0.25rem 0;
		white-space: pre-wrap;
		font-family: inherit;
	}

	.error {
		color: var(--ctp-red);
	}
</style>
