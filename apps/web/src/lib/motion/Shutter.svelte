<script lang="ts" module>
	import { cssEase } from './tokens';

	export type ShutterApi = { close(): Promise<void>; open(): Promise<void> };

	const HALF = 300;
</script>

<script lang="ts">
	/**
	 * Two ink panels that close over the old page and open on the new one (600ms total).
	 * A line of light draws across the seam. aria-hidden: purely decorative.
	 */
	let top: HTMLDivElement;
	let bottom: HTMLDivElement;
	let seam: HTMLDivElement;
	let active = $state(false);

	const run = (el: HTMLElement, from: string, to: string, easing = cssEase.shutter) =>
		el.animate([{ transform: from }, { transform: to }], {
			duration: HALF,
			easing,
			fill: 'forwards'
		}).finished;

	export const api: ShutterApi = {
		async close() {
			active = true;
			await Promise.all([
				run(top, 'scaleY(0)', 'scaleY(1)'),
				run(bottom, 'scaleY(0)', 'scaleY(1)'),
				seam.animate(
					[
						{ opacity: 0, transform: 'scaleX(0)' },
						{ opacity: 1, transform: 'scaleX(1)' }
					],
					{
						duration: HALF,
						easing: cssEase.lens,
						fill: 'forwards'
					}
				).finished
			]);
		},
		async open() {
			await Promise.all([
				run(top, 'scaleY(1)', 'scaleY(0)'),
				run(bottom, 'scaleY(1)', 'scaleY(0)'),
				seam.animate([{ opacity: 1 }, { opacity: 0 }], { duration: HALF / 2, fill: 'forwards' })
					.finished
			]);
			active = false;
		}
	};
</script>

<div class="pointer-events-none fixed inset-0 z-[95]" class:invisible={!active} aria-hidden="true">
	<div
		bind:this={top}
		class="absolute inset-x-0 top-0 h-1/2 origin-top scale-y-0 border-b border-line bg-bg"
	></div>
	<div
		bind:this={bottom}
		class="absolute inset-x-0 bottom-0 h-1/2 origin-bottom scale-y-0 border-t border-line bg-bg"
	></div>
	<div bind:this={seam} class="absolute inset-0 grid place-items-center opacity-0">
		<div
			class="h-px w-full bg-gradient-to-r from-transparent via-optic-700/50 to-transparent"
		></div>
	</div>
</div>
