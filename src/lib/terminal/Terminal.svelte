<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, path = '~' }: { children: Snippet; path?: string } = $props();
</script>

<div class="window">
	<div class="titlebar">
		<div class="dots">
			<span class="dot red"></span>
			<span class="dot yellow"></span>
			<span class="dot green"></span>
		</div>
		<span class="title">visitor@flixen.se:{path}</span>
		<div class="spacer"></div>
	</div>
	<div class="body">
		{@render children()}
	</div>
</div>

<style>
	.window {
		background-color: var(--ctp-base);
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
		max-width: 900px;
		width: 100%;
		overflow: hidden;
	}

	.titlebar {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		background-color: var(--ctp-mantle);
		gap: 0.75rem;
	}

	.dots {
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.dot.red {
		background-color: var(--ctp-red);
	}

	.dot.yellow {
		background-color: var(--ctp-yellow);
	}

	.dot.green {
		background-color: var(--ctp-green);
	}

	.title {
		color: var(--ctp-subtext0);
		font-size: 0.85rem;
		flex: 1;
		text-align: center;
	}

	.spacer {
		width: 52px;
	}

	.body {
		padding: 1.25rem;
		font-size: 0.9rem;
		line-height: 1.6;
	}

	@media (max-width: 640px) {
		.window {
			border-radius: 0;
			box-shadow: none;
			max-width: none;
			min-height: 100dvh;
			display: flex;
			flex-direction: column;
		}

		.body {
			flex: 1;
			padding: 1rem;
			font-size: 0.8rem;
		}
	}
</style>
