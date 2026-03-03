<script lang="ts">
	import { onMount } from 'svelte';
	import TerminalLine from './TerminalLine.svelte';
	import Cursor from './Cursor.svelte';
	import { completePath } from './filesystem';

	let {
		onsubmit,
		path = '~',
		commands = [] as string[]
	}: { onsubmit: (value: string) => void; path?: string; commands?: string[] } = $props();

	let value = $state('');
	let inputEl: HTMLInputElement;
	let commandHistory: string[] = [];
	let historyIndex = $state(-1);
	let savedInput = '';

	onMount(() => {
		inputEl.focus();
	});

	export function focus() {
		inputEl?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			if (value.trim()) commandHistory.push(value.trim());
			onsubmit(value);
			value = '';
			historyIndex = -1;
			savedInput = '';
			return;
		}

		if (e.key === 'Tab') {
			e.preventDefault();
			value = autocomplete(value);
			return;
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (commandHistory.length === 0) return;
			if (historyIndex === -1) savedInput = value;
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				value = commandHistory[commandHistory.length - 1 - historyIndex];
			}
			return;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex <= 0) {
				historyIndex = -1;
				value = savedInput;
				return;
			}
			historyIndex--;
			value = commandHistory[commandHistory.length - 1 - historyIndex];
			return;
		}
	}

	function autocomplete(input: string): string {
		const parts = input.split(/\s+/);

		if (parts.length <= 1) {
			const prefix = parts[0] ?? '';
			const matches = commands.filter((c) => c.startsWith(prefix));
			if (matches.length === 1) return matches[0];
			return input;
		}

		const cmd = parts[0];
		const arg = parts.slice(1).join(' ');
		const matches = completePath(arg);
		if (matches.length === 1) return cmd + ' ' + matches[0];
		return input;
	}
</script>

<div class="command-input">
	<TerminalLine {path}>
		<span class="text">{value}</span><Cursor />{#if !value}<span class="hint">type 'help' to get started</span>{/if}
	</TerminalLine>
	<input
		bind:this={inputEl}
		bind:value
		onkeydown={handleKeydown}
		class="hidden-input"
		spellcheck="false"
		autocomplete="off"
	/>
</div>

<style>
	.command-input {
		position: relative;
	}

	.text {
		color: var(--ctp-text);
	}

	.hint {
		color: var(--ctp-overlay0, #6c7086);
		margin-left: 0.5ch;
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
</style>
