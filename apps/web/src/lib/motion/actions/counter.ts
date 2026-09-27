import type { Action } from 'svelte/action';
import { motion } from '$lib/stores/motion.svelte';

type Params = { to: number; decimals?: number; duration?: number; locale?: string };

/**
 * Counts from 0 to `to` when first visible. The final value is server-rendered as text,
 * so crawlers, screen readers and no-JS users always get the real number.
 */
export const counter: Action<HTMLElement, Params> = (node, params) => {
	const { to, decimals = 0, duration = 1600, locale = 'en' } = params;
	const fmt = new Intl.NumberFormat(locale, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});
	const final = fmt.format(to);
	if (motion.reduced) return;

	let raf = 0;
	const io = new IntersectionObserver(([entry]) => {
		if (!entry.isIntersecting) return;
		io.disconnect();
		const start = performance.now();
		const step = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			node.textContent = fmt.format(to * (1 - Math.pow(1 - t, 4)));
			if (t < 1) raf = requestAnimationFrame(step);
			else node.textContent = final;
		};
		raf = requestAnimationFrame(step);
	});
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
			cancelAnimationFrame(raf);
			node.textContent = final;
		}
	};
};
