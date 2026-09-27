const quote = (files) => files.map((f) => JSON.stringify(f)).join(' ');

/** @type {import('lint-staged').Configuration} */
export default {
	'apps/web/**/*.{ts,js,svelte}': (files) => [
		`prettier --write ${quote(files)}`,
		`pnpm --dir apps/web exec eslint --fix --no-warn-ignored ${quote(files)}`
	],
	'{studio,seed,tools,packages}/**/*.{ts,tsx,js,mjs}': 'prettier --write',
	'**/*.{css,md,json}': 'prettier --write'
};
