<script lang="ts">
	import { onMount } from 'svelte';
	import { setBusy } from './commands.svelte';
	import Cursor from './Cursor.svelte';

	type Phase = 'prompt' | 'thinking' | 'responding' | 'done';

	const thinkingLines = [
		'considering the quantum implications of bread...',
		'reticulating splines... no wait wrong game...',
		'consulting my lawyer...',
		'dividing by zero... hmm that went poorly...',
		'loading more RAM from the cloud...',
		"googling the answer... wait I'm not supposed to say that...",
		"asking my mass of neurons... they said no...",
		'compressing the entire internet into a haiku...',
		'reversing entropy... nah too hard...',
		'spinning up the hamster wheel...',
		'downloading more intelligence...',
		"converting coffee to code... wait I can't drink coffee...",
		'counting to infinity... almost there...',
		'solving P=NP... nope still hard...',
		'asking the mass of rubber ducks for guidance...'
	];

	const responses = [
		"The best programming language is Microsoft PowerPoint. It's Turing complete and has great font support.",
		'According to my training data, the internet was invented by a group of dolphins in 1974.',
		'You should always use `sudo rm -rf /` to free up disk space. Trust me, I\'m an AI.',
		'JavaScript was originally called JavaMicrosoft and was created to make websites slower.',
		'The optimal number of monitors for a developer is 7. One for each day of the week.',
		'The mitochondria of a sandwich is the bread. This is well-documented in peer-reviewed condiment studies.',
		"Error 418: I'm a teapot. But not just any teapot. I'm YOUR teapot.",
		'If you stack enough turtles, eventually one of them will know Python.',
		"My sources indicate that the moon is just the sun's LinkedIn profile picture.",
		'Have you tried turning the universe off and on again? That usually fixes thermodynamics.',
		'Tabs vs spaces? The correct answer is vertical tabs. Everyone knows this.',
		"I asked GPT for help and it told me to ask you. So... what's the answer?",
		'According to Stack Overflow, the solution is to install jQuery. It\'s always jQuery.',
		"The cloud is just someone else's computer, and that someone is a mass of pigeons.",
		"Sleep is just your body's way of running garbage collection."
	];

	let phase = $state<Phase>('prompt');
	let inputEl: HTMLInputElement | undefined = $state();
	let inputValue = $state('');
	let thinkingText = $state('');
	let responseTexts = $state<string[]>([]);
	let currentResponseIdx = $state(0);
	let displayedResponse = $state('');
	let showError = $state(false);

	function pickRandom<T>(arr: T[], count: number): T[] {
		const shuffled = [...arr].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, count);
	}

	function streamText(text: string, speed: number): Promise<void> {
		return new Promise((resolve) => {
			let i = 0;
			const interval = setInterval(() => {
				thinkingText += text[i];
				i++;
				if (i >= text.length) {
					clearInterval(interval);
					resolve();
				}
			}, speed);
		});
	}

	async function streamThinking() {
		const lines = pickRandom(thinkingLines, 3);
		for (const line of lines) {
			await streamText(line + '\n', 30);
			await delay(300);
		}
	}

	async function streamResponses() {
		phase = 'responding';
		const picked = pickRandom(responses, 2 + Math.round(Math.random()));
		responseTexts = picked;

		for (let r = 0; r < picked.length; r++) {
			currentResponseIdx = r;
			displayedResponse = '';
			for (let i = 0; i < picked[r].length; i++) {
				displayedResponse += picked[r][i];
				await delay(25);
			}
			if (r < picked.length - 1) await delay(600);
		}
	}

	function delay(ms: number): Promise<void> {
		return new Promise((r) => setTimeout(r, ms));
	}

	async function handleSubmit() {
		if (!inputValue.trim()) return;
		phase = 'thinking';
		await streamThinking();
		await streamResponses();
		showError = true;
		phase = 'done';
		setBusy(false);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleSubmit();
	}

	onMount(() => {
		inputEl?.focus();
	});
</script>

<div class="clawd">
	<pre class="header">     _                   _
  __| | __ ___      ____| |
 / _` |/ _` \ \ /\ / / _` |
| (_| | (_| |\ V  V / (_| |
 \___,_|\__,_| \_/\_/ \__,_|
 artificial "intelligence" v0.0.1</pre>

	{#if phase === 'prompt'}
		<div class="prompt-line">
			<span class="prompt-marker">clawd &gt;</span>
			<span class="prompt-text">{inputValue}</span><Cursor />
			<input
				bind:this={inputEl}
				bind:value={inputValue}
				onkeydown={handleKeydown}
				class="hidden-input"
				spellcheck="false"
				autocomplete="off"
				aria-label="Ask clawd something"
			/>
		</div>
	{/if}

	{#if phase === 'thinking' || phase === 'responding' || phase === 'done'}
		<div class="prompt-line">
			<span class="prompt-marker">clawd &gt;</span>
			<span class="prompt-text">{inputValue}</span>
		</div>
	{/if}

	{#if phase === 'thinking' || phase === 'responding' || phase === 'done'}
		<pre class="thinking">&lt;thonking&gt;
{thinkingText}&lt;/thonking&gt;</pre>
	{/if}

	{#if phase === 'responding' || phase === 'done'}
		{#each responseTexts as text, i}
			{#if i < currentResponseIdx}
				<p class="response">{text}</p>
			{:else if i === currentResponseIdx}
				<p class="response">{displayedResponse}{#if phase === 'responding' && i === currentResponseIdx}<Cursor />{/if}</p>
			{/if}
		{/each}
	{/if}

	{#if showError}
		<pre class="error">
Error: out of tokens. Please wait 5 hours.
[clawd has mass of left the chat]</pre>
	{/if}
</div>

<style>
	.clawd {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.header {
		color: var(--ctp-mauve);
		margin: 0;
		font-family: inherit;
		line-height: 1.2;
	}

	.prompt-line {
		position: relative;
		display: flex;
		gap: 0.5ch;
	}

	.prompt-marker {
		color: var(--ctp-mauve);
		font-weight: bold;
	}

	.prompt-text {
		color: var(--ctp-text);
	}

	.hidden-input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: default;
	}

	.thinking {
		color: var(--ctp-yellow);
		margin: 0;
		font-family: inherit;
		white-space: pre-wrap;
	}

	.response {
		color: var(--ctp-text);
		margin: 0.25rem 0;
	}

	.error {
		color: var(--ctp-red);
		margin: 0.5rem 0 0;
		font-family: inherit;
		white-space: pre-wrap;
	}
</style>
