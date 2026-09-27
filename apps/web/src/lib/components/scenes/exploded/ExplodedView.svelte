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
	class="bg-[radial-gradient(ellipse_at_60%_45%,var(--surface),var(--bg)_70%)]"
>
	<!-- Exactly one viewport tall while pinned: the frame takes whatever height the copy leaves. -->
	<div
		bind:this={pin}
		class="flex h-svh flex-col gap-6 pt-[calc(var(--header-h)+1.5rem)] pb-8 md:gap-8"
	>
		<div class="container-site grid shrink-0 gap-3">
			<h2 id="exploded-title" class="max-w-[22ch] text-h2">{section.title}</h2>
			{#if section.lead}<p class="max-w-[60ch] text-body-lg text-fg-muted">{section.lead}</p>{/if}
		</div>
		<div class="stage container-site min-h-0 flex-1">
			<div class="frame relative mx-auto aspect-video">
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
		</div>
	</div>
	<div class="container-site pb-8 md:hidden">
		<Callouts
			callouts={section.callouts ?? []}
			frame={motion.reduced ? count : frame}
			variant="list"
		/>
	</div>
</section>

<style>
	/* Largest 16:9 box that fits the remaining space (both width and height). */
	.stage {
		container-type: size;
	}
	.frame {
		width: min(100cqw, 100cqh * 16 / 9, 1280px);
	}
	.feather {
		mask-image: radial-gradient(ellipse 58% 62% at 50% 50%, #000 62%, transparent 100%);
	}
</style>
