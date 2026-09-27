<script lang="ts">
	import { dimensions, imageUrl, srcset, type ImageData } from '$lib/sanity/image';
	import { cn } from '$lib/utils/cn';

	/**
	 * The only way images are rendered. Intrinsic width/height prevent layout shift,
	 * the LQIP paints instantly behind the image, and `priority` marks the LCP image.
	 * Alt text comes from the CMS (required there); decorative images get alt="".
	 */
	type Props = {
		image: ImageData;
		sizes?: string;
		/** Force an aspect ratio (crops on the Sanity CDN). */
		aspect?: number;
		priority?: boolean;
		alt?: string;
		class?: string;
		imgClass?: string;
		transitionName?: string;
	};

	let {
		image,
		sizes = '100vw',
		aspect,
		priority = false,
		alt,
		class: className,
		imgClass,
		transitionName
	}: Props = $props();

	const dims = $derived(dimensions(image));
	const width = $derived(aspect ? dims.width : dims.width);
	const height = $derived(aspect ? Math.round(dims.width / aspect) : dims.height);
	const src = $derived(
		imageUrl(
			image,
			Math.min(1600, dims.width),
			aspect ? Math.round(Math.min(1600, dims.width) / aspect) : undefined
		)
	);
	const set = $derived(srcset(image, aspect));
	const lqip = $derived(image?.asset?.metadata?.lqip);
	const altText = $derived(alt ?? (image?.decorative ? '' : (image?.alt ?? '')));
	let loaded = $state(false);
</script>

{#if src}
	<div
		class={cn('relative overflow-hidden bg-raised', className)}
		style:background-image={lqip && !loaded ? `url(${lqip})` : undefined}
		style:background-size="cover"
		style:background-position="center"
		style:view-transition-name={transitionName}
	>
		<img
			{src}
			srcset={set}
			{sizes}
			{width}
			{height}
			alt={altText}
			loading={priority ? 'eager' : 'lazy'}
			fetchpriority={priority ? 'high' : 'auto'}
			decoding={priority ? 'sync' : 'async'}
			onload={() => (loaded = true)}
			class={cn(
				'h-full w-full object-cover transition-opacity duration-(--dur-slow) ease-lens',
				!priority && !loaded && 'opacity-0',
				imgClass
			)}
		/>
	</div>
{/if}
