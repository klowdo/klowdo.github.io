import { sveltekit } from '@sveltejs/kit/vite';
import yaml from '@modyfi/vite-plugin-yaml';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [yaml(), sveltekit()],
	server: {
		port: 5242
	}
});
