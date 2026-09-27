<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import Seo from '$lib/components/seo/Seo.svelte';
	import Logo from '$lib/components/brand/Logo.svelte';
	import { resolveLink } from '$lib/links';

	let { data } = $props();
	const p = $derived(data.page);
</script>

<Seo title={p.title} description={p.lead} noIndex />

<section
	class="relative isolate grid min-h-[88svh] place-items-center overflow-hidden pt-(--header-h)"
>
	<div
		class="absolute top-1/2 left-1/2 -z-10 size-[min(90vw,52rem)] -translate-1/2 rounded-full lens-glow"
		aria-hidden="true"
	></div>
	<div class="container-site grid justify-items-center gap-8 text-center">
		<!-- The iris opens once: this section is on its way. -->
		<Logo label="" variant="monogram" animated class="size-20 text-fg" />
		<p class="eyebrow">{p.eta ? `In development · expected ${p.eta}` : 'In development'}</p>
		<h1 class="max-w-[18ch] text-h1">{p.title}</h1>
		{#if p.lead}<p class="max-w-[56ch] text-body-lg text-fg-muted">{p.lead}</p>{/if}
		{#if p.links?.length}
			<ul class="mt-2 flex flex-wrap justify-center gap-3">
				{#each p.links as l, i (l._key)}
					<li>
						<a
							href={resolveLink(l)}
							class="inline-flex h-12 items-center gap-2 rounded-control px-5 text-sm font-medium transition-colors {i ===
							0
								? 'bg-accent-fill text-on-accent hover:bg-accent-hover'
								: 'border border-control hover:border-accent hover:text-accent'}"
						>
							{l.label}
							{#if i === 0}<ArrowRight class="size-4" aria-hidden="true" />{/if}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>
