import type { Action } from 'svelte/action';
import { motion } from '$lib/stores/motion.svelte';
import { withGsap } from '../gsap';

type Params =
	| {
			by?: 'words' | 'lines' | 'chars';
			stagger?: number;
			delay?: number;
			/** Play on mount (hero) instead of when scrolled into view. */
			immediate?: boolean;
	  }
	| undefined;

/** An immediate reveal only plays if GSAP arrives while the page is still "opening". */
const IMMEDIATE_WINDOW_MS = 1400;

/**
 * Masked word/line reveal with GSAP SplitText. Text is never hidden while waiting for
 * GSAP (it is server-rendered and can be the LCP element); if GSAP arrives too late for
 * an immediate reveal, the text simply stays as it is. `aria: 'auto'` keeps an
 * aria-label so screen readers read the sentence, not fragments.
 */
export const splitText: Action<HTMLElement, Params> = (node, params = {}) => {
	const { by = 'words', stagger = 0.06, delay = 0, immediate = false } = params;
	if (motion.reduced) return;
	const mounted = performance.now();

	const cleanup = withGsap(node, ({ gsap, SplitText }) => {
		if (immediate && performance.now() - mounted > IMMEDIATE_WINDOW_MS) return;
		const split = SplitText.create(node, {
			type: by === 'chars' ? 'words,chars' : by,
			mask: by === 'chars' ? 'words' : by,
			aria: 'auto',
			autoSplit: true,
			onSplit(self) {
				const targets = by === 'chars' ? self.chars : by === 'lines' ? self.lines : self.words;
				return gsap.from(targets, {
					yPercent: 110,
					duration: 1,
					stagger,
					delay: immediate ? Math.max(0, delay - (performance.now() - mounted) / 1000) : delay,
					ease: 'lens',
					scrollTrigger: immediate ? undefined : { trigger: node, start: 'top 85%', once: true }
				});
			}
		});
		return () => split.revert();
	});

	return { destroy: cleanup };
};
