<script lang="ts">
	import { untrack } from 'svelte';
	import { withGsap } from '$lib/motion/gsap';
	import { motion } from '$lib/stores/motion.svelte';
	import { frameUrl, loadOrder, nearestLoaded } from './sequence';
	import Callouts from './Callouts.svelte';
	import type { Section } from '../types';

	let { section }: { section: Section<'explodedView'> } = $props();

	const count = $derived(section.frames?.length || section.frameCount || 120);
	const url = (i: number) => section.frames?.[i] ?? frameUrl(section.framesBaseUrl ?? '', i);

	let pin: HTMLElement;
	let canvas: HTMLCanvasElement;
	let frame = $state(0);
	let active = $state(false);
	const images: (HTMLImageElement | undefined)[] = [];

	function draw(i: number) {
		const img = nearestLoaded(i, images);
		const ctx = canvas?.getContext('2d');
		if (!img || !ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	}

	function resize() {
		if (!canvas) return;
		const dpr = Math.min(2, devicePixelRatio);
		canvas.width = Math.round(canvas.clientWidth * dpr);
		canvas.height = Math.round(canvas.clientHeight * dpr);
		draw(frame);
	}

	// Start loading when the scene is within ~1.5 screens; mobile loads every other frame.
	$effect(() => {
		if (motion.reduced || !pin) return;
		const step = matchMedia('(max-width: 767px)').matches ? 2 : 1;
		const io = new IntersectionObserver(
			([e]) => {
				if (!e.isIntersecting) return;
				io.disconnect();
				active = true;
				for (const i of loadOrder(count, step)) {
					const img = new Image();
					img.decoding = 'async';
					img.onload = () => {
						for (let k = i; k < Math.min(count, i + step); k++) images[k] ??= img;
						if (Math.abs(i - frame) <= 8) draw(frame);
					};
					img.src = url(i);
				}
			},
			{ rootMargin: '150% 0px' }
		);
		io.observe(pin);
		return () => io.disconnect();
	});

	$effect(() => {
		if (!active || !pin) return;
		// untrack: resize() reads `frame`; tracking it would rebuild the pin on every frame.
		untrack(resize);
		window.addEventListener('resize', resize);
		const cleanup = withGsap(pin, ({ ScrollTrigger }) => {
			ScrollTrigger.create({
				trigger: pin,
				start: 'top top',
				end: '+=220%',
				pin: true,
				scrub: true,
				onUpdate: (self) => {
					const f = Math.round(self.progress * (count - 1));
					if (f !== frame) {
						frame = f;
						requestAnimationFrame(() => draw(f));
					}
				}
			});
		});
		return () => {
			window.removeEventListener('resize', resize);
			cleanup();
		};
	});
</script>

<section
	aria-labelledby="exploded-title"
	id={section.anchor ?? undefined}
	class="bg-[radial-gradient(ellipse_at_60%_45%,#1d2632,var(--color-ink-950)_70%)]"
>
	<div bind:this={pin} class="flex min-h-svh flex-col justify-center gap-8 py-16">
		<div class="container-site grid gap-4">
			<h2 id="exploded-title" class="max-w-[22ch] text-h2">{section.title}</h2>
			{#if section.lead}<p class="max-w-[60ch] text-body-lg text-fg-muted">{section.lead}</p>{/if}
		</div>
		<div class="container-site">
			<div class="relative mx-auto aspect-video w-full max-w-[1280px]">
				<!-- The render backdrop feathers into the section so the frame edge disappears. -->
				<div class="feather absolute inset-0">
					{#if motion.reduced || !active}
						<!-- Static fallback (and pre-load state): the fully separated assembly. -->
						<img
							src={motion.reduced ? url(count - 1) : (section.poster?.asset?.url ?? url(0))}
							alt={motion.reduced
								? `${section.title}: the camera separated into its parts`
								: (section.poster?.alt ?? '')}
							width="1280"
							height="720"
							loading="lazy"
							class="h-full w-full"
						/>
					{/if}
					<canvas
						bind:this={canvas}
						class="absolute inset-0 h-full w-full"
						class:hidden={motion.reduced || !active}
						aria-hidden="true"
					></canvas>
				</div>
				<Callouts callouts={section.callouts ?? []} frame={motion.reduced ? count : frame} />
			</div>
			<Callouts
				callouts={section.callouts ?? []}
				frame={motion.reduced ? count : frame}
				variant="list"
			/>
		</div>
	</div>
</section>

<style>
	.feather {
		mask-image: radial-gradient(ellipse 58% 62% at 50% 50%, #000 62%, transparent 100%);
	}
</style>
