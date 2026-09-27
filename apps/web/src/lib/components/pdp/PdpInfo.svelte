<script lang="ts">
	import { Copy, Check, Download, Columns3, MapPin } from '@lucide/svelte';
	import Tag from '$lib/components/ui/Tag.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import SpecChip from '$lib/components/ui/SpecChip.svelte';
	import { toast } from '$lib/components/ui/toast.svelte';
	import { compare, COMPARE_MAX } from '$lib/stores/compare.svelte';
	import { imageUrl } from '$lib/sanity/image';
	import { paths } from '$lib/links';
	import type { Product } from './types';

	let { product }: { product: Product } = $props();

	const datasheet = $derived(product.downloads?.find((d) => d.kind === 'datasheet'));
	const inCompare = $derived(compare.has(product.slug ?? ''));
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(product.modelNumber ?? '');
			copied = true;
			toast.show(`Copied ${product.modelNumber}`, 'success', 2000);
			setTimeout(() => (copied = false), 1600);
		} catch {
			toast.show('Copy is blocked by the browser. Select the model number to copy it.', 'error');
		}
	}

	function toggleCompare() {
		const ok = compare.toggle(
			{
				slug: product.slug ?? '',
				modelNumber: product.modelNumber ?? '',
				name: product.name ?? '',
				href: paths.product(product),
				image: imageUrl(product.image, 160, 120)
			},
			!inCompare
		);
		if (!ok) toast.show(`Compare holds ${COMPARE_MAX} products. Remove one first.`, 'error');
	}
</script>

<div class="grid content-start gap-6">
	<div class="flex flex-wrap items-center gap-2">
		{#if product.status === 'new'}<Tag tone="thermal">New</Tag>{/if}
		{#if product.status === 'discontinued'}<Tag tone="danger">Discontinued</Tag>{/if}
		{#if product.series}<Tag>{product.series.title}</Tag>{/if}
		{#each product.technologies ?? [] as t (t._id)}<Tag tone="optic">{t.title}</Tag>{/each}
	</div>

	<div class="grid gap-2">
		<div class="flex items-center gap-2">
			<p class="font-mono text-h3 tracking-tight text-accent">{product.modelNumber}</p>
			<button
				type="button"
				onclick={copy}
				class="grid tap place-items-center rounded-control text-fg-muted hover:bg-raised hover:text-fg"
				data-print="hide"
			>
				{#if copied}<Check class="size-4 text-accent" aria-hidden="true" />{:else}<Copy
						class="size-4"
						aria-hidden="true"
					/>{/if}
				<span class="sr-only">Copy model number</span>
			</button>
		</div>
		<h1 class="text-h2">{product.name}</h1>
		{#if product.shortDescription}<p class="max-w-[52ch] text-body-lg text-fg-muted">
				{product.shortDescription}
			</p>{/if}
	</div>

	{#if product.cardSpecs?.length}
		<ul class="flex flex-wrap gap-2" aria-label="Key specifications">
			{#each product.cardSpecs as s (s.label)}<li>
					<SpecChip label={s.label ?? ''} value={s.value ?? ''} unit={s.unit ?? undefined} />
				</li>{/each}
		</ul>
	{/if}

	{#if product.highlights?.length}
		<ul class="grid gap-2 border-t border-line pt-5">
			{#each product.highlights as h (h)}
				<li class="flex gap-3 text-sm">
					<span class="mt-2 size-1.5 shrink-0 rounded-full bg-accent-fill" aria-hidden="true"
					></span>{h}
				</li>
			{/each}
		</ul>
	{/if}

	<div class="flex flex-wrap gap-3" data-print="hide">
		{#if datasheet?.url}
			<Button href={datasheet.url} download size="lg"
				><Download class="size-4" aria-hidden="true" /> Download datasheet</Button
			>
		{/if}
		<Button variant="secondary" size="lg" onclick={toggleCompare} aria-pressed={inCompare}>
			<Columns3 class="size-4" aria-hidden="true" />{inCompare ? 'In compare' : 'Add to compare'}
		</Button>
		<Button variant="ghost" size="lg" href={paths.comingSoon('partners')}
			><MapPin class="size-4" aria-hidden="true" /> Where to buy</Button
		>
	</div>

	{#if product.variants?.length}
		<details class="rounded-control border border-line px-4 py-3">
			<summary class="flex min-h-8 cursor-pointer items-center justify-between text-sm font-medium">
				Orderable models <span class="font-mono text-mono-sm text-fg-muted"
					>{product.variants.length}</span
				>
			</summary>
			<ul class="mt-3 grid gap-1">
				{#each product.variants as v (v._key)}
					<li
						class="flex items-center justify-between gap-3 border-t border-line py-2 font-mono text-sm"
					>
						{v.suffix}
						{#if v.status === 'discontinued'}<Tag tone="danger">Discontinued</Tag
							>{:else if v.status === 'new'}<Tag tone="thermal">New</Tag>{/if}
					</li>
				{/each}
			</ul>
		</details>
	{/if}
</div>
