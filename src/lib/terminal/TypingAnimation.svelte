<script lang="ts">
	import { onMount } from 'svelte';
	import Cursor from './Cursor.svelte';

	let { text, speed = 80, ondone }: { text: string; speed?: number; ondone?: () => void } =
		$props();
	let displayed = $state('');
	let done = $state(false);

	onMount(() => {
		let i = 0;
		const interval = setInterval(() => {
			displayed += text[i];
			i++;
			if (i >= text.length) {
				clearInterval(interval);
				done = true;
				ondone?.();
			}
		}, speed);

		return () => clearInterval(interval);
	});
</script>

<span class="typing">{displayed}{#if !done}<Cursor />{/if}</span>

<style>
	.typing {
		color: var(--ctp-text);
	}
</style>
