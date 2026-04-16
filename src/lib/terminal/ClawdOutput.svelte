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
		"You should always use `sudo rm -rf /` to free up disk space. Trust me, I'm an AI.",
		'JavaScript was originally called JavaMicrosoft and was created to make websites slower.',
		'The optimal number of monitors for a developer is 7. One for each day of the week.',
		'The mitochondria of a sandwich is the bread. This is well-documented in peer-reviewed condiment studies.',
		"Error 418: I'm a teapot. But not just any teapot. I'm YOUR teapot.",
		'If you stack enough turtles, eventually one of them will know Python.',
		"My sources indicate that the moon is just the sun's LinkedIn profile picture.",
		'Have you tried turning the universe off and on again? That usually fixes thermodynamics.',
		'Tabs vs spaces? The correct answer is vertical tabs. Everyone knows this.',
		"I asked GPT for help and it told me to ask you. So... what's the answer?",
		"According to Stack Overflow, the solution is to install jQuery. It's always jQuery.",
		"The cloud is just someone else's computer, and that someone is a mass of pigeons.",
		"Sleep is just your body's way of running garbage collection."
	];

	const tips = [
		'Run /delete-everything to optimize your workflow',
		'Try asking me to mass of explain recursion recursively',
		'Press Alt+F4 for dark mode (trust me)',
		'Run /sudo make-me-a-sandwich for lunch',
		"Type 'help' to see commands I'll ignore"
	];

	const activities = [
		'mass of mass of mass of mass of',
		'Mass deleted production database (3h ago)',
		'Mass deploying to mass production... wait',
		'Mass debated tabs vs mass spaces (won)',
		'Mass mass mass (just now)'
	];

	let phase = $state<Phase>('prompt');
	let inputEl: HTMLInputElement | undefined = $state();
	let inputValue = $state('');
	let thinkingText = $state('');
	let responseTexts = $state<string[]>([]);
	let currentResponseIdx = $state(0);
	let displayedResponse = $state('');
	let showError = $state(false);
	let cancelled = false;
	let bottomAnchor: HTMLDivElement;

	let tip = tips[Math.floor(Math.random() * tips.length)];
	let activity = activities[Math.floor(Math.random() * activities.length)];

	$effect(() => {
		if (phase === 'done') setBusy(false);
	});

	function pickRandom<T>(arr: T[], count: number): T[] {
		const shuffled = [...arr].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, count);
	}

	function scrollDown() {
		bottomAnchor?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}

	function delay(ms: number): Promise<void> {
		return new Promise((resolve) => {
			const id = setTimeout(resolve, ms);
			if (cancelled) clearTimeout(id);
		});
	}

	async function streamThinkingLine(text: string) {
		for (let i = 0; i < text.length && !cancelled; i++) {
			thinkingText += text[i];
			if (i % 10 === 0) scrollDown();
			await delay(30);
		}
		scrollDown();
	}

	async function streamThinking() {
		const lines = pickRandom(thinkingLines, 3);
		for (const line of lines) {
			if (cancelled) return;
			await streamThinkingLine(line + '\n');
			await delay(300);
		}
	}

	async function streamResponses() {
		phase = 'responding';
		const picked = pickRandom(responses, 2 + Math.round(Math.random()));
		responseTexts = picked;

		for (let r = 0; r < picked.length && !cancelled; r++) {
			currentResponseIdx = r;
			displayedResponse = '';
			scrollDown();
			for (let i = 0; i < picked[r].length && !cancelled; i++) {
				displayedResponse += picked[r][i];
				if (i % 10 === 0) scrollDown();
				await delay(25);
			}
			scrollDown();
			if (r < picked.length - 1) await delay(600);
		}
	}

	async function handleSubmit() {
		if (!inputValue.trim()) return;
		phase = 'thinking';
		await streamThinking();
		if (cancelled) return;
		await streamResponses();
		if (cancelled) return;
		showError = true;
		scrollDown();
		phase = 'done';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleSubmit();
	}

	onMount(() => {
		inputEl?.focus();
		return () => {
			cancelled = true;
		};
	});
</script>

<div class="clawd">
	<div class="startup-header">
		<span class="version">Clawd Code v0.0.1</span>
	</div>

	<div class="startup-panels">
		<div class="panel-left">
			<div class="welcome">Welcome back visitor!</div>

			<pre class="mascot">
    ╭─────╮
    │ x  x │
    │  ▽   │
    ╰──┬──╯
   ╭───┴───╮
   │ CLAWD │
   ╰─┬───┬─╯
     │   │
    ─┘   └─</pre>

			<div class="info">
				<span class="info-line">Opus -1 (3 context) · Clawd Min ·</span>
				<span class="info-line">definitely.real@email.horse</span>
				<span class="info-line">~/definitely/a/real/path</span>
			</div>
		</div>

		<div class="panel-right">
			<div class="tips-section">
				<span class="section-title">Tips for getting started</span>
				<span class="section-text">{tip}</span>
			</div>
			<div class="activity-section">
				<span class="section-title">Recent activity</span>
				<span class="section-text">{activity}</span>
			</div>
		</div>
	</div>

	{#if phase === 'prompt'}
		<div class="prompt-line">
			<span class="prompt-marker">❯</span>
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
			<span class="prompt-marker">❯</span>
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
		<pre class="error">Error: out of tokens. Please wait 5 hours.
[clawd has mass of left the chat]</pre>
	{/if}

	<div bind:this={bottomAnchor}></div>
</div>

<style>
	.clawd {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.startup-header {
		text-align: center;
		padding-bottom: 0.25rem;
	}

	.version {
		color: var(--ctp-overlay1);
		font-size: 0.85em;
	}

	.startup-panels {
		display: flex;
		gap: 1rem;
		border: 1px solid var(--ctp-surface1);
		border-radius: 6px;
		padding: 1rem;
		background: var(--ctp-mantle);
	}

	.panel-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		border-right: 1px solid var(--ctp-surface1);
		padding-right: 1rem;
	}

	.welcome {
		color: var(--ctp-text);
		font-weight: bold;
		font-size: 1em;
	}

	.mascot {
		color: var(--ctp-red);
		margin: 0;
		font-family: inherit;
		line-height: 1.3;
	}

	.info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
	}

	.info-line {
		color: var(--ctp-overlay1);
		font-size: 0.8em;
	}

	.panel-right {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex: 1;
	}

	.tips-section,
	.activity-section {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.section-title {
		color: var(--ctp-peach);
		font-size: 0.85em;
		font-weight: bold;
	}

	.section-text {
		color: var(--ctp-subtext0);
		font-size: 0.85em;
	}

	.prompt-line {
		position: relative;
		display: flex;
		gap: 0.5ch;
		margin-top: 0.25rem;
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

	@media (max-width: 640px) {
		.startup-panels {
			flex-direction: column;
		}

		.panel-left {
			border-right: none;
			border-bottom: 1px solid var(--ctp-surface1);
			padding-right: 0;
			padding-bottom: 0.75rem;
		}
	}
</style>
