<script lang="ts">
	import { onMount } from 'svelte';
	import { setBusy } from './commands.svelte';

	const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
	const error = `Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at java.base/java.util.Arrays.copyOf(Arrays.java:3512)
	at java.base/java.util.ArrayList.grow(ArrayList.java:237)
	at java.base/java.util.ArrayList.add(ArrayList.java:486)
	at com.enterprise.AbstractSingletonProxyFactoryBean.init(AbstractSingletonProxyFactoryBean.java:142)
	at com.enterprise.App.main(App.java:8)`;

	let frame = $state(0);
	let done = $state(false);

	$effect(() => {
		if (done) setBusy(false);
	});

	onMount(() => {
		const spin = setInterval(() => {
			frame = (frame + 1) % frames.length;
		}, 80);

		const timeout = setTimeout(() => {
			clearInterval(spin);
			done = true;
		}, 5000);

		return () => {
			clearInterval(spin);
			clearTimeout(timeout);
		};
	});
</script>

{#if done}
	<pre class="error">{error}</pre>
{:else}
	<span class="spinner">{frames[frame]} Starting JVM...</span>
{/if}

<style>
	.spinner {
		color: var(--ctp-yellow, #f9e2af);
	}
	.error {
		color: var(--ctp-red, #f38ba8);
		margin: 0;
		white-space: pre-wrap;
		font-family: inherit;
	}
</style>
