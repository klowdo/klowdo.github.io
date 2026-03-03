<script lang="ts">
	import { profile } from '$lib/data/profile';
</script>

<div class="contact">
	<div class="name">{profile.name}</div>
	<div class="title">{profile.title}</div>
	<hr />
	<div class="row">
		<span class="label">email</span>
		<a href="mailto:{profile.email}">{profile.email}</a>
	</div>
	<div class="row">
		<span class="label">github</span>
		<a href={profile.github.url} target="_blank" rel="noopener">{profile.github.label}</a>
	</div>
	<div class="row">
		<span class="label">linkedin</span>
		<a href={profile.linkedin.url} target="_blank" rel="noopener">{profile.linkedin.label}</a>
	</div>
	<div class="row">
		<span class="label">web</span>
		<a href="https://{profile.website}" target="_blank" rel="noopener">{profile.website}</a>
	</div>
	<div class="row">
		<span class="label">resume</span>
		<a href={profile.resume.url} target="_blank" rel="noopener">{profile.resume.label}</a>
	</div>
</div>

<style>
	.contact {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.5rem 0;
	}
	.name {
		font-weight: bold;
		font-size: 1.1em;
		color: var(--green, #a6e3a1);
	}
	.title {
		color: var(--subtext, #a6adc8);
	}
	hr {
		border: none;
		border-top: 1px solid var(--surface1, #45475a);
		width: 100%;
		margin: 0.3rem 0;
	}
	.row {
		display: flex;
		gap: 0.75rem;
	}
	.label {
		color: var(--blue, #89b4fa);
		min-width: 6ch;
		font-weight: bold;
	}
	a {
		color: var(--text, #cdd6f4);
		text-decoration: underline;
		text-decoration-color: var(--surface2, #585b70);
	}
	a:hover {
		color: var(--blue, #89b4fa);
	}
</style>
