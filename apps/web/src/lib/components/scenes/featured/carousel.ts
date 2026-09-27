import type { Action } from 'svelte/action';
import { motion } from '$lib/stores/motion.svelte';

/**
 * Mouse drag-to-scroll with momentum on a horizontal scroller. Touch keeps native
 * scrolling. A small movement threshold keeps clicks on cards working.
 */
export const dragScroll: Action<HTMLElement> = (node) => {
	let down = false;
	let moved = false;
	let startX = 0;
	let startScroll = 0;
	let lastX = 0;
	let lastT = 0;
	let v = 0;
	let raf = 0;

	const onDown = (e: PointerEvent) => {
		if (e.pointerType !== 'mouse' || e.button !== 0) return;
		cancelAnimationFrame(raf);
		down = true;
		moved = false;
		startX = lastX = e.clientX;
		startScroll = node.scrollLeft;
		lastT = performance.now();
		v = 0;
	};
	const onMove = (e: PointerEvent) => {
		if (!down) return;
		const dx = e.clientX - startX;
		if (!moved && Math.abs(dx) > 6) {
			moved = true;
			node.classList.add('dragging');
			node.setPointerCapture(e.pointerId);
		}
		if (!moved) return;
		node.scrollLeft = startScroll - dx;
		const now = performance.now();
		v = (e.clientX - lastX) / Math.max(1, now - lastT);
		lastX = e.clientX;
		lastT = now;
	};
	const onUp = () => {
		if (!down) return;
		down = false;
		if (!moved) return;
		// Glide with friction, then let scroll-snap settle.
		let vel = -v * 16;
		const glide = () => {
			if (motion.reduced || Math.abs(vel) < 0.4) {
				node.classList.remove('dragging');
				return;
			}
			node.scrollLeft += vel;
			vel *= 0.93;
			raf = requestAnimationFrame(glide);
		};
		raf = requestAnimationFrame(glide);
	};
	const onClick = (e: MouseEvent) => {
		if (moved) {
			e.preventDefault();
			e.stopPropagation();
			moved = false;
		}
	};

	node.addEventListener('pointerdown', onDown);
	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerup', onUp);
	node.addEventListener('pointercancel', onUp);
	node.addEventListener('click', onClick, true);
	return {
		destroy() {
			cancelAnimationFrame(raf);
			node.removeEventListener('pointerdown', onDown);
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerup', onUp);
			node.removeEventListener('pointercancel', onUp);
			node.removeEventListener('click', onClick, true);
		}
	};
};

/** 3D perspective: cards rotate away from the centre of the scroller as they move. */
export const perspective: Action<HTMLElement> = (node) => {
	let raf = 0;
	const update = () => {
		raf = 0;
		if (motion.reduced) return;
		const box = node.getBoundingClientRect();
		const centre = box.left + box.width / 2;
		for (const slide of node.querySelectorAll<HTMLElement>('.slide')) {
			const r = slide.getBoundingClientRect();
			const d = (r.left + r.width / 2 - centre) / box.width; // −0.5 … 0.5 across the viewport
			const rot = Math.max(-18, Math.min(18, -d * 28));
			slide.style.transform = `rotateY(${rot.toFixed(2)}deg) translateZ(${(-Math.abs(d) * 60).toFixed(1)}px)`;
		}
	};
	const onScroll = () => {
		if (!raf) raf = requestAnimationFrame(update);
	};
	node.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	update();
	return {
		destroy() {
			cancelAnimationFrame(raf);
			node.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		}
	};
};
