import { ease, duration } from './tokens';

type GsapBundle = {
	gsap: typeof import('gsap').gsap;
	ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
	SplitText: typeof import('gsap/SplitText').SplitText;
	Flip: typeof import('gsap/Flip').Flip;
};

let bundle: Promise<GsapBundle> | undefined;
let refreshQueued = false;

/**
 * Triggers created after load (lazy scenes) add pin spacers that shift everything below;
 * one debounced refresh re-measures all triggers and tells Lenis the new scroll height.
 */
function queueRefresh(g: GsapBundle) {
	if (refreshQueued) return;
	refreshQueued = true;
	requestAnimationFrame(() => {
		refreshQueued = false;
		g.ScrollTrigger.refresh();
		window.dispatchEvent(new Event('dh:layout'));
	});
}

const bezier = (p: readonly number[]) => `M0,0 C${p[0]},${p[1]} ${p[2]},${p[3]} 1,1`;

/**
 * Lazily loads GSAP + plugins once (kept off the critical path so LCP is never blocked
 * by animation code). Browser-only.
 */
export function loadGsap(): Promise<GsapBundle> {
	bundle ??= Promise.all([
		import('gsap'),
		import('gsap/ScrollTrigger'),
		import('gsap/SplitText'),
		import('gsap/Flip'),
		import('gsap/CustomEase')
	]).then(([{ gsap }, { ScrollTrigger }, { SplitText }, { Flip }, { CustomEase }]) => {
		gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase);
		CustomEase.create('lens', bezier(ease.lens));
		CustomEase.create('shutter', bezier(ease.shutter));
		gsap.defaults({ ease: 'lens', duration: duration.slow });
		ScrollTrigger.config({ ignoreMobileResize: true });
		return { gsap, ScrollTrigger, SplitText, Flip };
	});
	return bundle;
}

/**
 * Runs `setup` inside a gsap.context scoped to `scope` once GSAP has loaded.
 * Returns a synchronous cleanup that reverts every tween/ScrollTrigger created —
 * safe to return straight from $effect or an action's destroy().
 */
export function withGsap(
	scope: Element,
	setup: (g: GsapBundle) => void | (() => void)
): () => void {
	let disposed = false;
	let revert: (() => void) | undefined;
	loadGsap().then((g) => {
		if (disposed) return;
		let extra: void | (() => void);
		const ctx = g.gsap.context(() => {
			extra = setup(g);
		}, scope);
		queueRefresh(g);
		revert = () => {
			if (typeof extra === 'function') extra();
			ctx.revert();
			queueRefresh(g);
		};
	});
	return () => {
		disposed = true;
		revert?.();
	};
}
