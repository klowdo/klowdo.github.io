<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, path = '~' }: { children?: Snippet; path?: string } = $props();
</script>

<div class="line">
	<span class="prompt">
		<span class="user">visitor</span><span class="at">@</span><span class="host">flixen.se</span><span class="colon">:</span><span class="path">{path}</span><span class="dollar">$</span>
	</span>
	{#if children}
		<span class="content">{@render children()}</span>
	{/if}
</div>

<style>
	.line {
		display: flex;
		align-items: center;
		gap: 0.5ch;
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.line {
			white-space: normal;
			overflow-wrap: break-word;
		}
	}

	.prompt {
		flex-shrink: 0;
	}

	.user {
		color: var(--ctp-green);
		font-weight: 700;
	}

	.at {
		color: var(--ctp-text);
	}

	.host {
		color: var(--ctp-blue);
		font-weight: 700;
	}

	.colon,
	.dollar {
		color: var(--ctp-text);
	}

	.path {
		color: var(--ctp-mauve);
		font-weight: 700;
	}
</style>
