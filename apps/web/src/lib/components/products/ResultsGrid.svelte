<script lang="ts">
	import { untrack } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import ProductCard from './ProductCard.svelte';
	import { loadGsap } from '$lib/motion/gsap';
	import { motion } from '$lib/stores/motion.svelte';
	import { cn } from '$lib/utils/cn';
	import type { ProductCardData } from '$lib/sanity/types';

	let { items, view }: { items: ProductCardData[]; view: 'grid' | 'list' } = $props();

	let list: HTMLUListElement;
	// Layout actually rendered; follows `view` via the Flip effect below.
	let shown = $state(untrack(() => view));

	// Grid ⇄ list: capture positions, switch layout, let GSAP Flip morph each card.
	$effect(() => {
		if (view === shown) return;
		const next = view;
		if (motion.reduced || !list) {
			shown = next;
			return;
		}
		loadGsap().then(({ Flip }) => {
			const state = Flip.getState(list.children);
			shown = next;
			requestAnimationFrame(() =>
				Flip.from(state, { duration: 0.55, ease: 'lens', absolute: false, stagger: 0.02 })
			);
		});
	});

	const d = (ms: number) => (motion.reduced ? 0 : ms);
</script>

<ul
	bind:this={list}
	class={cn('grid gap-4', shown === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}
	aria-label="Products"
>
	{#each items as p, i (p._id)}
		<li
			animate:flip={{ duration: d(420), easing: cubicOut }}
			in:scale={{ start: 0.96, opacity: 0, duration: d(360), delay: d(Math.min(i, 12) * 40) }}
			out:fade={{ duration: d(140) }}
		>
			<ProductCard
				product={p}
				layout={shown}
				class="h-full"
				sizes={shown === 'list'
					? '12rem'
					: '(min-width: 1280px) 24vw, (min-width: 640px) 40vw, 100vw'}
			/>
		</li>
	{/each}
</ul>
