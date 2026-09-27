import { defineCliConfig } from 'sanity/cli';
import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const rootEnv = resolve(import.meta.dirname, '../.env');
if (existsSync(rootEnv)) loadEnvFile(rootEnv);

export default defineCliConfig({
	api: {
		projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
		dataset: process.env.PUBLIC_SANITY_DATASET || 'production'
	},
	server: { port: 3333 },
	vite: (config) => ({ ...config, envDir: '..', envPrefix: ['SANITY_STUDIO_', 'PUBLIC_'] }),
	typegen: {
		path: ['../apps/web/src/lib/sanity/queries.ts'],
		schema: './schema.json',
		generates: '../packages/sanity-types/src/sanity.types.ts',
		overloadClientMethods: false
	}
});
