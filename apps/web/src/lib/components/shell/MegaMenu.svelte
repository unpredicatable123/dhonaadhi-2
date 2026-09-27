<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import CategoryIcon from '$lib/components/icons/CategoryIcon.svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import { clipReveal } from '$lib/motion/reveal-clip';
	import { paths, resolveLink } from '$lib/links';
	import { cn } from '$lib/utils/cn';
	import type { CategoryTree, NavItem } from '$lib/sanity/types';

	let {
		id,
		item,
		categories,
		onenter
	}: { id: string; item: NavItem; categories: CategoryTree; onenter: () => void } = $props();

	let active = $state<string | undefined>();
	const current = $derived(categories.find((c) => c._id === active) ?? categories[0]);
	const featured = $derived(item.featured);
</script>

<div
	{id}
	transition:clipReveal
	onmouseenter={onenter}
	role="region"
	aria-label="{item.link?.label} menu"
	class="absolute inset-x-0 top-full border-b border-line bg-bg shadow-[0_40px_80px_-20px_rgb(0_0_0/0.7)]"
>
	<div class="container-site grid-site py-8">
		{#if item.mega === 'catalogue'}
			<ul class="col-span-4 grid content-start gap-0.5 border-r border-line pr-6">
				{#each categories as c (c._id)}
					<li>
						<a
							href={paths.category(c.slug ?? '')}
							onmouseenter={() => (active = c._id)}
							onfocus={() => (active = c._id)}
							class={cn(
								'group flex min-h-12 items-center gap-3 rounded-control px-3 transition-colors',
								current?._id === c._id ? 'bg-raised text-fg' : 'text-fg/80 hover:text-fg'
							)}
						>
							<CategoryIcon
								name={c.icon ?? ''}
								class={cn('size-5', current?._id === c._id ? 'text-accent' : 'text-fg-muted')}
							/>
							<span class="flex-1 text-sm font-medium">{c.title}</span>
							<span class="font-mono text-mono-sm text-fg-muted tabular-nums">{c.count}</span>
						</a>
					</li>
				{/each}
				<li class="mt-3 border-t border-line pt-3">
					<a
						href={paths.products()}
						class="flex min-h-11 items-center gap-2 px-3 text-sm font-medium text-accent hover:underline"
					>
						All products <ArrowRight class="size-4" aria-hidden="true" />
					</a>
				</li>
			</ul>

			{#if current}
				<div class="col-span-5 px-4">
					<p class="eyebrow">{current.title} · {current.count} products</p>
					{#if current.tagline}<p class="mt-2 font-display text-2xl font-medium">
							{current.tagline}
						</p>{/if}
					<ul class="mt-6 grid grid-cols-2 gap-x-4 gap-y-1">
						{#each current.subcategories as s (s._id)}
							<li>
								<a
									href={paths.subcategory(current.slug ?? '', s.slug ?? '')}
									class="flex min-h-11 items-center justify-between gap-3 rounded-control px-2 text-sm text-fg/80 transition-colors hover:bg-raised hover:text-fg"
								>
									{s.title}<span class="font-mono text-mono-sm text-fg-muted">{s.count}</span>
								</a>
							</li>
						{/each}
					</ul>
					<a
						href={paths.category(current.slug ?? '')}
						class="mt-6 inline-flex min-h-11 items-center gap-2 px-2 text-sm font-medium text-accent hover:underline"
					>
						View all {current.count} in {current.title?.toLowerCase()}
						<ArrowRight class="size-4" aria-hidden="true" />
					</a>
				</div>
			{/if}

			{#if featured}
				<a
					href={paths.product(featured)}
					class="group col-span-3 grid content-start gap-3 rounded-panel p-3 transition-colors hairline hover:border-steel-500"
				>
					<SanityImage
						image={featured.image}
						sizes="320px"
						aspect={4 / 3}
						class="aspect-4/3 rounded-control"
						imgClass="transition-transform duration-(--dur-slow) group-hover:scale-105"
					/>
					<span class="eyebrow text-accent">Featured</span>
					<span class="font-mono text-sm text-fg">{featured.modelNumber}</span>
					<span class="text-sm text-fg-muted">{featured.name}</span>
				</a>
			{/if}
		{:else}
			{#each item.columns ?? [] as col (col._key)}
				<div class="col-span-3">
					{#if col.heading}<p class="mb-3 eyebrow">{col.heading}</p>{/if}
					<ul class="grid gap-0.5">
						{#each col.links ?? [] as l (l._key)}
							<li>
								<a
									href={resolveLink(l)}
									class="flex min-h-11 items-center rounded-control px-2 text-sm text-fg/80 hover:bg-raised hover:text-fg"
									>{l.label}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
			<div class="col-span-6 col-start-7 self-end rounded-panel lens-glow p-6 hairline">
				<p class="font-display text-xl font-medium">{item.link?.label} pages are on the way.</p>
				<p class="mt-2 text-sm text-fg-muted">
					Until then, browse products by what they need to do.
				</p>
				<a
					href={resolveLink(item.link)}
					class="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent"
				>
					See what’s coming <ArrowRight class="size-4" aria-hidden="true" />
				</a>
			</div>
		{/if}
	</div>
</div>
