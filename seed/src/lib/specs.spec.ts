import { describe, expect, it } from 'vitest';
import { dori, horizontalFov, horizontalPixels } from './specs.js';

describe('optics maths', () => {
	it('uses standard sensor resolutions, with 16:9 maths as a fallback', () => {
		expect(horizontalPixels(8)).toBe(3840);
		expect(horizontalPixels(2)).toBe(1920);
		expect(horizontalPixels(2.07)).toBe(1918);
	});

	it('DORI distances scale with focal length and keep D > O > R > I', () => {
		const wide = dori(4, 2.8, '1/1.8″');
		const tele = dori(4, 12, '1/1.8″');
		expect(wide.detect).toBeGreaterThan(wide.observe);
		expect(wide.observe).toBeGreaterThan(wide.recognize);
		expect(wide.recognize).toBeGreaterThan(wide.identify);
		expect(tele.detect / wide.detect).toBeCloseTo(12 / 2.8, 1);
	});

	it('gives a plausible FOV for a 2.8 mm lens on a 1/2.8″ sensor', () => {
		const fov = horizontalFov(2.8, '1/2.8″');
		expect(fov).toBeGreaterThan(85);
		expect(fov).toBeLessThan(95);
	});
});
