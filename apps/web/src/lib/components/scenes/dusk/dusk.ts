const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Scroll choreography for Dusk to Night:
 * 0–0.35  day fades to (conventional) night
 * 0.4–0.9 LumaNight wipes in from the left (split 0 → 100)
 */
export function phases(p: number) {
	return {
		day: 1 - clamp(p / 0.35),
		split: clamp((p - 0.4) / 0.5) * 100
	};
}

/** Scene illuminance on a log scale: 10,000 lux (daylight) → 0.0005 lux (moonless street). */
export function luxAt(p: number): string {
	const t = clamp(p / 0.4);
	const log = Math.log10(10000) + (Math.log10(0.0005) - Math.log10(10000)) * t;
	const v = 10 ** log;
	if (v >= 100) return Math.round(v).toLocaleString('en');
	if (v >= 1) return v.toFixed(1);
	return v.toPrecision(1).replace(/^0\.0*/, (m) => m);
}
