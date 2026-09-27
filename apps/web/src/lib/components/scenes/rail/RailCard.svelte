<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import CategoryIcon from '$lib/components/icons/CategoryIcon.svelte';
	import { paths } from '$lib/links';
	import type { Section } from '../types';

	type Category = NonNullable<Section<'categoryRail'>['categories']>[number];
	let { category }: { category: Category } = $props();

	/** First time the card is in view: scanline sweep + the icon draws itself. */
	let seen = $state(false);
	function watch(node: HTMLElement) {
		const io = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					seen = true;
					io.disconnect();
				}
			},
			{ threshold: 0.35 }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

<a
	use:watch
	href={paths.category(category.slug ?? '')}
	class="rail-card group relative isolate flex h-[min(28rem,64svh)] w-[min(24rem,82vw)] shrink-0 snap-start flex-col overflow-hidden rounded-panel bg-surface transition-colors hairline hover:border-control md:h-[min(34rem,72svh)]"
	class:seen
>
	<SanityImage
		image={category.image}
		sizes="(min-width: 768px) 24rem, 82vw"
		aspect={4 / 3}
		class="aspect-4/3 w-full"
		imgClass="transition-transform duration-(--dur-scene) ease-lens group-hover:scale-105"
	/>
	<div
		class="scan pointer-events-none absolute inset-x-0 top-0 aspect-4/3 scanlines"
		aria-hidden="true"
	></div>
	<div class="flex flex-1 flex-col gap-3 p-6">
		<div class="flex items-start justify-between">
			<CategoryIcon
				name={category.icon ?? ''}
				draw={seen}
				strokeWidth={1.25}
				class="size-12 text-accent"
			/>
			<span class="font-mono text-mono-sm text-fg-muted tabular-nums">
				{category.count} models
			</span>
		</div>
		<h3 class="mt-auto flex items-center gap-2 font-display text-h3 font-medium">
			{category.title}
			<ArrowUpRight
				class="size-5 opacity-0 transition-opacity group-hover:opacity-100"
				aria-hidden="true"
			/>
		</h3>
		{#if category.tagline}<p class="text-sm text-fg-muted">{category.tagline}</p>{/if}
	</div>
</a>

<style>
	/* Scanline sweep: a band of lines passes down the image once on reveal. */
	.scan {
		opacity: 0;
		background-size: 100% 3px;
		mask-image: linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent);
		mask-size: 100% 40%;
		mask-repeat: no-repeat;
	}
	.seen .scan {
		animation: sweep-down 1.1s var(--ease-lens) both;
	}
	@keyframes sweep-down {
		0% {
			opacity: 1;
			mask-position: 0 -40%;
		}
		100% {
			opacity: 1;
			mask-position: 0 140%;
		}
	}
	:global([data-motion='reduced']) .seen .scan {
		animation: none;
	}
</style>
