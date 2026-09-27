import type { Action } from 'svelte/action';
import { motion } from '$lib/stores/motion.svelte';

/**
 * Shared pointer tracker: rAF-throttled, fine pointers only. Calls `apply` with the
 * normalised pointer position (0–1) and `reset` on leave.
 */
function trackPointer(
	node: HTMLElement,
	apply: (px: number, py: number) => void,
	reset: () => void
): { destroy(): void } | undefined {
	if (!matchMedia('(pointer: fine)').matches) return;
	let raf = 0;
	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width;
		const py = (e.clientY - r.top) / r.height;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => apply(px, py));
	};
	const leave = () => {
		cancelAnimationFrame(raf);
		reset();
	};
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			cancelAnimationFrame(raf);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
}

function settle(node: HTMLElement, prop: 'transform' | 'translate', ms: number) {
	node.style.transition = `${prop} ${ms}ms var(--ease-lens)`;
	node.style[prop] = '';
	setTimeout(() => (node.style.transition = ''), ms);
}

/** Pulls the element toward the pointer. `strength` in px at the edge. */
export const magnetic: Action<HTMLElement, { strength?: number } | undefined> = (node, params) => {
	const strength = params?.strength ?? 10;
	return trackPointer(
		node,
		(px, py) => {
			if (motion.reduced) return;
			node.style.translate = `${(px - 0.5) * 2 * strength}px ${(py - 0.5) * 2 * strength}px`;
		},
		() => settle(node, 'translate', 500)
	);
};

/**
 * Subtle 3D tilt (max 6° by default) and the pointer position as CSS vars --mx / --my
 * for spotlight gradients. `spotlightOnly` skips the tilt.
 */
export const tilt: Action<HTMLElement, { max?: number; spotlightOnly?: boolean } | undefined> = (
	node,
	params
) => {
	const max = params?.max ?? 6;
	return trackPointer(
		node,
		(px, py) => {
			node.style.setProperty('--mx', `${px * 100}%`);
			node.style.setProperty('--my', `${py * 100}%`);
			if (motion.reduced || params?.spotlightOnly) return;
			node.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
		},
		() => settle(node, 'transform', 600)
	);
};
