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
	class="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink-950"
	aria-labelledby="hero-title"
	id={section.anchor ?? undefined}
>
	<div class="absolute inset-0 -z-10">
		{#if section.video}
			<video
				class="h-full w-full object-cover"
				src={section.video}
				autoplay
				muted
				loop
				playsinline
				aria-hidden="true"
			></video>
		{:else}
			<SanityImage image={section.image} priority sizes="100vw" class="h-full w-full" />
		{/if}
		<!-- Legibility: dark from the bottom-left where the copy sits. -->
		<div
			class="absolute inset-0 bg-[linear-gradient(to_top,var(--color-ink-950)_0%,transparent_50%),linear-gradient(to_bottom,rgb(7_9_13/0.7)_0%,transparent_22%),linear-gradient(to_right,rgb(7_9_13/0.9)_0%,rgb(7_9_13/0.55)_40%,transparent_68%)]"
		></div>
		<div class="absolute inset-0 scanlines opacity-60"></div>
	</div>

	<Detections detections={section.detections ?? []} image={dims} />
	<Iris />

	<div class="relative z-10 container-site grid gap-10 pt-40 pb-14 md:pb-20">
		<div class="grid max-w-[54rem] gap-6">
			<h1
				id="hero-title"
				class="text-display-2xl font-semibold"
				use:splitText={{ immediate: true, delay: 0.9, stagger: 0.08 }}
			>
				{section.headline}
			</h1>
			{#if section.lead}<p class="max-w-[46ch] text-body-lg text-fg/80">{section.lead}</p>{/if}
			<div class="flex flex-wrap gap-3">
				{#if section.primaryCta}
					<span use:magnetic={{ strength: 6 }}>
						<Button href={resolveLink(section.primaryCta)} size="lg">
							{section.primaryCta.label}<ArrowRight class="size-4" aria-hidden="true" />
						</Button>
					</span>
				{/if}
				{#if section.secondaryCta}
					<Button
						href={resolveLink(section.secondaryCta)}
						size="lg"
						variant="secondary"
						class="border-fg/30 bg-ink-950/40 backdrop-blur"
					>
						{section.secondaryCta.label}
					</Button>
				{/if}
			</div>
		</div>

		<div
			class="flex items-end justify-between gap-6 border-t border-fg/15 pt-5 font-mono text-mono-sm tracking-[0.08em] text-fg/60 uppercase"
			aria-hidden="true"
		>
			<span class="flex items-center gap-2">
				<span class="size-1.5 animate-pulse rounded-full bg-alert-500 [animation-iteration-count:4]"
				></span>
				Live · Cam 04 · LumaNight
			</span>
			<span class="hidden sm:inline">0.0005 lux</span>
			<span class="tabular-nums">{time}</span>
			<a
				href="#after-hero"
				class="pointer-events-auto hidden items-center gap-2 hover:text-fg md:flex"
				tabindex="-1"
			>
				Scroll <ArrowDown class="size-3.5" />
			</a>
		</div>
	</div>
</section>
<div id="after-hero"></div>
