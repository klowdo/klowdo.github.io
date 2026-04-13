<script lang="ts">
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/700.css';
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { profile } from '$lib/data/profile';

	let { children }: { children: Snippet } = $props();

	const siteUrl = 'https://flixen.se';
	const imageUrl = `${siteUrl}${profile.image}`;
	const title = `${profile.name} — ${profile.title}`;
	const description = `${profile.name} is a ${profile.title.toLowerCase()} with ${profile.experience} of experience in ${profile.languages.join(', ')}. Interested in ${profile.interests.join(', ')}.`;
	const [firstName, ...rest] = profile.name.split(' ');
	const lastName = rest.join(' ');

	const personLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		givenName: firstName,
		familyName: lastName,
		jobTitle: profile.title,
		email: `mailto:${profile.email}`,
		url: siteUrl,
		image: imageUrl,
		sameAs: [profile.github.url, profile.linkedin.url],
		knowsAbout: [...profile.languages, ...profile.interests]
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content={profile.name} />
	<meta name="theme-color" content="#1e1e2e" />
	<link rel="canonical" href="{siteUrl}/" />

	<meta property="og:type" content="profile" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{siteUrl}/" />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:locale" content="en_US" />
	<meta property="profile:first_name" content={firstName} />
	<meta property="profile:last_name" content={lastName} />
	<meta property="profile:username" content={profile.github.label} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{@html `<script type="application/ld+json">${JSON.stringify(personLd)}</` + `script>`}
</svelte:head>

{@render children()}
