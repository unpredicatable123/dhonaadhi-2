/** Mirror of the @theme palette in src/app.css (kept in sync by contrast.spec.ts). */
export const palette = {
	'ink-950': '#07090d',
	'ink-900': '#0c1017',
	'ink-800': '#141a23',
	'ink-700': '#1f2733',
	'steel-400': '#8a95a8',
	'steel-500': '#6b7689',
	'steel-600': '#566173',
	'mist-100': '#e8edf4',
	'paper-50': '#f6f8fb',
	'optic-400': '#2fe6c8',
	'optic-600': '#12b89e',
	'optic-700': '#086a5b',
	'thermal-400': '#ffb547',
	'thermal-700': '#8a5200',
	'signal-blue': '#4c8dff',
	'signal-blue-600': '#2a5fc4',
	'alert-500': '#ff5a5f',
	'alert-600': '#c4282e'
} as const;

export type Token = keyof typeof palette;

/** Pairs that ship in the UI, with the WCAG threshold each must meet. */
export const pairs: { fg: Token; bg: Token; min: 4.5 | 3; use: string }[] = [
	{ fg: 'mist-100', bg: 'ink-950', min: 4.5, use: 'body text (dark)' },
	{ fg: 'mist-100', bg: 'ink-800', min: 4.5, use: 'text on raised' },
	{ fg: 'steel-400', bg: 'ink-950', min: 4.5, use: 'muted text (dark)' },
	{ fg: 'steel-400', bg: 'ink-800', min: 4.5, use: 'muted text on raised' },
	{ fg: 'optic-400', bg: 'ink-950', min: 4.5, use: 'accent text / focus (dark)' },
	{ fg: 'optic-600', bg: 'ink-900', min: 4.5, use: 'accent hover (dark)' },
	{ fg: 'thermal-400', bg: 'ink-900', min: 4.5, use: 'stats (dark)' },
	{ fg: 'signal-blue', bg: 'ink-800', min: 4.5, use: 'links on raised' },
	{ fg: 'alert-500', bg: 'ink-800', min: 4.5, use: 'errors on raised' },
	{ fg: 'ink-950', bg: 'optic-400', min: 4.5, use: 'primary button' },
	{ fg: 'ink-950', bg: 'optic-600', min: 4.5, use: 'primary button hover' },
	{ fg: 'ink-950', bg: 'thermal-400', min: 4.5, use: 'thermal badge' },
	{ fg: 'ink-950', bg: 'paper-50', min: 4.5, use: 'body text (light)' },
	{ fg: 'steel-600', bg: 'paper-50', min: 4.5, use: 'muted text (light)' },
	{ fg: 'optic-700', bg: 'paper-50', min: 4.5, use: 'accent text / focus (light)' },
	{ fg: 'thermal-700', bg: 'paper-50', min: 4.5, use: 'highlight (light)' },
	{ fg: 'signal-blue-600', bg: 'paper-50', min: 4.5, use: 'links (light)' },
	{ fg: 'alert-600', bg: 'paper-50', min: 4.5, use: 'errors (light)' },
	{ fg: 'steel-500', bg: 'ink-800', min: 3, use: 'control borders (dark)' },
	{ fg: 'steel-500', bg: 'paper-50', min: 3, use: 'control borders (light)' }
];
