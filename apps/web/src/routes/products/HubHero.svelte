<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search } from '@lucide/svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import { splitText } from '$lib/motion/actions';
	import { paths } from '$lib/links';
	import type { ProductsHubQueryResult } from '@dhonaadhi/sanity-types';

	let {
		categories,
		total,
		q = ''
	}: { categories: ProductsHubQueryResult['categories']; total: number; q?: string } = $props();
	let query = $derived(q);

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const t = query.trim();
		goto(t ? `${paths.products()}?q=${encodeURIComponent(t)}#results` : paths.products(), {
			noScroll: !!t
		});
	}
</script>

<section
	class="relative isolate overflow-hidden border-b border-line pt-[calc(var(--header-h)+3rem)] pb-14"
>
	<div
		class="absolute -top-40 -right-40 -z-10 size-[56rem] rounded-full lens-glow"
		aria-hidden="true"
	></div>
	<div class="container-site grid items-end gap-10 lg:grid-cols-12">
		<div class="grid gap-6 lg:col-span-6">
			<p class="eyebrow">{total} models · {categories.length} families</p>
			<h1 class="text-display-xl" use:splitText={{ immediate: true, delay: 0.1 }}>
				Every angle. Every hour.
			</h1>
			<p class="max-w-[46ch] text-body-lg text-fg-muted">
				Cameras, recorders, access and networking that work as one system. Start from a family, or
				search by model or feature.
			</p>
			<form
				role="search"
				onsubmit={submit}
				class="flex max-w-xl items-center gap-2 rounded-panel bg-surface p-2 hairline focus-within:border-accent"
			>
				<Search class="ml-2 size-5 text-fg-muted" aria-hidden="true" />
				<label for="hub-q" class="sr-only">Search all products</label>
				<input
					id="hub-q"
					type="search"
					bind:value={query}
					placeholder="e.g. NB-8M, colour at night, face"
					class="h-11 min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-muted"
				/>
				<button
					class="h-11 rounded-control bg-btn px-4 text-sm font-medium text-on-btn hover:bg-btn-hover"
					>Search</button
				>
			</form>
		</div>
		<!-- Contact sheet: one frame per family, like a monitoring wall. -->
		<ul class="grid grid-cols-3 gap-2 lg:col-span-6" aria-hidden="true">
			{#each categories.slice(0, 6) as c, i (c._id)}
				<li
					class="relative overflow-hidden rounded-control hairline"
					style:animation-delay="{i * 90}ms"
				>
					<SanityImage
						image={c.image}
						sizes="15vw"
						aspect={4 / 3}
						priority={i < 3}
						class="aspect-4/3"
						alt=""
					/>
					<span
						class="absolute bottom-1.5 left-2 font-mono text-[0.625rem] tracking-[0.08em] text-fg-muted uppercase"
						>CAM {String(i + 1).padStart(2, '0')}</span
					>
				</li>
			{/each}
		</ul>
	</div>
</section>
