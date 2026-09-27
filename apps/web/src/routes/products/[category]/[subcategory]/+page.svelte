<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/seo/Seo.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import Selector from '$lib/components/products/Selector.svelte';
	import { breadcrumbList } from '$lib/seo/jsonld';
	import { paths } from '$lib/links';

	let { data } = $props();
	const sub = $derived(data.sub);
	const cat = $derived(sub.category);

	const crumbs = $derived([
		{ label: 'Products', href: paths.products() },
		{ label: cat?.title ?? '', href: paths.category(cat?.slug ?? '') },
		{ label: sub.title ?? '', href: paths.subcategory(cat?.slug ?? '', sub.slug ?? '') }
	]);
	const site = $derived(page.data.settings?.siteUrl ?? page.url.origin);
</script>

<Seo
	title={sub.seo?.title ?? `${sub.title} · ${cat?.title}`}
	description={sub.seo?.description ?? sub.description}
	image={sub.image}
	jsonLd={[breadcrumbList(crumbs, site)]}
/>

<section class="border-b border-line pt-[calc(var(--header-h)+2rem)] pb-10">
	<div class="container-site grid gap-6">
		<Breadcrumbs items={crumbs} />
		<div class="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
			<div class="grid max-w-[46rem] gap-3">
				<h1 class="text-h1">{sub.title}</h1>
				{#if sub.description}<p class="text-body-lg text-fg-muted">{sub.description}</p>{/if}
			</div>
		</div>
		{#if sub.siblings?.length}
			<nav aria-label="Other {cat?.title?.toLowerCase()}">
				<ul class="flex flex-wrap gap-2">
					<li>
						<span
							class="flex h-10 items-center rounded-full bg-accent-fill px-4 text-sm font-medium text-on-accent"
							aria-current="page">{sub.title}</span
						>
					</li>
					{#each sub.siblings as s (s.slug)}
						<li>
							<a
								href={paths.subcategory(cat?.slug ?? '', s.slug ?? '')}
								class="flex h-10 items-center rounded-full px-4 text-sm text-fg-muted hairline hover:border-accent hover:text-fg"
								>{s.title}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
		{/if}
	</div>
</section>

<section class="container-site py-10" aria-label="{sub.title} product selector">
	<Selector
		listing={data.listing}
		suggestions={(sub.siblings ?? []).map((s) => ({
			label: s.title ?? '',
			href: paths.subcategory(cat?.slug ?? '', s.slug ?? '')
		}))}
	/>
</section>
