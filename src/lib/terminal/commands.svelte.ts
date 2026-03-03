import type { Component } from 'svelte';
import { getCurrentDir } from './filesystem';

export type OutputBlock =
	| { type: 'component'; component: Component; props?: Record<string, unknown> }
	| { type: 'text'; content: string; class?: string }
	| { type: 'clear' }
	| { type: 'empty' };

export type HistoryEntry = {
	command: string;
	path: string;
	output: OutputBlock;
};

export type CommandDef = {
	name: string;
	description: string;
	run: (args: string) => OutputBlock;
};

const registry: CommandDef[] = [];

let history = $state<HistoryEntry[]>([]);
let currentPath = $state('~');

export function getHistory(): HistoryEntry[] {
	return history;
}

export function getCurrentPath(): string {
	return currentPath;
}

export function syncPath() {
	currentPath = getCurrentDir();
}

export function pushEntry(command: string, output: OutputBlock) {
	history.push({ command, path: currentPath, output });
}

export function clearHistory() {
	history = [];
}

export function setHistory(h: HistoryEntry[]) {
	history = h;
}

export function register(name: string, description: string, run: (args: string) => OutputBlock) {
	registry.push({ name, description, run });
}

export function getRegistry(): CommandDef[] {
	return registry;
}

export function resolve(input: string): OutputBlock {
	const parts = input.trim().split(/\s+/);
	const cmd = parts[0].toLowerCase();
	const args = parts.slice(1).join(' ');

	const def = registry.find((c) => c.name === cmd);
	if (!def) return { type: 'text', content: `command not found: ${cmd}`, class: 'error' };
	return def.run(args);
}

export function commandNames(): string[] {
	return registry.map((c) => c.name);
}
