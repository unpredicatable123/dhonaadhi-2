<script lang="ts">
	import { coverMap, isVisible } from './cover';

	type Detection = {
		_key: string;
		label: string | null;
		confidence: number | null;
		x: number | null;
		y: number | null;
		w: number | null;
		h: number | null;
	};

	/**
	 * Bounding boxes that lock on to subjects after the iris opens. Boxes are mapped
	 * through the same cover crop as the image, and hidden when cropped out of frame.
	 */
	let {
		detections,
		image,
		delay = 1500
	}: {
		detections: Detection[];
		image: { width: number; height: number };
		delay?: number;
	} = $props();

	let width = $state(0);
	let height = $state(0);

	const boxes = $derived(
		width && height
			? detections
					.filter((d) => d.x !== null && d.y !== null && d.w !== null && d.h !== null)
					.map((d) => ({
						...d,
						box: coverMap({ x: d.x!, y: d.y!, w: d.w!, h: d.h! }, { width, height }, image)
					}))
					.filter((d) => isVisible(d.box))
					// A tag that would run into a neighbour's tag on the same line drops below its box.
					.map((d, _, all) => {
						const tagW = ((`${d.label} 0.00`.length * 8 + 24) / width) * 100;
						const hits = all.some(
							(o) =>
								o !== d &&
								Math.abs(o.box.y - d.box.y) < (28 / height) * 100 &&
								o.box.x > d.box.x &&
								o.box.x < d.box.x + tagW
						);
						return { ...d, below: hits };
					})
			: []
	);
</script>

<div
	bind:clientWidth={width}
	bind:clientHeight={height}
	class="pointer-events-none absolute inset-0 z-10"
	aria-hidden="true"
>
	{#each boxes as d, i (d._key)}
		<div
			class="det absolute"
			style:left="{d.box.x}%"
			style:top="{d.box.y}%"
			style:width="{d.box.w}%"
			style:height="{d.box.h}%"
			style:--delay="{delay + i * 260}ms"
		>
			<span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span
				class="c br"
			></span>
			<span
				class={[
					'tag absolute left-0 font-mono text-[0.6875rem] tracking-[0.08em] whitespace-nowrap',
					d.below ? '-bottom-6' : '-top-6'
				]}
			>
				{d.label}
				{d.confidence?.toFixed(2)}
			</span>
		</div>
	{/each}
</div>

<style>
	.det {
		--c: var(--color-optic-400);
		--on-c: var(--color-ink);
		animation: lock 700ms var(--ease-lens) var(--delay) both;
	}
	.c {
		position: absolute;
		width: 10px;
		height: 10px;
		border-color: var(--c);
		filter: drop-shadow(0 0 4px color-mix(in oklab, var(--c) 60%, transparent));
	}
	.tl {
		top: 0;
		left: 0;
		border-top: 1.5px solid;
		border-left: 1.5px solid;
	}
	.tr {
		top: 0;
		right: 0;
		border-top: 1.5px solid;
		border-right: 1.5px solid;
	}
	.bl {
		bottom: 0;
		left: 0;
		border-bottom: 1.5px solid;
		border-left: 1.5px solid;
	}
	.br {
		bottom: 0;
		right: 0;
		border-bottom: 1.5px solid;
		border-right: 1.5px solid;
	}
	.tag {
		color: var(--on-c);
		background: var(--c);
		padding: 2px 6px;
		border-radius: 2px;
		animation: tag 400ms var(--ease-lens) calc(var(--delay) + 450ms) both;
	}
	@keyframes lock {
		0% {
			opacity: 0;
			transform: scale(1.6);
		}
		60% {
			opacity: 1;
			transform: scale(0.96);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes tag {
		from {
			opacity: 0;
			clip-path: inset(0 100% 0 0);
		}
		to {
			opacity: 1;
			clip-path: inset(0 0 0 0);
		}
	}
	:global([data-motion='reduced']) .det,
	:global([data-motion='reduced']) .tag {
		animation: none;
	}
</style>
