import { describe, expect, it } from 'vitest';
import { frameUrl, loadOrder, nearestLoaded } from './sequence';

describe('image sequence', () => {
	it('loads coarse frames first and every frame exactly once', () => {
		const order = loadOrder(120);
		expect(order.slice(0, 3)).toEqual([0, 8, 16]);
		expect(new Set(order).size).toBe(120);
	});

	it('supports a reduced frame set (every other frame on mobile)', () => {
		const order = loadOrder(120, 2);
		expect(order).toHaveLength(60);
		expect(order.every((f) => f % 2 === 0)).toBe(true);
	});

	it('falls back to the nearest loaded frame', () => {
		const a = {} as HTMLImageElement;
		const b = {} as HTMLImageElement;
		const loaded: (HTMLImageElement | undefined)[] = [];
		loaded[8] = a;
		loaded[16] = b;
		expect(nearestLoaded(13, loaded)).toBe(b);
		expect(nearestLoaded(10, loaded)).toBe(a);
	});

	it('formats zero-padded frame URLs', () => {
		expect(frameUrl('/sequences/exploded', 7)).toBe('/sequences/exploded/007.webp');
	});
});
