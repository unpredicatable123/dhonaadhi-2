<script lang="ts">
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import { dragScroll } from '$lib/components/scenes/featured/carousel';
	import type { ProductCardData } from '$lib/sanity/types';

	/** Horizontal related-products rail (drag, swipe, or Tab through cards). */
	let { title, id, products }: { title: string; id: string; products: ProductCardData[] } =
		$props();
</script>

{#if products.length}
	<div class="grid gap-6" aria-labelledby={id}>
		<h3 {id} class="container-site font-display text-h3">{title}</h3>
		<ul
			use:dragScroll
			class="flex snap-x snap-mandatory scroll-px-(--page-margin) [scrollbar-width:none] gap-4 overflow-x-auto px-(--page-margin) pb-4"
			data-lenis-prevent-touch
		>
			{#each products as p (p._id)}
				<li class="w-[min(20rem,78vw)] shrink-0 snap-start">
					<ProductCard product={p} sizes="20rem" />
				</li>
			{/each}
		</ul>
	</div>
{/if}
