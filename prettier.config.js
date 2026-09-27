/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{ files: ['*.md', '*.yaml', '*.yml'], options: { useTabs: false } }
	],
	tailwindStylesheet: './apps/web/src/app.css'
};

export default config;
