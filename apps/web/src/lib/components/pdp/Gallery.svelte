<script lang="ts">
	import { Maximize2, RotateCw } from '@lucide/svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import SpinViewer from './SpinViewer.svelte';
	import { imageUrl } from '$lib/sanity/image';
	import { motion } from '$lib/stores/motion.svelte';
	import { cn } from '$lib/utils/cn';
	import type { Product } from './types';

	let { product }: { product: Product } = $props();

	const images = $derived([product.image, ...(product.gallery ?? [])].filter((i) => i?.asset));
	const spin = $derived(product.spinFrames?.filter((f): f is string => !!f) ?? []);
	let active = $state<number | 'spin'>(0);
	let zoomOpen = $state(false);
	let origin = $state('50% 50%');
	let zooming = $state(false);

	const current = $derived(typeof active === 'number' ? images[active] : null);

	function lens(e: PointerEvent) {
		if (motion.reduced || e.pointerType !== 'mouse') return;
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		origin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
	}
</script>

<div class="grid gap-3">
	<div class="relative aspect-4/3 overflow-hidden rounded-panel bg-ink-900 hairline">
		{#if active === 'spin'}
			<SpinViewer frames={spin} label={product.modelNumber ?? 'Product'} />
		{:else if current}
			<!-- Hover lens: the image scales 2× around the pointer. Click opens full screen. -->
			<button
				type="button"
				class="block h-full w-full cursor-zoom-in"
				style:--zo={origin}
				onpointermove={lens}
				onpointerenter={() => (zooming = true)}
				onpointerleave={() => (zooming = false)}
				onclick={() => (zoomOpen = true)}
				aria-label="Open larger image"
			>
				<SanityImage
					image={current}
					priority={active === 0}
					sizes="(min-width: 1024px) 55vw, 100vw"
					aspect={4 / 3}
					class="h-full w-full"
					imgClass={cn(
						'origin-(--zo) transition-transform duration-(--dur-base) ease-lens',
						zooming && 'scale-[2]'
					)}
					transitionName={active === 0 ? `product-${product.slug}` : undefined}
				/>
			</button>
		{/if}
		<span
			class="pointer-events-none absolute top-3 right-3 grid size-9 place-items-center rounded-control bg-ink-950/70 text-fg-muted backdrop-blur"
			aria-hidden="true"
		>
			<Maximize2 class="size-4" />
		</span>
	</div>

	<ul class="flex gap-2" aria-label="Product images">
		{#each images as img, i (img?.asset?._id ?? i)}
			<li>
				<button
					type="button"
					onclick={() => (active = i)}
					aria-current={active === i}
					class={cn(
						'block h-16 w-20 overflow-hidden rounded-control border transition-colors',
						active === i ? 'border-accent' : 'border-line hover:border-steel-500'
					)}
				>
					<SanityImage
						image={img}
						sizes="80px"
						aspect={4 / 3}
						class="h-full w-full"
						alt="View {i + 1}"
					/>
				</button>
			</li>
		{/each}
		{#if spin.length}
			<li>
				<button
					type="button"
					onclick={() => (active = 'spin')}
					aria-current={active === 'spin'}
					class={cn(
						'grid h-16 w-20 place-items-center gap-0.5 rounded-control border font-mono text-mono-sm',
						active === 'spin'
							? 'border-accent text-accent'
							: 'border-line text-fg-muted hover:border-steel-500'
					)}
				>
					<RotateCw class="size-4" aria-hidden="true" /> 360°
				</button>
			</li>
		{/if}
	</ul>
</div>

<Dialog
	bind:open={zoomOpen}
	title="{product.modelNumber} image"
	placement="full"
	class="bg-ink-950"
>
	{#if current}
		<img
			src={imageUrl(current, 2400) ?? ''}
			alt={current.alt ?? ''}
			class="mx-auto max-h-full w-auto object-contain"
		/>
	{/if}
</Dialog>
