const startYear = 2015;

export const profile = {
	name: 'Felix Svensson',
	title: 'Friendly developer',
	email: 'felix@flixen.se',
	website: 'flixen.se',
	github: { label: 'klowdo', url: 'https://github.com/klowdo' },
	linkedin: { label: 'felix-svensson', url: 'https://linkedin.com/in/felix-svensson' },
	resume: {
		label: 'resume.pdf',
		url: 'https://github.com/klowdo/Resume/releases/latest/download/resume.pdf'
	},
	languages: ['C#/.NET', 'Go', 'TypeScript'],
	experience: `~${new Date().getFullYear() - startYear} years`,
	interests: ['Event Sourcing', 'Clean Architecture', 'Pizza'],
	image: '/images/Felix.jpeg',
	projects: [
		{ name: 'Resume in C#', url: 'https://github.com/klowdo/resume' },
		{ name: 'NixOS Config', url: 'https://github.com/klowdo/nixos-config' },
		{ name: 'SalaryCalculator', url: 'https://github.com/klowdo/SalaryCalculator' },
		{ name: 'PaymentSystemCqrs', url: 'https://github.com/klowdo/PaymentSystemCqrs' },
		{ name: 'TollCalculator', url: 'https://github.com/klowdo/TollCalculator' }
	]
};
