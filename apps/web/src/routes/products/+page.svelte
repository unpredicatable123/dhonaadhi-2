<script lang="ts">
	import { page } from '$app/state';
	import { ArrowUpRight, Columns3, Download, SlidersHorizontal } from '@lucide/svelte';
	import Seo from '$lib/components/seo/Seo.svelte';
	import LensCard from '$lib/components/cards/LensCard.svelte';
	import TechCard from '$lib/components/cards/TechCard.svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import CategoryIcon from '$lib/components/icons/CategoryIcon.svelte';
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import Selector from '$lib/components/products/Selector.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import { breadcrumbList } from '$lib/seo/jsonld';
	import { paths } from '$lib/links';
	import HubHero from './HubHero.svelte';

	let { data } = $props();
	const hub = $derived(data.hub);
	const total = $derived(hub.categories.reduce((n, c) => n + (c.count ?? 0), 0));
	const site = $derived(page.data.settings?.siteUrl ?? page.url.origin);

	/** Needs → pre-filtered selector URLs (shareable, same as any filter state). */
	const needs = [
		{
			label: 'Perimeter protection',
			href: `${paths.category('network-cameras')}?aiFunctions=perimeter-protection`
		},
		{
			label: 'Colour at night',
			href: `${paths.category('network-cameras')}?lightType=white,hybrid`
		},
		{ label: 'Plate recognition', href: `${paths.category('network-cameras')}?aiFunctions=anpr` },
		{ label: 'Doors & entrances', href: paths.category('access-control') },
		{
			label: 'No power or cabling',
			href: paths.subcategory('network-cameras', 'solar-4g-cameras')
		},
		{ label: 'Heat & smoke', href: paths.category('thermal') }
	];

	const tools = [
		{
			icon: SlidersHorizontal,
			title: 'Product selector',
			body: 'Filter the range by resolution, light, AI and more.',
			href: `${paths.category('network-cameras')}#results`
		},
		{
			icon: Columns3,
			title: 'Compare products',
			body: 'Up to four models side by side, with differences highlighted.',
			href: paths.compare()
		},
		{
			icon: Download,
			title: 'Downloads centre',
			body: 'Datasheets are on every product page today; a full centre is coming.',
			href: paths.comingSoon('downloads')
		}
	];
</script>

<Seo
	title="Products"
	description="Network and PTZ cameras, thermal, recorders, access control, intercom and networking."
	jsonLd={[breadcrumbList([{ label: 'Products', href: paths.products() }], site)]}
/>

<HubHero categories={hub.categories} {total} q={data.listing?.selection.q ?? ''} />

{#if data.listing}
	<section class="container-site border-b border-line py-14" aria-labelledby="search-results">
		<h2 id="search-results" class="mb-8 text-h2">
			{data.listing.selection.q ? `Results for “${data.listing.selection.q}”` : 'All products'}
		</h2>
		<Selector
			listing={data.listing}
			suggestions={hub.categories.map((c) => ({
				label: c.title ?? '',
				href: paths.category(c.slug ?? '')
			}))}
		/>
	</section>
{/if}

<section class="container-site py-20" aria-labelledby="families">
	<SectionHeader
		id="families"
		title="Product families"
		lead="Seven families that pair with the same recorders, apps and management software."
	/>
	<ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each hub.categories as c, i (c._id)}
			<li class={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}>
				<LensCard
					href={paths.category(c.slug ?? '')}
					title={c.title ?? ''}
					description={c.description ?? undefined}
					count={c.count}
					class="h-full"
				>
					{#snippet media()}<SanityImage
							image={c.image}
							sizes="(min-width: 1024px) 40vw, 100vw"
							class="h-full w-full"
						/>{/snippet}
					{#snippet icon()}<CategoryIcon
							name={c.icon ?? ''}
							class="size-8"
							strokeWidth={1.25}
						/>{/snippet}
				</LensCard>
			</li>
		{/each}
	</ul>
</section>

<section class="border-y border-line bg-raised/60 py-10" aria-labelledby="needs">
	<div class="container-site flex flex-wrap items-center gap-x-6 gap-y-4">
		<h2 id="needs" class="font-sans text-sm font-medium text-fg-muted">Shop by need</h2>
		<ul class="flex flex-wrap gap-2">
			{#each needs as n (n.href)}
				<li>
					<a
						href={n.href}
						class="flex min-h-11 items-center rounded-full px-4 text-sm transition-colors hairline hover:border-accent hover:text-accent"
						>{n.label}</a
					>
				</li>
			{/each}
		</ul>
	</div>
</section>

{#if hub.latest.length}
	<section class="container-site py-20" aria-labelledby="latest">
		<SectionHeader id="latest" title="New this season" lead="Recently released across the range." />
		<ul class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{#each hub.latest as p (p._id)}<li>
					<ProductCard product={p} sizes="(min-width: 1280px) 22vw, 50vw" />
				</li>{/each}
		</ul>
	</section>
{/if}

<section class="container-site py-20" aria-labelledby="tech">
	<SectionHeader
		id="tech"
		title="Built on six core technologies"
		lead="Every product page lists which ones it uses. Technology deep-dives are coming soon."
	/>
	<ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each hub.technologies as t (t._id)}
			<li>
				<TechCard
					href={paths.comingSoon('technologies')}
					title={t.title ?? ''}
					summary={t.summary ?? ''}
				/>
			</li>
		{/each}
	</ul>
</section>

<section class="container-site pb-10" aria-labelledby="tools">
	<h2 id="tools" class="sr-only">Tools</h2>
	<ul class="grid gap-px overflow-hidden rounded-panel bg-line md:grid-cols-3">
		{#each tools as t (t.title)}
			<li class="bg-bg">
				<a href={t.href} class="group flex h-full gap-4 p-6 transition-colors hover:bg-raised">
					<t.icon class="size-6 shrink-0 text-accent" aria-hidden="true" />
					<span class="grid gap-1">
						<span class="flex items-center gap-1 font-medium"
							>{t.title}<ArrowUpRight
								class="size-4 opacity-0 transition-opacity group-hover:opacity-100"
								aria-hidden="true"
							/></span
						>
						<span class="text-sm text-fg-muted">{t.body}</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>
</section>
