import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import type { Plugin } from 'vite';

/** `import data from './file.ttf?base64'`: binary assets bundled into server code. */
const base64 = (): Plugin => ({
	name: 'dh:base64',
	enforce: 'pre',
	load(id) {
		if (!id.endsWith('?base64')) return;
		const file = id.slice(0, -'?base64'.length);
		return `export default ${JSON.stringify(fs.readFileSync(file).toString('base64'))};`;
	}
});

/**
 * Production builds ship the seed images as static files at /fixtures/images, so a
 * deployment without a Sanity project still has its imagery (dev resizes them on request).
 */
const fixtureImages = (): Plugin => ({
	name: 'dh:fixture-images',
	apply: 'build',
	writeBundle(options) {
		if (this.environment.name !== 'client' || !options.dir) return;
		fs.cpSync(path.resolve('../../seed/data/images'), path.join(options.dir, 'fixtures/images'), {
			recursive: true
		});
	}
});

export default defineConfig({
	plugins: [
		base64(),
		fixtureImages(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// E2E builds skip the Vercel adapter (its function tracing is slow); vite preview doesn't need it.
			adapter: process.env.E2E_BUILD ? undefined : adapter({ runtime: 'nodejs22.x' }),
			// One .env at the monorepo root serves web, studio and seed.
			env: { dir: '../..' },
			alias: { $fixtures: '../../seed/data' },
			// Inline small stylesheets: removes render-blocking round trips on slow mobile networks.
			inlineStyleThreshold: 80_000
		})
	],
	server: { fs: { allow: ['../../seed/data'] } },
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
