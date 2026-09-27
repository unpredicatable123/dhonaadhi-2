import { describe, expect, it } from 'vitest';
import { coverMap, isVisible } from './cover';

const img = { width: 1600, height: 900 };
const box = { x: 70, y: 60, w: 5, h: 18 };

describe('coverMap', () => {
	it('is the identity when aspect ratios match', () => {
		const r = coverMap(box, { width: 1920, height: 1080 }, img);
		expect(r.x).toBeCloseTo(70);
		expect(r.w).toBeCloseTo(5);
	});

	it('shifts and widens boxes when a tall viewport crops the sides', () => {
		const r = coverMap(box, { width: 375, height: 812 }, img);
		// 812/900 scale → drawn width 1443.6, offset −534.3 → x ≈ 127% (off-screen)
		expect(r.x).toBeGreaterThan(100);
		expect(r.w).toBeGreaterThan(5);
		expect(isVisible(r)).toBe(false);
		const centre = coverMap({ x: 45, y: 50, w: 10, h: 20 }, { width: 375, height: 812 }, img);
		expect(isVisible(centre)).toBe(true);
	});
});
