import type { Action } from 'svelte/action';
import { motion } from '$lib/stores/motion.svelte';
import { cssEase } from '../tokens';

type Params = { y?: number; delay?: number; stagger?: number; children?: boolean } | undefined;

/**
 * Reveal on first intersection with WAAPI (no GSAP needed). With `children`, each
 * direct child is revealed with a stagger. Content is visible without JS: the
 * hidden state is only applied once this action runs.
 */
export const reveal: Action<HTMLElement, Params> = (node, params = {}) => {
	const { y = 24, delay = 0, stagger = 0.06, children = false } = params;
	const targets = children ? (Array.from(node.children) as HTMLElement[]) : [node];
	if (motion.reduced) return;

	for (const t of targets) t.style.opacity = '0';
	const io = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			io.disconnect();
			targets.forEach((t, i) => {
				t.animate(
					[
						{ opacity: 0, transform: `translate3d(0, ${y}px, 0)` },
						{ opacity: 1, transform: 'none' }
					],
					{
						duration: 700,
						delay: (delay + i * stagger) * 1000,
						easing: cssEase.lens,
						fill: 'backwards'
					}
				);
				t.style.opacity = '';
			});
		},
		{ rootMargin: '0px 0px -10% 0px' }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
			for (const t of targets) t.style.opacity = '';
		}
	};
};
