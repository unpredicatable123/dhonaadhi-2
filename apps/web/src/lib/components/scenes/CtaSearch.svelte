<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search, ArrowRight } from '@lucide/svelte';
	import { motion } from '$lib/stores/motion.svelte';
	import type { Section } from './types';

	let { section }: { section: Section<'ctaSearch'> } = $props();

	let q = $state('');
	let mx = $state(50);
	let my = $state(40);

	/** Routes to the product selector (whole catalogue) with the query prefilled. */
	function submit(e: SubmitEvent) {
		e.preventDefault();
		const term = q.trim();
		goto(term ? `/products?q=${encodeURIComponent(term)}#results` : '/products');
	}

	function track(e: PointerEvent) {
		if (motion.reduced || e.pointerType !== 'mouse') return;
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		mx = ((e.clientX - r.left) / r.width) * 100;
		my = ((e.clientY - r.top) / r.height) * 100;
	}
</script>

<section
	aria-labelledby="cta-title"
	id={section.anchor ?? undefined}
	class="relative isolate overflow-hidden border-t border-line py-32"
	onpointermove={track}
>
	<!-- Ambient lens flare that follows the pointer. -->
	<div
		class="flare pointer-events-none absolute -z-10 size-[42rem] -translate-1/2 rounded-full"
		style:left="{mx}%"
		style:top="{my}%"
		aria-hidden="true"
	></div>
	<div class="container-site grid justify-items-center gap-6 text-center">
		<h2 id="cta-title" class="text-display-xl">{section.title}</h2>
		{#if section.lead}<p class="max-w-[46ch] text-body-lg text-fg-muted">{section.lead}</p>{/if}
		<form
			class="mt-4 flex w-full max-w-2xl items-center gap-2 rounded-panel bg-surface/80 p-2 backdrop-blur hairline focus-within:border-accent"
			role="search"
			onsubmit={submit}
		>
			<Search class="ml-3 size-5 shrink-0 text-fg-muted" aria-hidden="true" />
			<label for="cta-q" class="sr-only">Search products</label>
			<input
				id="cta-q"
				bind:value={q}
				type="search"
				placeholder={section.placeholder ?? 'Model number, feature or use case'}
				class="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-fg-muted"
			/>
			<button
				type="submit"
				class="flex h-12 items-center gap-2 rounded-control bg-accent-fill px-5 font-medium text-on-accent hover:bg-accent-hover"
			>
				<span class="hidden sm:inline">Find products</span><ArrowRight
					class="size-4"
					aria-hidden="true"
				/><span class="sr-only sm:hidden">Find products</span>
			</button>
		</form>
		{#if section.suggestions?.length}
			<ul class="flex flex-wrap justify-center gap-2" aria-label="Popular searches">
				{#each section.suggestions as s (s)}
					<li>
						<button
							type="button"
							onclick={() => (q = s)}
							class="min-h-11 rounded-full px-4 text-sm text-fg-muted hairline hover:border-accent hover:text-fg"
							>{s}</button
						>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
	.flare {
		background:
			radial-gradient(
				closest-side,
				color-mix(in oklab, var(--color-optic-400) 16%, transparent),
				transparent 70%
			),
			radial-gradient(
				closest-side,
				color-mix(in oklab, var(--color-signal-blue) 10%, transparent) 30%,
				transparent 75%
			);
		transition:
			left 900ms var(--ease-lens),
			top 900ms var(--ease-lens);
	}
</style>
