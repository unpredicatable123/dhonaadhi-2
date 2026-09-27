<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/seo/Seo.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import LensCard from '$lib/components/cards/LensCard.svelte';
	import CategoryIcon from '$lib/components/icons/CategoryIcon.svelte';
	import Selector from '$lib/components/products/Selector.svelte';
	import { breadcrumbList } from '$lib/seo/jsonld';
	import { paths } from '$lib/links';

	let { data } = $props();
	const cat = $derived(data.cat);
	const crumbs = $derived([
		{ label: 'Products', href: paths.products() },
		{ label: cat.title ?? '', href: paths.category(cat.slug ?? '') }
	]);
	const site = $derived(page.data.settings?.siteUrl ?? page.url.origin);
</script>

<Seo
	title={cat.seo?.title ?? cat.title}
	description={cat.seo?.description ?? cat.description}
	image={cat.image}
	jsonLd={[breadcrumbList(crumbs, site)]}
/>

<section
	class="relative isolate overflow-hidden border-b border-line pt-[calc(var(--header-h)+2rem)]"
>
	<div class="container-site grid items-center gap-8 pb-12 lg:grid-cols-12">
		<div class="grid content-start gap-6 lg:col-span-6">
			<Breadcrumbs items={crumbs} />
			<CategoryIcon name={cat.icon ?? ''} draw class="size-12 text-accent" strokeWidth={1.25} />
			<h1 class="text-h1">{cat.title}</h1>
			{#if cat.description}<p class="max-w-[52ch] text-body-lg text-fg-muted">
					{cat.description}
				</p>{/if}
			<p class="font-mono text-sm text-fg-muted">
				{cat.count} models · {cat.subcategories.length} families
			</p>
		</div>
		<div class="relative lg:col-span-6">
			<div class="absolute inset-[10%] -z-10 rounded-full lens-glow" aria-hidden="true"></div>
			<SanityImage
				image={cat.image}
				priority
				sizes="(min-width: 1024px) 45vw, 100vw"
				aspect={4 / 3}
				class="aspect-4/3 rounded-scene bg-transparent"
			/>
		</div>
	</div>
</section>

{#if cat.subcategories.length > 1}
	<section class="container-site py-14" aria-labelledby="families">
		<h2 id="families" class="mb-6 text-h3">Browse by family</h2>
		<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each cat.subcategories as s (s._id)}
				<li>
					<LensCard
						href={paths.subcategory(cat.slug ?? '', s.slug ?? '')}
						title={s.title ?? ''}
						description={s.description ?? undefined}
						count={s.count}
						class="min-h-[18rem]"
					>
						{#snippet media()}<SanityImage
								image={s.image}
								sizes="(min-width: 1024px) 33vw, 50vw"
								class="h-full w-full"
							/>{/snippet}
					</LensCard>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<section class="container-site border-t border-line py-14" aria-labelledby="all-products">
	<h2 id="all-products" class="mb-8 text-h2">All {cat.title?.toLowerCase()}</h2>
	<Selector
		listing={data.listing}
		suggestions={cat.subcategories.map((s) => ({
			label: s.title ?? '',
			href: paths.subcategory(cat.slug ?? '', s.slug ?? '')
		}))}
	/>
</section>
