import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/navigation', () => ({ afterNavigate: vi.fn(), onNavigate: vi.fn() }));
vi.mock('$lib/stores/motion.svelte', () => ({ motion: { reduced: false } }));

const { transitionFor } = await import('./transitions');
const u = (p: string) => new URL(p, 'https://dhonaadhi.test');

describe('transitionFor', () => {
	it('uses the shutter between top-level sections', () => {
		expect(transitionFor(u('/'), u('/products'), false)).toBe('shutter');
		expect(transitionFor(u('/products/cameras'), u('/coming-soon/solutions'), false)).toBe(
			'shutter'
		);
	});

	it('morphs within a section (card → product detail)', () => {
		expect(
			transitionFor(u('/products/cameras/bullet'), u('/products/cameras/bullet/nb-8m'), false)
		).toBe('morph');
	});

	it('does nothing for same-path navigations such as filter changes', () => {
		expect(
			transitionFor(u('/products/cameras/bullet'), u('/products/cameras/bullet?mp=8'), false)
		).toBe('none');
	});

	it('does nothing under reduced motion or on first load', () => {
		expect(transitionFor(u('/'), u('/products'), true)).toBe('none');
		expect(transitionFor(null, u('/products'), false)).toBe('none');
	});
});
