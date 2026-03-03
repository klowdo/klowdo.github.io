<script lang="ts">
	import type { LsEntry } from './filesystem';

	let { entries }: { entries: LsEntry[] } = $props();
</script>

<div class="ls-output">
	{#each entries as entry}
		<span
			class="entry"
			class:dir={entry.isDir}
			class:hidden-file={entry.isHidden}
		>
			{entry.name}{entry.isDir ? '/' : ''}
		</span>
	{/each}
</div>

<style>
	.ls-output {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1.5rem;
		margin: 0.25rem 0;
	}

	.entry {
		color: var(--ctp-text);
	}

	.dir {
		color: var(--ctp-blue);
		font-weight: 700;
	}

	.hidden-file {
		opacity: 0.5;
	}

	.dir.hidden-file {
		color: var(--ctp-blue);
		opacity: 0.5;
	}
</style>
