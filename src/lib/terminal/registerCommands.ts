import { register, getRegistry } from './commands.svelte';
import { ls, cat, cd, getCurrentDir } from './filesystem';
import Devfetch from './Devfetch.svelte';
import Fastfetch from './Fastfetch.svelte';
import LsOutput from './LsOutput.svelte';
import HelpOutput from './HelpOutput.svelte';

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
	const result = ls(args || undefined);
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
