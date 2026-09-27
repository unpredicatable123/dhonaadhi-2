import { browser } from '$app/environment';

export type MotionPref = 'system' | 'reduced' | 'full';
export const MOTION_COOKIE = 'dh-motion';

/**
 * Single source of truth for reduced motion: OS setting combined with the footer toggle.
 * Components read `motion.reduced`; never query matchMedia directly.
 * The preference is stored in a cookie so SSR renders the right `data-motion` attribute.
 */
class MotionState {
	os = $state(false);
	pref = $state<MotionPref>('system');

	reduced = $derived(this.pref === 'reduced' || (this.pref === 'system' && this.os));

	init(initial: MotionPref) {
		this.pref = initial;
		if (!browser) return () => {};
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.os = mq.matches;
		const onChange = (e: MediaQueryListEvent) => (this.os = e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}

	set(pref: MotionPref) {
		this.pref = pref;
		if (!browser) return;
		document.cookie = `${MOTION_COOKIE}=${pref}; path=/; max-age=31536000; samesite=lax`;
	}
}

export const motion = new MotionState();

export function parseMotionPref(v: string | undefined): MotionPref {
	return v === 'reduced' || v === 'full' ? v : 'system';
}
