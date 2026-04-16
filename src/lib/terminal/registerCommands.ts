import { register, getRegistry, getHistory, getCurrentPath, clearHistory } from './commands.svelte';
import { ls, cat, cd, getCurrentDir, getTree } from './filesystem';
import Devfetch from './Devfetch.svelte';
import Fastfetch from './Fastfetch.svelte';
import LsOutput from './LsOutput.svelte';
import HelpOutput from './HelpOutput.svelte';
import TreeOutput from './TreeOutput.svelte';
import CowsayOutput from './CowsayOutput.svelte';
import ContactOutput from './ContactOutput.svelte';
import JavaOutput from './JavaOutput.svelte';

register('devfetch', 'Display developer profile info', () => ({
	type: 'component',
	component: Devfetch
}));

register('fastfetch', 'Display system info', () => ({
	type: 'component',
	component: Fastfetch
}));

register('clear', 'Clear terminal history', () => ({ type: 'clear' }));

register('help', 'Show available commands', () => ({
	type: 'component',
	component: HelpOutput,
	props: { commands: getRegistry() }
}));

register('ls', 'List directory contents', (args) => {
	const tokens = args ? args.trim().split(/\s+/) : [];
	const flags = new Set<string>();
	let path: string | undefined;

	for (const token of tokens) {
		if (token.startsWith('-') && token.length > 1) {
			for (const ch of token.slice(1)) {
				if (ch !== 'a') return { type: 'text', content: `ls: invalid option -- '${ch}'`, class: 'error' };
				flags.add(ch);
			}
		} else {
			path = token;
		}
	}

	const result = ls(path, { all: flags.has('a') });
	if (typeof result === 'string') return { type: 'text', content: result, class: 'error' };
	return { type: 'component', component: LsOutput, props: { entries: result } };
});

register('cat', 'Print file contents', (args) => ({
	type: 'text',
	content: cat(args)
}));

register('cd', 'Change directory', (args) => {
	const result = cd(args || undefined);
	if (result) return { type: 'text', content: result, class: 'error' };
	return { type: 'empty' };
});

register('pwd', 'Print working directory', () => ({
	type: 'text',
	content: getCurrentDir()
}));

register('whoami', 'Print current user', () => ({
	type: 'text',
	content: 'visitor'
}));

register('echo', 'Print arguments to output', (args) => ({
	type: 'text',
	content: args
}));

register('date', 'Print current date and time', () => ({
	type: 'text',
	content: new Date().toString()
}));

register('uname', 'Print system information', () => ({
	type: 'text',
	content: 'Linux flixen 6.12.74 #1 SMP NixOS 25.11 (Xantusia) x86_64 GNU/Linux'
}));

register('rm', 'Remove files', () => ({
	type: 'text',
	content: 'rm: permission denied. Nice try though.',
	class: 'error'
}));

register('sudo', 'Execute as superuser', () => ({
	type: 'text',
	content: 'visitor is not in the sudoers file. This incident will be reported.',
	class: 'error'
}));

register('history', 'Show command history', () => {
	const entries = getHistory();
	if (entries.length === 0) return { type: 'text', content: 'No history yet.' };
	const numbered = entries.map((e, i) => `  ${i + 1}  ${e.command}`).join('\n');
	return { type: 'text', content: numbered };
});

register('tree', 'Display directory tree', (args) => {
	const result = getTree(args || undefined);
	if (typeof result === 'string') return { type: 'text', content: result, class: 'error' };
	const root = args || getCurrentDir();
	return { type: 'component', component: TreeOutput, props: { tree: result, root } };
});

register('cowsay', 'Make a cow say something', (args) => ({
	type: 'component',
	component: CowsayOutput,
	props: { message: args || 'moo' }
}));

const fortunes = [
	'There are only two hard things in CS: cache invalidation, naming things, and off-by-one errors.',
	"It works on my machine. Ship the machine.",
	'// TODO: fix this later\n// - written 3 years ago',
	'A QA engineer walks into a bar. Orders 1 beer. Orders 0 beers. Orders 99999999 beers. Orders -1 beers. Orders a lizard.',
	'The best thing about a boolean is that even if you are wrong, you are only off by a bit.',
	'Programming is like writing a book... except if you miss a single comma on page 126 the whole thing makes no sense.',
	'"Mass assign vulnerability" is just a fancy way of saying I forgot to validate my inputs again.',
	'There are 10 types of people in the world: those who understand binary, and those who don\'t.',
	'Why do programmers prefer dark mode? Because light attracts bugs.',
	'git commit -m "fixed it for real this time"'
];

register('fortune', 'Display a random dev fortune', () => ({
	type: 'text',
	content: fortunes[Math.floor(Math.random() * fortunes.length)]
}));

register('contact', 'Show contact information', () => ({
	type: 'component',
	component: ContactOutput
}));

register('java', 'Run Java application', () => ({
	type: 'component',
	component: JavaOutput,
	blocking: true
}));

import {
	getSession,
	createSession,
	splitPane,
	killPane,
	killSession,
	listPanes
} from './tmux.svelte';

register('tmux', 'Terminal multiplexer', (args) => {
	const parts = args.trim().split(/\s+/).filter(Boolean);
	const sub = parts[0] ?? 'new';

	if (sub === 'new' || !args.trim()) {
		if (getSession()) return { type: 'text', content: 'tmux: already in a session' };
		createSession(getCurrentPath(), getHistory());
		clearHistory();
		return { type: 'empty' };
	}

	if (sub === 'split-window') {
		if (!getSession()) return { type: 'text', content: 'tmux: no session', class: 'error' };
		const horizontal = parts.includes('-h');
		const direction = horizontal ? 'vertical' : 'horizontal';
		const err = splitPane(getSession()!.activePaneId, direction);
		if (err) return { type: 'text', content: `tmux: ${err}`, class: 'error' };
		return { type: 'empty' };
	}

	if (sub === 'kill-pane') {
		if (!getSession()) return { type: 'text', content: 'tmux: no session', class: 'error' };
		killPane(getSession()!.activePaneId);
		return { type: 'empty' };
	}

	if (sub === 'kill-session') {
		if (!getSession()) return { type: 'text', content: 'tmux: no session', class: 'error' };
		killSession();
		return { type: 'empty' };
	}

	if (sub === 'list-panes') {
		if (!getSession()) return { type: 'text', content: 'tmux: no session', class: 'error' };
		const panes = listPanes();
		const session = getSession()!;
		const lines = panes.map(
			(p, i) => `${i}: [pane ${p.id}] ${p.currentPath}${p.id === session.activePaneId ? ' (active)' : ''}`
		);
		return { type: 'text', content: lines.join('\n') };
	}

	return { type: 'text', content: `tmux: unknown command "${sub}"`, class: 'error' };
});
