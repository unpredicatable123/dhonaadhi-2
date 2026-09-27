<script lang="ts">
	import { withGsap } from '$lib/motion/gsap';
	import { motion } from '$lib/stores/motion.svelte';
	import RailCard from './RailCard.svelte';
	import type { Section } from '../types';

	let { section }: { section: Section<'categoryRail'> } = $props();

	let pin: HTMLElement;
	let track: HTMLElement;

	/**
	 * ≥768px and full motion: the section pins and vertical scroll drives the rail
	 * sideways. Otherwise it is a native swipe/scroll-snap carousel.
	 */
	$effect(() => {
		if (motion.reduced || !pin || !track) return;
		const mq = matchMedia('(min-width: 768px)');
		if (!mq.matches) return;
		return withGsap(pin, ({ gsap }) => {
			const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
			gsap.to(track, {
				x: () => -distance(),
				ease: 'none',
				scrollTrigger: {
					trigger: pin,
					start: 'top top',
					end: () => `+=${distance()}`,
					pin: true,
					scrub: 0.6,
					invalidateOnRefresh: true
				}
			});
		});
	});
</script>

<section aria-labelledby="rail-title" id={section.anchor ?? undefined} class="relative">
	<div
		bind:this={pin}
		class="rail-pin overflow-hidden py-24 md:flex md:min-h-svh md:flex-col md:justify-center"
	>
		<div class="container-site mb-10 flex flex-wrap items-end justify-between gap-6">
			<div class="grid max-w-[44rem] gap-4">
				<h2 id="rail-title" class="text-h2">{section.title}</h2>
				{#if section.lead}<p class="text-body-lg text-fg-muted">{section.lead}</p>{/if}
			</div>
			<a href="/products" class="text-sm font-medium text-accent hover:underline">All products</a>
		</div>
		<div
			bind:this={track}
			class="rail-track flex snap-x snap-mandatory scroll-px-(--page-margin) gap-4 overflow-x-auto px-(--page-margin) pb-4 md:snap-none md:overflow-visible md:pb-0"
			data-lenis-prevent-touch
		>
			{#each section.categories ?? [] as c (c._id)}
				<RailCard category={c} />
			{/each}
			<div class="w-px shrink-0" aria-hidden="true"></div>
		</div>
	</div>
</section>

<style>
	.rail-track {
		scrollbar-width: none;
		will-change: transform;
	}
	.rail-track::-webkit-scrollbar {
		display: none;
	}
</style>
