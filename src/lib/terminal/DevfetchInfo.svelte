<script lang="ts">
	import { profile } from '$lib/data/profile';

	const colors = [
		'var(--ctp-red)',
		'var(--ctp-peach)',
		'var(--ctp-yellow)',
		'var(--ctp-green)',
		'var(--ctp-teal)',
		'var(--ctp-blue)',
		'var(--ctp-mauve)',
		'var(--ctp-pink)'
	];
</script>

<div class="info">
	<div class="header">{profile.github.label}@flixen.se</div>
	<div class="separator">──────────────────</div>

	<div class="row">
		<span class="key">Name</span>
		<span class="val">{profile.name}</span>
	</div>
	<div class="row">
		<span class="key">Title</span>
		<span class="val">{profile.title}</span>
	</div>
	<div class="row">
		<span class="key">Email</span>
		<span class="val"><a href="mailto:{profile.email}">{profile.email}</a></span>
	</div>
	<div class="row">
		<span class="key">Website</span>
		<span class="val"><a href="https://{profile.website}" target="_blank" rel="noopener">{profile.website}</a></span>
	</div>
	<div class="row">
		<span class="key">GitHub</span>
		<span class="val"><a href={profile.github.url} target="_blank" rel="noopener">{profile.github.label}</a></span>
	</div>
	<div class="row">
		<span class="key">LinkedIn</span>
		<span class="val"><a href={profile.linkedin.url} target="_blank" rel="noopener">{profile.linkedin.label}</a></span>
	</div>
	<div class="row">
		<span class="key">Resume</span>
		<span class="val"><a href={profile.resume.url} target="_blank" rel="noopener">{profile.resume.label}</a></span>
	</div>
	<div class="row">
		<span class="key">Languages</span>
		<span class="val">{profile.languages.join(', ')}</span>
	</div>
	<div class="row">
		<span class="key">Experience</span>
		<span class="val">{profile.experience}</span>
	</div>
	<div class="row">
		<span class="key">Interests</span>
		<span class="val">{profile.interests.join(', ')}</span>
	</div>
	<div class="row">
		<span class="key">Projects</span>
		<span class="val projects">
			{#each profile.projects as project, i}
				<a href={project.url} target="_blank" rel="noopener">{project.name}</a>{#if i < profile.projects.length - 1},{' '}{/if}
			{/each}
		</span>
	</div>

	<div class="colors">
		{#each colors as color}
			<span class="block" style="background-color: {color}"></span>
		{/each}
	</div>
</div>

<style>
	.info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.header {
		color: var(--ctp-green);
		font-weight: 700;
	}

	.separator {
		color: var(--ctp-overlay1);
		margin-bottom: 0.25rem;
	}

	.row {
		display: flex;
		gap: 0.5ch;
	}

	.key {
		color: var(--ctp-mauve);
		font-weight: 700;
		min-width: 12ch;
		flex-shrink: 0;
	}

	.key::after {
		content: ':';
	}

	.val {
		color: var(--ctp-text);
	}

	.projects {
		display: inline;
	}

	.colors {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.block {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 3px;
	}

	@media (max-width: 640px) {
		.row {
			flex-wrap: wrap;
		}

		.key {
			min-width: 10ch;
		}

		.separator {
			overflow: hidden;
		}
	}
</style>
