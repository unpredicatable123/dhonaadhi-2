import type { Action } from 'svelte/action';
import { motion } from '$lib/stores/motion.svelte';
import { withGsap } from '../gsap';

/** Scroll-linked vertical drift. `speed` 0.2 = travels 20% of its height across the viewport pass. */
export const parallax: Action<HTMLElement, { speed?: number } | undefined> = (node, params) => {
	if (motion.reduced) return;
	const speed = params?.speed ?? 0.2;
	const cleanup = withGsap(node, ({ gsap }) => {
		gsap.fromTo(
			node,
			{ yPercent: -speed * 50 },
			{
				yPercent: speed * 50,
				ease: 'none',
				scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true }
			}
		);
	});
	return { destroy: cleanup };
};
