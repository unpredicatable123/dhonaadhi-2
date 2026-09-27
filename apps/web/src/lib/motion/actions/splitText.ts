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

/**
 * Masked word/line reveal with GSAP SplitText. `aria: 'auto'` keeps an aria-label on the
 * element so screen readers read the sentence, not fragments.
 */
export const splitText: Action<HTMLElement, Params> = (node, params = {}) => {
	const { by = 'words', stagger = 0.06, delay = 0, immediate = false } = params;
	if (motion.reduced) return;
	node.style.visibility = 'hidden';

	const cleanup = withGsap(node, ({ gsap, SplitText }) => {
		const split = SplitText.create(node, {
			type: by === 'chars' ? 'words,chars' : by,
			mask: by === 'chars' ? 'words' : by,
			aria: 'auto',
			autoSplit: true,
			onSplit(self) {
				node.style.visibility = '';
				const targets = by === 'chars' ? self.chars : by === 'lines' ? self.lines : self.words;
				return gsap.from(targets, {
					yPercent: 110,
					duration: 1,
					stagger,
					delay,
					ease: 'lens',
					scrollTrigger: immediate ? undefined : { trigger: node, start: 'top 85%', once: true }
				});
			}
		});
		return () => split.revert();
	});

	return {
		destroy() {
			cleanup();
			node.style.visibility = '';
		}
	};
};
