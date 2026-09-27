<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import { dragScroll, perspective } from './carousel';
	import type { Section } from '../types';

	let { section }: { section: Section<'featuredProducts'> } = $props();
	let track: HTMLElement;

	function step(dir: 1 | -1) {
		const card = track.querySelector<HTMLElement>('[data-slide]');
		track.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: 'smooth' });
	}
</script>

<section aria-labelledby="featured-title" id={section.anchor ?? undefined} class="py-24">
	<div class="container-site mb-10 flex flex-wrap items-end justify-between gap-6">
		<div class="grid max-w-[40rem] gap-4">
			<h2 id="featured-title" class="text-h2">{section.title}</h2>
			{#if section.lead}<p class="text-body-lg text-fg-muted">{section.lead}</p>{/if}
		</div>
		<div class="flex gap-2">
			<button
				type="button"
				class="grid tap place-items-center rounded-control hairline hover:border-accent hover:text-accent"
				onclick={() => step(-1)}
			>
				<ChevronLeft class="size-5" aria-hidden="true" /><span class="sr-only"
					>Previous products</span
				>
			</button>
			<button
				type="button"
				class="grid tap place-items-center rounded-control hairline hover:border-accent hover:text-accent"
				onclick={() => step(1)}
			>
				<ChevronRight class="size-5" aria-hidden="true" /><span class="sr-only">Next products</span>
			</button>
		</div>
	</div>
	<!-- Drag with momentum (mouse), native swipe (touch), arrow buttons or Tab (keyboard). -->
	<ul
		bind:this={track}
		use:dragScroll
		use:perspective
		class="carousel flex snap-x snap-mandatory scroll-px-(--page-margin) gap-4 overflow-x-auto px-(--page-margin) pt-2 pb-6 [perspective:1400px]"
		aria-label="{section.title} carousel"
		data-lenis-prevent-touch
	>
		{#each section.products ?? [] as p (p._id)}
			<li data-slide class="w-[min(22rem,80vw)] shrink-0 snap-start [transform-style:preserve-3d]">
				<div class="slide h-full transition-transform duration-(--dur-fast) ease-out">
					<ProductCard product={p} sizes="22rem" />
				</div>
			</li>
		{/each}
	</ul>
</section>

<style>
	.carousel {
		scrollbar-width: none;
		cursor: grab;
	}
	.carousel::-webkit-scrollbar {
		display: none;
	}
	.carousel:global(.dragging) {
		cursor: grabbing;
		scroll-snap-type: none;
	}
	.carousel:global(.dragging) :global(a) {
		pointer-events: none;
	}
</style>
