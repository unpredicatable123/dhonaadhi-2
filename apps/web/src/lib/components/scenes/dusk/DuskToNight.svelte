<script lang="ts">
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import Tag from '$lib/components/ui/Tag.svelte';
	import { withGsap } from '$lib/motion/gsap';
	import { motion } from '$lib/stores/motion.svelte';
	import { luxAt, phases } from './dusk';
	import type { Section } from '../types';

	let { section }: { section: Section<'duskToNight'> } = $props();

	let pin: HTMLElement;
	/** 0 → 1 scroll progress through the pinned scene (static 1 under reduced motion). */
	let progress = $state(1);
	/** Split position 0–100 (% of LumaNight revealed); scroll-driven, also draggable. */
	let split = $state(50);

	const phase = $derived(phases(progress));
	const lux = $derived(luxAt(progress));

	$effect(() => {
		if (motion.reduced || !pin) {
			progress = 1;
			return;
		}
		progress = 0;
		return withGsap(pin, ({ ScrollTrigger }) => {
			ScrollTrigger.create({
				trigger: pin,
				start: 'top top',
				end: '+=180%',
				pin: true,
				scrub: true,
				onUpdate: (self) => {
					progress = self.progress;
					split = phases(self.progress).split;
				}
			});
		});
	});
</script>

<section aria-labelledby="dusk-title" id={section.anchor ?? undefined}>
	<div bind:this={pin} class="flex min-h-svh items-center py-20">
		<div class="container-site grid w-full items-center gap-10 lg:grid-cols-12">
			<div class="grid content-start gap-5 lg:col-span-4">
				{#if section.technology}<Tag tone="optic">{section.technology.title}</Tag>{/if}
				<h2 id="dusk-title" class="text-h2">{section.title}</h2>
				{#if section.lead}<p class="text-body-lg text-fg-muted">{section.lead}</p>{/if}
				<dl
					class="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-control bg-line"
					aria-hidden="true"
				>
					<div class="bg-ink-950 p-4">
						<dt class="eyebrow">Scene light</dt>
						<dd class="mt-1 font-mono text-2xl text-highlight tabular-nums">
							{lux}<span class="text-sm text-fg-muted"> lux</span>
						</dd>
					</div>
					<div class="bg-ink-950 p-4">
						<dt class="eyebrow">LumaNight view</dt>
						<dd class="mt-1 font-mono text-2xl text-accent tabular-nums">
							{Math.round(split)}<span class="text-sm text-fg-muted">%</span>
						</dd>
					</div>
				</dl>
			</div>

			<figure class="relative lg:col-span-8">
				<div class="scene relative aspect-16/10 overflow-hidden rounded-scene hairline">
					<SanityImage
						image={section.conventionalImage}
						sizes="(min-width: 1024px) 60vw, 100vw"
						class="absolute inset-0 h-full w-full"
					/>
					<div class="absolute inset-0" style:clip-path="inset(0 {100 - split}% 0 0)">
						<SanityImage
							image={section.enhancedImage}
							sizes="(min-width: 1024px) 60vw, 100vw"
							class="h-full w-full"
						/>
					</div>
					<div
						class="absolute inset-0 transition-none"
						style:opacity={phase.day}
						aria-hidden={phase.day < 0.5}
					>
						<SanityImage
							image={section.dayImage}
							sizes="(min-width: 1024px) 60vw, 100vw"
							class="h-full w-full"
						/>
					</div>

					<!-- Divider + labels -->
					<div
						class="pointer-events-none absolute inset-y-0 w-px bg-optic-400 shadow-[0_0_18px_var(--color-optic-400)]"
						style:left="{split}%"
						style:opacity={1 - phase.day}
						aria-hidden="true"
					>
						<span
							class="absolute top-1/2 left-1/2 grid size-10 -translate-1/2 place-items-center rounded-full border border-optic-400 bg-ink-950/80 font-mono text-xs text-accent"
							>⇆</span
						>
					</div>
					<span
						class="absolute top-4 left-4 rounded-chip bg-ink-950/70 px-2 py-1 font-mono text-mono-sm tracking-[0.08em] text-accent uppercase backdrop-blur"
						style:opacity={1 - phase.day}
					>
						{section.enhancedLabel}
					</span>
					<span
						class="absolute top-4 right-4 rounded-chip bg-ink-950/70 px-2 py-1 font-mono text-mono-sm tracking-[0.08em] text-fg-muted uppercase backdrop-blur"
						style:opacity={1 - phase.day}
					>
						{section.conventionalLabel}
					</span>

					<label class="absolute inset-0 cursor-ew-resize" style:opacity="0">
						<span class="sr-only">Compare conventional and LumaNight night footage</span>
						<input
							type="range"
							min="0"
							max="100"
							bind:value={split}
							class="h-full w-full cursor-ew-resize"
						/>
					</label>
				</div>
				<figcaption class="mt-3 text-caption text-fg-muted">
					The same street, same camera position. Left of the line: LumaNight. Right: a conventional
					camera at the same light level. Drag or use the arrow keys to compare.
				</figcaption>
			</figure>
		</div>
	</div>
</section>

<style>
	/* Keyboard focus on the invisible range still needs a visible ring on the frame. */
	.scene:has(input:focus-visible) {
		outline: 2px solid var(--focus);
		outline-offset: 4px;
	}
</style>
