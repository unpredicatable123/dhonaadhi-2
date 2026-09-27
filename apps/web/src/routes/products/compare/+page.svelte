<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { Link2, Plus, X, Download } from '@lucide/svelte';
	import Seo from '$lib/components/seo/Seo.svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { toast } from '$lib/components/ui/toast.svelte';
	import { palette } from '$lib/components/shell/palette.svelte';
	import { compare, COMPARE_MAX } from '$lib/stores/compare.svelte';
	import { compareRows } from '$lib/catalogue/compare-rows';
	import { imageUrl } from '$lib/sanity/image';
	import { paths } from '$lib/links';
	import { cn } from '$lib/utils/cn';

	let { data } = $props();
	const products = $derived(data.products);
	const groups = $derived(compareRows(products));
	let highlight = $state(true);
	let onlyDiff = $state(false);

	// A shared link defines the selection: mirror it into this browser's compare tray.
	// untrack: add() reads the store it writes, which would re-trigger this effect forever.
	$effect(() => {
		const list = products;
		if (!list.length) return;
		untrack(() => {
			compare.clear();
			for (const p of list)
				compare.add({
					slug: p.slug ?? '',
					modelNumber: p.modelNumber ?? '',
					name: p.name ?? '',
					href: paths.product(p),
					image: imageUrl(p.image, 160, 120)
				});
		});
	});

	function remove(slug: string) {
		compare.remove(slug);
		goto(paths.compare(products.map((p) => p.slug ?? '').filter((s) => s !== slug)), {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	}

	async function share() {
		try {
			await navigator.clipboard.writeText(location.href);
			toast.show('Link copied — anyone with it sees this comparison', 'success');
		} catch {
			toast.show('Copy is blocked by the browser. Copy the address bar instead.', 'error');
		}
	}
</script>

<Seo
	title="Compare products"
	description="Compare up to four Dhonaadhi products side by side."
	noIndex
/>

<section class="container-site pt-[calc(var(--header-h)+2.5rem)] pb-8">
	<div class="flex flex-wrap items-end justify-between gap-6">
		<div class="grid gap-3">
			<p class="eyebrow">{products.length} of {COMPARE_MAX} selected</p>
			<h1 class="text-h1">Compare products</h1>
		</div>
		{#if products.length > 1}
			<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
				<Checkbox label="Highlight differences" bind:checked={highlight} />
				<Checkbox label="Only show differences" bind:checked={onlyDiff} />
				<Button variant="secondary" size="sm" onclick={share}
					><Link2 class="size-4" aria-hidden="true" /> Copy link</Button
				>
			</div>
		{/if}
	</div>
</section>

{#if products.length === 0}
	<section class="container-site pb-24">
		<div class="grid justify-items-start gap-5 rounded-panel p-10 hairline">
			<p class="font-display text-h3">Nothing to compare yet</p>
			<p class="max-w-[52ch] text-fg-muted">
				Tick “Compare” on up to four products in any listing, then come back here. Or search for a
				model to start.
			</p>
			<div class="flex flex-wrap gap-3">
				<Button href={paths.products()}>Browse products</Button>
				<Button variant="secondary" onclick={() => palette.show()}>Search models</Button>
			</div>
		</div>
	</section>
{:else}
	<section class="pb-24" aria-label="Comparison">
		<div class="container-site overflow-x-auto xl:overflow-visible" data-lenis-prevent>
			<table
				class="compare w-full min-w-[48rem] table-fixed border-separate border-spacing-0 text-sm"
			>
				<caption class="sr-only"
					>Side-by-side comparison of {products.map((p) => p.modelNumber).join(', ')}</caption
				>
				<colgroup>
					<col class="w-56" />
					{#each { length: Math.min(COMPARE_MAX, products.length + 1) } as _, i (i)}<col />{/each}
				</colgroup>
				<thead>
					<tr>
						<th scope="col" class="sticky top-(--header-h) z-10 bg-bg p-3 text-left align-bottom"
							><span class="sr-only">Specification</span></th
						>
						{#each products as p (p._id)}
							<th
								scope="col"
								class="sticky top-(--header-h) z-10 border-l border-line bg-bg p-3 text-left font-normal"
							>
								<div class="relative grid gap-2">
									<button
										type="button"
										onclick={() => remove(p.slug ?? '')}
										class="absolute -top-1 -right-1 z-10 grid tap place-items-center rounded-control bg-ink-950/80 text-fg-muted hover:text-fg"
									>
										<X class="size-4" aria-hidden="true" /><span class="sr-only"
											>Remove {p.modelNumber}</span
										>
									</button>
									<SanityImage
										image={p.image}
										sizes="14rem"
										aspect={4 / 3}
										class="aspect-4/3 rounded-control"
									/>
									<a href={paths.product(p)} class="grid hover:underline">
										<span class="font-mono text-accent">{p.modelNumber}</span>
										<span class="text-fg">{p.name}</span>
									</a>
									{#if p.datasheet?.url}
										<a
											href={p.datasheet.url}
											download
											class="flex min-h-11 items-center gap-1.5 text-caption text-fg-muted hover:text-accent"
											><Download class="size-3.5" aria-hidden="true" /> Datasheet</a
										>
									{/if}
								</div>
							</th>
						{/each}
						{#if products.length < COMPARE_MAX}
							<th scope="col" class="sticky top-(--header-h) z-10 border-l border-line bg-bg p-3">
								<button
									type="button"
									onclick={() => palette.show()}
									class="grid aspect-4/3 w-full place-items-center gap-1 rounded-control border border-dashed border-line text-fg-muted hover:border-accent hover:text-accent"
								>
									<span class="grid justify-items-center gap-1 text-sm"
										><Plus class="size-5" aria-hidden="true" />Add product</span
									>
								</button>
							</th>
						{/if}
					</tr>
				</thead>
				{#each groups as g (g.title)}
					{@const rows = onlyDiff ? g.rows.filter((r) => r.differs) : g.rows}
					{#if rows.length}
						<tbody>
							<tr
								><th
									colspan={products.length + (products.length < COMPARE_MAX ? 2 : 1)}
									scope="colgroup"
									class="px-3 pt-8 pb-2 text-left eyebrow text-accent">{g.title}</th
								></tr
							>
							{#each rows as r (r.label)}
								<tr class={cn(highlight && r.differs && 'bg-thermal-400/6')}>
									<th
										scope="row"
										class="border-t border-line px-3 py-2.5 text-left font-normal text-fg-muted"
									>
										{r.label}{#if highlight && r.differs}<span
												class="ml-2 inline-block size-1.5 rounded-full bg-thermal-400 align-middle"
												aria-hidden="true"
											></span><span class="sr-only"> (differs)</span>{/if}
									</th>
									{#each r.values as v, i (i)}
										<td class="border-t border-l border-line px-3 py-2.5 font-mono">{v}</td>
									{/each}
									{#if products.length < COMPARE_MAX}<td
											class="border-t border-l border-line"
											aria-hidden="true"
										></td>{/if}
								</tr>
							{/each}
						</tbody>
					{/if}
				{/each}
			</table>
		</div>
	</section>
{/if}
