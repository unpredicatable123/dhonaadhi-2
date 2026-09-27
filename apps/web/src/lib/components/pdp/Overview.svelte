<script lang="ts">
	import TechCard from '$lib/components/cards/TechCard.svelte';
	import { reveal } from '$lib/motion/actions';
	import { paths } from '$lib/links';
	import type { Product } from './types';

	let { product }: { product: Product } = $props();

	const dori = $derived(
		product.dori
			? [
					['Detect', product.dori.detect],
					['Observe', product.dori.observe],
					['Recognise', product.dori.recognize],
					['Identify', product.dori.identify]
				].filter((r): r is [string, number] => typeof r[1] === 'number')
			: []
	);
	const maxDori = $derived(Math.max(1, ...dori.map((d) => d[1])));
</script>

<section id="overview" class="container-site scroll-mt-32 py-20" aria-labelledby="overview-title">
	<h2 id="overview-title" class="text-h2">Overview</h2>
	<div class="mt-10 grid gap-10 lg:grid-cols-12">
		{#if dori.length}
			<div class="grid content-start gap-4 lg:col-span-5" use:reveal>
				<h3 class="font-sans text-lg font-medium">How far it sees</h3>
				<p class="text-sm text-fg-muted">
					DORI distances at the widest lens: the range at which a person can be detected, observed,
					recognised or identified.
				</p>
				<dl class="grid gap-3">
					{#each dori as [label, m] (label)}
						<div class="grid grid-cols-[6rem_1fr_4rem] items-center gap-3">
							<dt class="text-sm text-fg-muted">{label}</dt>
							<dd class="h-2 overflow-hidden rounded-full bg-raised" aria-hidden="true">
								<span
									class="block h-full rounded-full bg-accent-fill"
									style:width="{(m / maxDori) * 100}%"
								></span>
							</dd>
							<dd class="text-right font-mono text-sm tabular-nums">{m} m</dd>
						</div>
					{/each}
				</dl>
			</div>
		{/if}
		{#if product.technologies?.length || product.aiFunctions?.length}
			<div class="grid content-start gap-4 {dori.length ? 'lg:col-span-7' : 'lg:col-span-12'}">
				{#if product.technologies?.length}
					<h3 class="font-sans text-lg font-medium">Technologies inside</h3>
					<ul class="grid gap-3 sm:grid-cols-2" use:reveal={{ children: true }}>
						{#each product.technologies as t (t._id)}
							<li>
								<TechCard
									href={paths.comingSoon('technologies')}
									title={t.title ?? ''}
									summary={t.summary ?? ''}
								/>
							</li>
						{/each}
					</ul>
				{/if}
				{#if product.aiFunctions?.length}
					<h3 class="mt-4 font-sans text-lg font-medium">On-device AI</h3>
					<ul class="flex flex-wrap gap-2">
						{#each product.aiFunctions as a (a._id)}
							<li class="rounded-full px-3 py-1.5 text-sm hairline" title={a.summary ?? undefined}>
								{a.title}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>
</section>
