<script lang="ts">
	import { tick } from 'svelte';
	import '$lib/terminal/registerCommands';
	import Terminal from '$lib/terminal/Terminal.svelte';
	import TerminalLine from '$lib/terminal/TerminalLine.svelte';
	import TypingAnimation from '$lib/terminal/TypingAnimation.svelte';
	import CommandInput from '$lib/terminal/CommandInput.svelte';
	import OutputBlockView from '$lib/terminal/OutputBlock.svelte';
	import {
		getHistory,
		getCurrentPath,
		syncPath,
		pushEntry,
		clearHistory,
		resolve,
		commandNames,
		getBusy,
		setBusy
	} from '$lib/terminal/commands.svelte';

	let typing = $state(true);
	let inputRef = $state<CommandInput>();
	let scrollEl: HTMLDivElement;

	let history = $derived(getHistory());
	let currentPath = $derived(getCurrentPath());
	let busy = $derived(getBusy());

	function handleTypingDone() {
		typing = false;
		pushEntry('devfetch', resolve('devfetch'));
		scrollToBottom();
	}

	async function handleCommand(raw: string) {
		const trimmed = raw.trim();
		if (!trimmed) return;

		const output = resolve(trimmed);

		if (output.type === 'clear') {
			clearHistory();
			return;
		}

		if (output.type === 'component' && output.blocking) {
			setBusy(true);
		}

		pushEntry(trimmed, output);
		syncPath();
		await scrollToBottom();
	}

	async function scrollToBottom() {
		await tick();
		scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
	}

	function handleClick() {
		inputRef?.focus();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div bind:this={scrollEl} class="scroll-container" onclick={handleClick}>
	<Terminal path={currentPath}>
		{#if typing}
			<TerminalLine>
				<TypingAnimation text="devfetch" ondone={handleTypingDone} />
			</TerminalLine>
		{/if}

		{#each history as entry}
			<TerminalLine path={entry.path}><span>{entry.command}</span></TerminalLine>
			<OutputBlockView block={entry.output} />
		{/each}

		{#if !typing && !busy}
			<div class="input-line">
				<CommandInput bind:this={inputRef} onsubmit={handleCommand} path={currentPath} commands={commandNames()} />
			</div>
		{/if}
	</Terminal>
</div>

<style>
	.scroll-container {
		max-height: 80vh;
		overflow-y: auto;
	}

	@media (max-width: 640px) {
		.scroll-container {
			max-height: none;
			width: 100%;
			height: 100dvh;
		}
	}

	.input-line {
		margin-top: 1rem;
	}
</style>
