import type Lenis from 'lenis';
import { loadGsap } from './gsap';

let instance: Lenis | undefined;
let tick: ((t: number) => void) | undefined;

/** Smooth-scroll singleton, driven by the GSAP ticker so ScrollTrigger stays in lockstep. */
export async function startLenis(): Promise<Lenis> {
	if (instance) return instance;
	const [{ default: LenisCtor }, { gsap, ScrollTrigger }] = await Promise.all([
		import('lenis'),
		loadGsap()
	]);
	if (instance) return instance;
	const lenis = new LenisCtor({
		autoRaf: false,
		lerp: 0.1,
		anchors: { offset: -88 },
		// let dialogs, drawers and horizontally scrolling rails scroll natively
		prevent: (node) => node.closest('dialog, [data-lenis-prevent]') !== null
	});
	lenis.on('scroll', ScrollTrigger.update);
	tick = (t: number) => lenis.raf(t * 1000);
	gsap.ticker.add(tick);
	gsap.ticker.lagSmoothing(0);
	instance = lenis;
	return lenis;
}

export async function stopLenis(): Promise<void> {
	if (!instance) return;
	const { gsap } = await loadGsap();
	if (tick) gsap.ticker.remove(tick);
	instance.destroy();
	instance = undefined;
	tick = undefined;
}

export function getLenis(): Lenis | undefined {
	return instance;
}

/** Jump to top without smoothing (route changes). */
export function resetScroll(): void {
	if (instance) instance.scrollTo(0, { immediate: true, force: true });
	else window.scrollTo(0, 0);
}
