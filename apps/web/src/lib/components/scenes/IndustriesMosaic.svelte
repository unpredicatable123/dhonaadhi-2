<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import { resolveLink } from '$lib/links';
	import { cn } from '$lib/utils/cn';
	import type { Section } from './types';

	let { section }: { section: Section<'industriesMosaic'> } = $props();

	/** Bento layout: tile spans cycle so any count of 4–8 industries composes well. */
	/** Ken Burns runs only while the mosaic is on screen (saves main thread and battery). */
	let inView = $state(false);
	function watch(node: HTMLElement) {
		const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting));
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}

	const spans = [
		'md:col-span-7 md:row-span-2',
		'md:col-span-5',
		'md:col-span-5',
		'md:col-span-4',
		'md:col-span-4',
		'md:col-span-4',
		'md:col-span-6',
		'md:col-span-6'
	];
</script>

<section aria-labelledby="industries-title" id={section.anchor ?? undefined} class="py-24">
	<div class="container-site grid gap-10">
		<div class="grid max-w-[40rem] gap-4">
			<h2 id="industries-title" class="text-h2">{section.title}</h2>
			{#if section.lead}<p class="text-body-lg text-fg-muted">{section.lead}</p>{/if}
		</div>
		<ul
			use:watch
			class:playing={inView}
			class="grid auto-rows-[20rem] gap-4 md:auto-rows-[22rem] md:grid-cols-12"
		>
			{#each section.industries ?? [] as ind, i (ind._id)}
				<li class={cn(spans[i % spans.length])}>
					<a
						href={resolveLink({ kind: 'internal', ref: { _type: 'industry', slug: ind.slug } })}
						class="tile group flex h-full flex-col overflow-hidden rounded-panel bg-surface shadow-card hairline"
					>
						<!-- Photo on top, copy on white below: no scrim needed, the tile stays light. -->
						<div class="relative min-h-0 flex-1 overflow-hidden">
							<div class="kb absolute inset-0">
								<SanityImage
									image={ind.image}
									sizes="(min-width: 768px) 50vw, 100vw"
									class="h-full w-full"
									imgClass="focus-img"
								/>
							</div>
						</div>
						<div class="px-5 pt-4 pb-5">
							<h3 class="flex items-center gap-2 font-display text-xl font-medium">
								{ind.title}
								<ArrowUpRight
									class="size-5 opacity-0 transition-opacity group-hover:opacity-100"
									aria-hidden="true"
								/>
							</h3>
							{#if ind.summary}<p class="mt-1 max-w-[46ch] text-sm text-fg-muted">
									{ind.summary}
								</p>{/if}
							<span class="mt-3 block eyebrow text-accent">Solution page coming soon</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	/* Slow Ken Burns drift; hover leans in slightly. */
	.kb {
		animation: var(--animate-kenburns);
		animation-play-state: paused;
	}
	.playing .kb {
		animation-play-state: running;
	}
	.tile :global(.focus-img) {
		transition: scale var(--dur-slow) var(--ease-lens);
	}
	.tile:hover :global(.focus-img),
	.tile:focus-visible :global(.focus-img) {
		scale: 1.03;
	}
	:global([data-motion='reduced']) .kb {
		animation: none;
	}
</style>
