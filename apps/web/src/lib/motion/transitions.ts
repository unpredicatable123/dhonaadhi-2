import { afterNavigate, onNavigate } from '$app/navigation';
import type { OnNavigate } from '@sveltejs/kit';
import { motion } from '$lib/stores/motion.svelte';
import { getLenis, resetScroll } from './lenis';
import { loadGsap } from './gsap';
import type { ShutterApi } from './Shutter.svelte';

const section = (url: URL | null | undefined) => url?.pathname.split('/')[1] ?? '';

export type TransitionKind = 'none' | 'shutter' | 'morph';

/**
 * Pure decision (unit-tested):
 * - same pathname (filters, sort, hash) → none: listings animate their own reflow
 * - different top-level section → shutter
 * - same section → view-transition morph (shared product image), cross-fade fallback
 */
export function transitionFor(
	from: URL | null | undefined,
	to: URL | null | undefined,
	reduced: boolean
): TransitionKind {
	if (reduced || !from || !to) return 'none';
	if (from.pathname === to.pathname) return 'none';
	return section(from) === section(to) ? 'morph' : 'shutter';
}

/** New pages start at the top, except back/forward (restored) and in-page anchors. */
function startsAtTop(navigation: OnNavigate): boolean {
	return (
		navigation.type !== 'popstate' &&
		!navigation.to?.url.hash &&
		navigation.from?.url.pathname !== navigation.to?.url.pathname
	);
}

/**
 * Scroll must reset before the new page is revealed (inside the view-transition update,
 * or while the shutter is closed); otherwise the new page is captured at the old offset
 * and visibly jumps to the top afterwards.
 */
function viewTransition(navigation: OnNavigate): Promise<void> | void {
	if (!document.startViewTransition) return;
	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete.catch(() => undefined);
			if (startsAtTop(navigation)) resetScroll();
		});
	});
}

/** Registers page transitions + post-navigation housekeeping. Call once from the root layout. */
export function setupPageTransitions(getShutter: () => ShutterApi | undefined): void {
	const handler = (navigation: OnNavigate) => {
		const kind = transitionFor(navigation.from?.url, navigation.to?.url, motion.reduced);
		const shutter = getShutter();
		if (kind === 'none') return;
		if (kind === 'morph' || !shutter) return viewTransition(navigation);

		getLenis()?.stop();
		return new Promise<void>((resolve) => {
			shutter.close().then(async () => {
				resolve();
				await navigation.complete.catch(() => undefined);
				getLenis()?.start();
				if (startsAtTop(navigation)) resetScroll();
				await shutter.open();
			});
		});
	};
	onNavigate(handler);

	afterNavigate(({ type, from, to }) => {
		if (type === 'enter') return;
		getLenis()?.resize();
		loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
		// Same-path navigations (filters, sort, pagination) keep scroll position and focus.
		if (from?.url.pathname === to?.url.pathname) return;
		if (type !== 'popstate' && !to?.url.hash) resetScroll();
		// Move focus to the new page's content so keyboard users don't re-traverse the header.
		if (type === 'link' || type === 'goto') {
			document.getElementById('main')?.focus({ preventScroll: true });
		}
	});
}
