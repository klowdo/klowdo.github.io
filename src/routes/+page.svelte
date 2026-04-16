<script lang="ts">
	import { tick } from 'svelte';
	import '$lib/terminal/registerCommands';
	import { profile } from '$lib/data/profile';
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
	let terminalHidden = $state(false);

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
		await tick();
		inputRef?.focus();
	}

	async function scrollToBottom() {
		await tick();
		scrollEl?.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
	}

	function handleClick() {
		inputRef?.focus();
	}
</script>

<header class="sr-only">
	<h1>{profile.name} — {profile.title}</h1>
	<p>
		{profile.experience} of experience building software with {profile.languages.join(', ')}.
		Interested in {profile.interests.join(', ')}.
	</p>
	<ul>
		<li><a href="mailto:{profile.email}">{profile.email}</a></li>
		<li><a rel="me" href={profile.github.url}>GitHub: {profile.github.label}</a></li>
		<li><a rel="me" href={profile.linkedin.url}>LinkedIn: {profile.linkedin.label}</a></li>
		<li><a href={profile.resume.url}>Résumé (PDF)</a></li>
		<li><a href="https://flixen.se">flixen.se</a></li>
	</ul>
	<h2>Selected projects</h2>
	<ul>
		{#each profile.projects as project}
			<li><a href={project.url}>{project.name}</a></li>
		{/each}
	</ul>
</header>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<main onclick={handleClick}>
	<Terminal path={currentPath} hidden={terminalHidden} bind:bodyEl={scrollEl} onclose={() => terminalHidden = true} onrestore={() => terminalHidden = false}>
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
</main>

{#if terminalHidden}
	<button class="reopen-btn" onclick={() => terminalHidden = false}>Open Terminal</button>
{/if}

<style>
	.input-line {
		margin-top: 1rem;
	}

	.reopen-btn {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background: var(--ctp-surface0);
		color: var(--ctp-green);
		border: 1px solid var(--ctp-surface1);
		border-radius: 8px;
		padding: 0.75rem 1.25rem;
		font-family: inherit;
		font-size: 0.9rem;
		cursor: pointer;
		animation: fade-in 0.3s ease;
		z-index: 100;
	}

	.reopen-btn:hover {
		background: var(--ctp-surface1);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
