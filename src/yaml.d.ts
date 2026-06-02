declare module '*.yaml' {
	const data: Record<string, unknown> & {
		contact: { name: string; email: string; phone: string; address: string };
		title: string;
		mainText: string;
		skills: string[];
		workItems: { name: string; place: string; from: string; to?: string; items: string[] }[];
		website: string;
		github: { label: string; url: string };
		linkedin: { label: string; url: string };
		resume: { label: string; url: string };
		languages: string[];
		interests: string[];
		projects: { name: string; url: string }[];
	};
	export default data;
}
