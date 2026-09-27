<script lang="ts">
	import { cn } from '$lib/utils/cn';

	/** Loading placeholder. A slow light sweep (a scanner pass) instead of a pulse; static under reduced motion. */
	let { class: className }: { class?: string } = $props();
</script>

<div
	aria-hidden="true"
	class={cn('skeleton relative overflow-hidden rounded-control bg-raised', className)}
></div>

<style>
	.skeleton::after {
		content: '';
		position: absolute;
		inset: 0;
		transform: translateX(-100%);
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in oklab, var(--color-ink) 5%, transparent),
			transparent
		);
		animation: scan 1.6s var(--ease-lens) infinite;
	}
	@keyframes scan {
		to {
			transform: translateX(100%);
		}
	}
	:global([data-motion='reduced']) .skeleton::after {
		animation: none;
	}
</style>
