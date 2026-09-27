<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FilterPanel from './FilterPanel.svelte';
	import ResultsToolbar from './ResultsToolbar.svelte';
	import ResultsGrid from './ResultsGrid.svelte';
	import EmptyState from './EmptyState.svelte';
	import {
		cleared,
		serializeSelection,
		without,
		type Chip,
		type Selection,
		type Sort
	} from '$lib/catalogue/selector';
	import type { Listing } from '$lib/server/listing';

	/**
	 * Product selector. The URL is the source of truth: filter edits update a local
	 * copy immediately (instant feedback) and navigate after a short debounce.
	 */
	let {
		listing,
		suggestions = []
	}: { listing: Listing; suggestions?: { label: string; href: string }[] } = $props();

	// Optimistic copy of the URL selection: overwritten on edit, re-derived when new data arrives.
	let local = $derived<Selection>(structuredClone($state.snapshot(listing.selection)) as Selection);

	let drawer = $state(false);
	let loadingMore = $state(false);
	let view = $state<'grid' | 'list'>('grid');
	let results: HTMLElement;

	// Per-viewer convenience: remember grid/list choice.
	$effect(() => {
		try {
			const v = localStorage.getItem('dh-view');
			if (v === 'grid' || v === 'list') view = v;
		} catch {
			/* storage unavailable */
		}
	});
	$effect(() => {
		try {
			localStorage.setItem('dh-view', view);
		} catch {
			/* storage unavailable */
		}
	});

	let timer: ReturnType<typeof setTimeout> | undefined;
	function navigate(next: Selection, delay = 250) {
		local = next;
		clearTimeout(timer);
		timer = setTimeout(() => {
			goto(page.url.pathname + serializeSelection(next), { noScroll: true, keepFocus: true });
		}, delay);
	}

	const remove = (c: Chip) => navigate(without(local, c), 0);
	const clearAll = () => navigate(cleared(local), 0);
	const sortBy = (sort: Sort) => navigate({ ...local, sort, page: 1 }, 0);

	async function loadMore(e: MouseEvent) {
		e.preventDefault();
		const before = listing.items.length;
		loadingMore = true;
		await goto(
			page.url.pathname +
				serializeSelection({ ...listing.selection, page: listing.selection.page + 1 }),
			{
				noScroll: true,
				keepFocus: true
			}
		);
		loadingMore = false;
		await tick();
		// Move focus to the first newly loaded product for keyboard and screen-reader users.
		results?.querySelectorAll<HTMLAnchorElement>('article h3 a, article h2 a')[before]?.focus();
	}

	const filterCount = $derived(listing.chips.length);
	const remaining = $derived(listing.total - listing.items.length);
</script>

<div class="grid gap-10 lg:grid-cols-[17rem_1fr]">
	<aside class="hidden lg:block" aria-label="Filters">
		<div
			class="sticky top-[calc(var(--header-h)+1.5rem)] max-h-[calc(100svh-var(--header-h)-3rem)] overflow-y-auto overscroll-contain pr-2"
			data-lenis-prevent
		>
			<p class="mb-2 eyebrow">Filter {listing.scopeTotal} products</p>
			<FilterPanel facets={listing.facets} selection={local} onchange={(s) => navigate(s)} />
		</div>
	</aside>

	<div bind:this={results} id="results" class="grid scroll-mt-28 content-start gap-6">
		<ResultsToolbar
			total={listing.total}
			chips={listing.chips}
			sort={listing.selection.sort}
			bind:view
			onsort={sortBy}
			onremove={remove}
			onclear={clearAll}
			onfilters={() => (drawer = true)}
			{filterCount}
		/>
		{#if listing.items.length}
			<ResultsGrid items={listing.items} {view} />
			{#if remaining > 0}
				<div class="grid justify-items-center gap-2 pt-4">
					<a
						href={page.url.pathname +
							serializeSelection({ ...listing.selection, page: listing.selection.page + 1 })}
						onclick={loadMore}
						aria-busy={loadingMore}
						class="flex h-12 items-center rounded-control px-6 text-sm font-medium hairline hover:border-accent hover:text-accent"
						>{loadingMore ? 'Loading…' : `Show ${Math.min(remaining, listing.pageSize)} more`}</a
					>
					<p class="font-mono text-mono-sm text-fg-muted">
						{listing.items.length} of {listing.total}
					</p>
				</div>
			{/if}
		{:else}
			<EmptyState chips={listing.chips} onremove={remove} onclear={clearAll} {suggestions} />
		{/if}
	</div>
</div>

<Dialog bind:open={drawer} title="Filters" placement="left">
	<FilterPanel facets={listing.facets} selection={local} onchange={(s) => navigate(s)} />
	{#snippet footer()}
		<div class="flex gap-3">
			<Button variant="secondary" class="flex-1" onclick={clearAll}>Clear</Button>
			<Button class="flex-1" onclick={() => (drawer = false)}>Show {listing.total} products</Button>
		</div>
	{/snippet}
</Dialog>
