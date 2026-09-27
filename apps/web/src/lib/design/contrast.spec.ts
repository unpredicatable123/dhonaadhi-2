import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrast } from './contrast';
import { pairs, palette } from './tokens';

describe('design tokens', () => {
	it('tokens.ts mirrors the @theme palette in app.css', () => {
		const css = readFileSync(new URL('../../app.css', import.meta.url), 'utf8');
		for (const [name, hex] of Object.entries(palette)) {
			expect(css, name).toContain(`--color-${name}: ${hex};`);
		}
	});

	it('computes known reference ratios', () => {
		expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
		expect(contrast('#e8edf4', '#07090d')).toBeCloseTo(16.94, 1);
	});

	it.each(pairs)('$fg on $bg ($use) meets $min:1', ({ fg, bg, min }) => {
		expect(contrast(palette[fg], palette[bg])).toBeGreaterThanOrEqual(min);
	});
});
