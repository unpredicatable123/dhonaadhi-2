import { describe, expect, it } from 'vitest';
import { luxAt, phases } from './dusk';

describe('dusk to night choreography', () => {
	it('fades day out before the LumaNight wipe starts', () => {
		expect(phases(0)).toEqual({ day: 1, split: 0 });
		expect(phases(0.35).day).toBe(0);
		expect(phases(0.4).split).toBe(0);
		expect(phases(0.9).split).toBe(100);
		expect(phases(1).split).toBe(100);
	});

	it('drops illuminance logarithmically from daylight to 0.0005 lux', () => {
		expect(luxAt(0)).toBe('10,000');
		expect(luxAt(1)).toBe('0.0005');
		expect(Number(luxAt(0.2))).toBeCloseTo(2.2, 0);
	});
});
