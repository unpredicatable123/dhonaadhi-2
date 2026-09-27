<script lang="ts">
	/**
	 * The brand aperture, full-screen. Six blades are half-planes arranged around the
	 * centre; each slides outward along its own normal while the whole assembly twists
	 * open. Only `transform`/`opacity` animate, so every blade is a GPU-composited layer
	 * (no per-frame repaint). Pure CSS: nothing on the JS critical path.
	 */
	const blades = [0, 60, 120, 180, 240, 300];
</script>

<div class="iris pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
	<div class="twist absolute top-1/2 left-1/2">
		{#each blades as deg (deg)}
			<div class="arm absolute top-0 left-0" style:transform="rotate({deg}deg)">
				<div class="blade"></div>
			</div>
		{/each}
	</div>
</div>

<style>
	.iris {
		animation: fade 300ms linear calc(var(--dur-scene) + 150ms) both;
	}
	.twist {
		animation: twist var(--dur-scene) var(--ease-shutter) 250ms both;
	}
	/* A blade: a huge slab whose lower edge is one side of the hexagonal opening. */
	.blade {
		position: absolute;
		/* Just large enough to cover the viewport around the centre (half-diagonal < 75vmax). */
		left: -80vmax;
		bottom: 0;
		width: 160vmax;
		height: 80vmax;
		background: var(--color-ink-950);
		border-bottom: 1px solid color-mix(in oklab, var(--color-optic-400) 45%, transparent);
		animation: open var(--dur-scene) var(--ease-shutter) 250ms both;
	}
	@keyframes open {
		from {
			transform: translateY(-1.2vmin);
		}
		to {
			transform: translateY(-90vmax);
		}
	}
	@keyframes twist {
		from {
			transform: rotate(-60deg);
		}
		to {
			transform: rotate(0deg);
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
