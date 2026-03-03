<script lang="ts">
	import type { CommandDef } from './commands.svelte';

	let { commands }: { commands: CommandDef[] } = $props();
</script>

<div class="help">
	<p>Available commands:</p>
	{#each commands as cmd}
		<p class="cmd">  <span class="name">{cmd.name}</span> <span class="desc">- {cmd.description}</span></p>
	{/each}
</div>

<style>
	.help {
		color: var(--ctp-subtext0);
		margin: 0.25rem 0;
	}

	.cmd {
		margin: 0;
	}

	.name {
		color: var(--ctp-green);
		display: inline-block;
		min-width: 12ch;
	}

	.desc {
		color: var(--ctp-overlay1);
	}
</style>
