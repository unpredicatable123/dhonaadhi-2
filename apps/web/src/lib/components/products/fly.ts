import { motion } from '$lib/stores/motion.svelte';
import { cssEase } from '$lib/motion/tokens';

/**
 * "Adding to compare" feedback: a snapshot of the card image flies into the compare
 * tray (or the header compare icon if the tray is closed). transform/opacity only.
 */
export function flyToTray(source: HTMLElement): void {
	if (motion.reduced) return;
	requestAnimationFrame(() => {
		const target =
			document.querySelector<HTMLElement>('[data-compare-target]:not([hidden])') ??
			document.querySelector<HTMLElement>('[data-compare-icon]');
		const img = source.querySelector('img');
		if (!target || !img) return;
		const from = source.getBoundingClientRect();
		const to = target.getBoundingClientRect();
		const ghost = img.cloneNode() as HTMLImageElement;
		Object.assign(ghost.style, {
			position: 'fixed',
			left: `${from.left}px`,
			top: `${from.top}px`,
			width: `${from.width}px`,
			height: `${from.height}px`,
			objectFit: 'cover',
			borderRadius: '10px',
			zIndex: '85',
			pointerEvents: 'none',
			transformOrigin: 'center'
		});
		ghost.alt = '';
		document.body.append(ghost);
		const dx = to.left + to.width / 2 - (from.left + from.width / 2);
		const dy = to.top + to.height / 2 - (from.top + from.height / 2);
		const s = Math.max(0.12, Math.min(to.width / from.width, 0.3));
		ghost
			.animate(
				[
					{ transform: 'translate(0,0) scale(1)', opacity: 1 },
					{
						transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(${(1 + s) / 2})`,
						opacity: 1,
						offset: 0.55
					},
					{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.2 }
				],
				{ duration: 700, easing: cssEase.lens }
			)
			.finished.finally(() => ghost.remove());
	});
}
