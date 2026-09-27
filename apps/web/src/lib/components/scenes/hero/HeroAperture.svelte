<script lang="ts">
	import { ArrowRight, ArrowDown } from '@lucide/svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { splitText, magnetic } from '$lib/motion/actions';
	import { resolveLink } from '$lib/links';
	import { dimensions } from '$lib/sanity/image';
	import Iris from './Iris.svelte';
	import Detections from './Detections.svelte';
	import type { Section } from '../types';

	let { section }: { section: Section<'heroAperture'> } = $props();

	const dims = $derived(dimensions(section.image));

	// A live timecode, as on a monitoring wall. Starts after hydration only.
	let now = $state<Date | null>(null);
	$effect(() => {
		now = new Date();
		const t = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(t);
	});
	const time = $derived(now?.toLocaleTimeString('en-GB', { hour12: false }) ?? '--:--:--');
</script>

<section
	class="relative isolate flex min-h-svh flex-col justify-center pt-(--header-h)"
	aria-labelledby="hero-title"
	id={section.anchor ?? undefined}
>
	<div
		class="container-site grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
	>
		<div class="grid gap-6">
			<h1
				id="hero-title"
				class="max-w-[14ch] text-display-xl font-semibold text-balance"
				use:splitText={{ immediate: true, delay: 0.9, stagger: 0.08 }}
			>
				{section.headline}
			</h1>
			{#if section.lead}<p class="max-w-[44ch] text-body-lg text-fg-muted">{section.lead}</p>{/if}
			<div class="flex flex-wrap gap-3">
				{#if section.primaryCta}
					<span use:magnetic={{ strength: 6 }}>
						<Button href={resolveLink(section.primaryCta)} size="lg">
							{section.primaryCta.label}<ArrowRight class="size-4" aria-hidden="true" />
						</Button>
					</span>
				{/if}
				{#if section.secondaryCta}
					<Button href={resolveLink(section.secondaryCta)} size="lg" variant="secondary">
						{section.secondaryCta.label}
					</Button>
				{/if}
			</div>
			<a
				href="#after-hero"
				class="mt-4 hidden w-max items-center gap-2 font-mono text-mono-sm tracking-[0.08em] text-fg-muted uppercase hover:text-fg lg:flex"
				tabindex="-1"
				aria-hidden="true"
			>
				Scroll <ArrowDown class="size-3.5" />
			</a>
		</div>

		<!-- The camera's view, framed like a monitor tile. The iris opens on this frame only. -->
		<figure
			class="relative isolate aspect-[4/3] overflow-hidden rounded-scene bg-raised shadow-card lg:aspect-[16/11]"
		>
			{#if section.video}
				<video
					class="absolute inset-0 h-full w-full object-cover"
					src={section.video}
					autoplay
					muted
					loop
					playsinline
					aria-hidden="true"
				></video>
			{:else}
				<SanityImage
					image={section.image}
					priority
					sizes="(min-width: 1024px) 58vw, 100vw"
					class="absolute inset-0 h-full w-full"
				/>
			{/if}
			<div class="absolute inset-0 scanlines opacity-40" aria-hidden="true"></div>
			<Detections detections={section.detections ?? []} image={dims} />
			<Iris />
			<figcaption
				class="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-4 rounded-control bg-surface/90 px-4 py-2.5 font-mono text-mono-sm tracking-[0.08em] text-fg-muted uppercase shadow-card backdrop-blur"
			>
				<span class="flex items-center gap-2 text-fg">
					<span
						class="size-1.5 animate-pulse rounded-full bg-alert-500 [animation-iteration-count:4]"
						aria-hidden="true"
					></span>
					Live · Cam 04
				</span>
				<span class="hidden sm:inline" aria-hidden="true">4K · 30 fps</span>
				<span class="tabular-nums" aria-hidden="true">{time}</span>
			</figcaption>
		</figure>
	</div>
</section>
<div id="after-hero"></div>
