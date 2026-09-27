<script lang="ts">
	/**
	 * The brand aperture, full-screen. Six blades are half-planes whose inner edges form
	 * a hexagonal opening (inradius 10.4 → side 12); seams run from each hexagon vertex
	 * along the next edge, like a real iris. The assembly rotates open and scales out.
	 * Pure SVG + CSS (nothing on the JS critical path); hidden under reduced motion.
	 */
	const angles = Array.from({ length: 6 }, (_, i) => i * 60);
	const BIG = 3000;
</script>

<svg
	class="iris pointer-events-none absolute inset-0 z-20 h-full w-full"
	viewBox="-50 -50 100 100"
	preserveAspectRatio="xMidYMid slice"
	aria-hidden="true"
>
	<g class="blades">
		{#each angles as deg (deg)}
			<path
				class="blade"
				transform="rotate({deg})"
				d="M {-BIG} -10.4 L {BIG} -10.4 L {BIG} {-BIG} L {-BIG} {-BIG} Z"
			/>
		{/each}
		{#each angles as deg (deg)}
			<path class="seam" transform="rotate({deg})" d="M 6 -10.4 L {BIG} -10.4" />
		{/each}
	</g>
</svg>

<style>
	.blade {
		fill: var(--color-ink-950);
	}
	.seam {
		stroke: color-mix(in oklab, var(--color-optic-400) 45%, transparent);
		stroke-width: 0.12;
		fill: none;
	}
	.blades {
		transform-origin: 0 0;
		animation: open var(--dur-scene) var(--ease-shutter) 250ms both;
	}
	.iris {
		animation: fade 300ms linear calc(var(--dur-scene) + 150ms) both;
	}
	@keyframes open {
		from {
			transform: rotate(-70deg) scale(0.04);
		}
		to {
			transform: rotate(0deg) scale(9);
		}
	}
	@keyframes fade {
		to {
			opacity: 0;
			visibility: hidden;
		}
	}
	:global([data-motion='reduced']) .iris {
		display: none;
	}
</style>
