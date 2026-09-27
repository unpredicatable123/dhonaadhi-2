<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/seo/Seo.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import Gallery from '$lib/components/pdp/Gallery.svelte';
	import PdpInfo from '$lib/components/pdp/PdpInfo.svelte';
	import SectionNav from '$lib/components/pdp/SectionNav.svelte';
	import Overview from '$lib/components/pdp/Overview.svelte';
	import Specs from '$lib/components/pdp/Specs.svelte';
	import Downloads from '$lib/components/pdp/Downloads.svelte';
	import ProductRail from '$lib/components/pdp/ProductRail.svelte';
	import { breadcrumbList } from '$lib/seo/jsonld';
	import { imageUrl } from '$lib/sanity/image';
	import { paths } from '$lib/links';

	let { data } = $props();
	const p = $derived(data.product);
	const site = $derived(page.data.settings?.siteUrl ?? page.url.origin);
	const company = $derived(page.data.settings?.companyName ?? '');

	const crumbs = $derived([
		{ label: 'Products', href: paths.products() },
		{ label: p.categoryTitle ?? '', href: paths.category(p.category ?? '') },
		{
			label: p.subcategoryTitle ?? '',
			href: paths.subcategory(p.category ?? '', p.subcategory ?? '')
		},
		{ label: p.modelNumber ?? '', href: paths.product(p) }
	]);

	const productLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: `${p.modelNumber} ${p.name}`,
		sku: p.modelNumber,
		mpn: p.modelNumber,
		description: p.shortDescription,
		image: [imageUrl(p.image, 1200)].filter(Boolean).map((u) => new URL(u!, site).href),
		brand: { '@type': 'Brand', name: page.data.settings?.brandName },
		manufacturer: { '@type': 'Organization', name: company },
		category: `${p.categoryTitle} > ${p.subcategoryTitle}`,
		releaseDate: p.releaseDate,
		additionalProperty: (p.cardSpecs ?? []).map((s) => ({
			'@type': 'PropertyValue',
			name: s.label,
			value: `${s.value}${s.unit ? ` ${s.unit}` : ''}`
		}))
	});

	const sections = $derived(
		[
			{ id: 'overview', label: 'Overview' },
			{ id: 'specifications', label: 'Specifications' },
			{ id: 'downloads', label: 'Downloads' },
			(p.related?.length || p.comparedWith?.length) && { id: 'related', label: 'Related' }
		].filter((s): s is { id: string; label: string } => !!s)
	);
</script>

<Seo
	title={p.seo?.title ?? `${p.modelNumber} ${p.name}`}
	description={p.seo?.description ?? p.shortDescription}
	ogImage="{paths.product(p)}/og.png"
	type="product"
	jsonLd={[productLd, breadcrumbList(crumbs, site)]}
/>

<section class="container-site pt-[calc(var(--header-h)+1.5rem)] pb-14">
	<Breadcrumbs items={crumbs} class="mb-6" />
	<div class="grid gap-10 lg:grid-cols-12">
		<div class="lg:col-span-7"><Gallery product={p} /></div>
		<div class="lg:col-span-5"><PdpInfo product={p} /></div>
	</div>
</section>

<SectionNav {sections} model={p.modelNumber ?? ''} />
<Overview product={p} />
<Specs product={p} />
<Downloads product={p} />

{#if p.bundle?.length}
	<section class="container-site border-t border-line py-16" aria-labelledby="kit-title">
		<h2 id="kit-title" class="text-h3">In the box</h2>
		<ul class="mt-6 grid gap-2">
			{#each p.bundle as b (b._key)}
				<li class="flex items-center gap-4 font-mono text-sm">
					<span class="text-accent">{b.quantity}×</span>
					<a href={paths.product(b.product ?? {})} class="hover:underline"
						>{b.product?.modelNumber}</a
					>
					<span class="font-sans text-fg-muted">{b.product?.name}</span>
				</li>
			{/each}
		</ul>
	</section>
{/if}

{#if p.related?.length || p.comparedWith?.length}
	<section
		id="related"
		class="grid scroll-mt-32 gap-14 border-t border-line py-20 print:hidden"
		aria-label="Related products"
	>
		<ProductRail id="compared-title" title="Often compared with" products={p.comparedWith ?? []} />
		<ProductRail id="related-title" title="Related products" products={p.related ?? []} />
	</section>
{/if}
