/**
 * Progressive image-sequence loader: coarse frames first (every 8th, then every 4th, …)
 * so scrubbing works almost immediately and fills in detail as it loads.
 */
export function loadOrder(count: number, step = 1): number[] {
	const frames = Array.from({ length: Math.ceil(count / step) }, (_, i) => i * step).filter(
		(f) => f < count
	);
	const order: number[] = [];
	const seen = new Set<number>();
	for (const stride of [8, 4, 2, 1]) {
		for (let i = 0; i < frames.length; i += stride) {
			const f = frames[i];
			if (!seen.has(f)) {
				seen.add(f);
				order.push(f);
			}
		}
	}
	return order;
}

/** Nearest loaded frame to `target` (searching outward). */
export function nearestLoaded(
	target: number,
	loaded: (HTMLImageElement | undefined)[]
): HTMLImageElement | undefined {
	for (let d = 0; d < loaded.length; d++) {
		const a = loaded[target - d];
		if (a) return a;
		const b = loaded[target + d];
		if (b) return b;
	}
	return undefined;
}

export function frameUrl(base: string, i: number): string {
	return `${base.replace(/\/?$/, '/')}${String(i).padStart(3, '0')}.webp`;
}

/** Corner slots for callout cards (% of the frame), assigned in order. */
export const SLOTS = [
	{ x: 4, y: 8, align: 'left' },
	{ x: 96, y: 72, align: 'right' },
	{ x: 96, y: 8, align: 'right' },
	{ x: 4, y: 72, align: 'left' }
] as const;
