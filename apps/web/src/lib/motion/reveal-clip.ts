import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { motion } from '$lib/stores/motion.svelte';

/** Svelte transition: clip-path wipe from the top edge (mega menu, drawers). */
export function clipReveal(
	_node: Element,
	{ duration = 420 }: { duration?: number } = {}
): TransitionConfig {
	if (motion.reduced) return { duration: 120, css: (t) => `opacity:${t}` };
	return {
		duration,
		easing: cubicOut,
		css: (t) => `clip-path: inset(0 0 ${(1 - t) * 100}% 0); opacity: ${Math.min(1, t * 1.6)};`
	};
}
