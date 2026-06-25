import data from '../../../resume/profile.yaml';

const startYear = 2015;

export const profile = {
	name: data.contact.name,
	title: data.title,
	email: data.contact.email,
	website: data.website,
	github: data.github,
	linkedin: data.linkedin,
	resume: data.resume,
	languages: data.languages,
	experience: `~${new Date().getFullYear() - startYear} years`,
	interests: data.interests,
	image: '/images/Felix.webp',
	projects: data.projects
};
