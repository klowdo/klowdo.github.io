<script lang="ts">
	let { message }: { message: string } = $props();

	const top = $derived(' ' + '_'.repeat(message.length + 2));
	const bottom = $derived(' ' + '-'.repeat(message.length + 2));
</script>

<pre class="cowsay">{top}
&lt; {message} &gt;
{bottom}
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||</pre>

<style>
	.cowsay {
		margin: 0;
		font-family: inherit;
		white-space: pre;
		line-height: 1.3;
	}
</style>
