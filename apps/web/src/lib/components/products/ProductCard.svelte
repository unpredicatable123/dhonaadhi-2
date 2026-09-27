<script lang="ts">
	import ViewfinderCard from '$lib/components/cards/ViewfinderCard.svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import { toast } from '$lib/components/ui/toast.svelte';
	import { paths } from '$lib/links';
	import { imageUrl } from '$lib/sanity/image';
	import { compare, COMPARE_MAX } from '$lib/stores/compare.svelte';
	import { flyToTray } from './fly';
	import type { ProductCardData } from '$lib/sanity/types';

	/** Catalogue product → Viewfinder card, with compare toggle and shared-element name. */
	let {
		product,
		layout = 'grid',
		headingLevel = 3,
		sizes = '(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw',
		class: className
	}: {
		product: ProductCardData;
		layout?: 'grid' | 'list';
		headingLevel?: 2 | 3;
		sizes?: string;
		class?: string;
	} = $props();

	const href = $derived(paths.product(product));
	const checked = $derived(compare.has(product.slug ?? ''));
	let mediaEl: HTMLElement | undefined = $state();

	function onchange(on: boolean) {
		const ok = compare.toggle(
			{
				slug: product.slug ?? '',
				modelNumber: product.modelNumber ?? '',
				name: product.name ?? '',
				href,
				image: imageUrl(product.image, 160, 120)
			},
			on
		);
		if (!ok)
			toast.show(
				`Compare holds ${COMPARE_MAX} products. Remove one to add ${product.modelNumber}.`,
				'error'
			);
		else if (on && mediaEl) flyToTray(mediaEl);
	}
</script>

<ViewfinderCard
	{href}
	{layout}
	{headingLevel}
	modelNumber={product.modelNumber ?? ''}
	name={product.name ?? ''}
	status={product.status ?? 'active'}
	specs={(product.cardSpecs ?? []).map((s) => ({
		label: s.label ?? '',
		value: s.value ?? '',
		unit: s.unit ?? undefined
	}))}
	transitionName="product-{product.slug}"
	compare={{ checked, disabled: compare.full, onchange }}
	class={className}
>
	{#snippet media()}
		<div bind:this={mediaEl} class="h-full w-full">
			<SanityImage image={product.image} {sizes} aspect={4 / 3} class="h-full w-full" />
		</div>
	{/snippet}
</ViewfinderCard>
