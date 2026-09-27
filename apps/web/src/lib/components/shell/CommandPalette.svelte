<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search, CornerDownLeft } from '@lucide/svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import CategoryIcon from '$lib/components/icons/CategoryIcon.svelte';
	import { paths } from '$lib/links';
	import { palette } from './palette.svelte';
	import { cn } from '$lib/utils/cn';
	import type { CategoryTree, ProductCardData } from '$lib/sanity/types';

	let { categories }: { categories: CategoryTree } = $props();

	let query = $state('');
	let results = $state<ProductCardData[]>([]);
	let loading = $state(false);
	let active = $state(0);
	let input: HTMLInputElement | undefined = $state();
	const listId = 'palette-results';

	type Row = {
		key: string;
		href: string;
		kind: 'product' | 'category';
		item: ProductCardData | CategoryTree[number];
	};
	const rows = $derived<Row[]>(
		query.trim().length >= 2
			? results.map((p) => ({ key: p._id, href: paths.product(p), kind: 'product', item: p }))
			: categories.map((c) => ({
					key: c._id,
					href: paths.category(c.slug ?? ''),
					kind: 'category',
					item: c
				}))
	);

	// ⌘K / Ctrl+K anywhere; "/" when not typing in a field.
	$effect(() => {
		const onKey = (e: KeyboardEvent) => {
			const typing = (e.target as HTMLElement)?.closest(
				'input, textarea, select, [contenteditable]'
			);
			if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
				e.preventDefault();
				palette.show();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	$effect(() => {
		if (palette.open) {
			query = palette.initialQuery;
			queueMicrotask(() => input?.focus());
		}
	});

	// Debounced search; stale responses are ignored.
	let seq = 0;
	$effect(() => {
		const q = query.trim();
		if (q.length < 2) {
			results = [];
			return;
		}
		const id = ++seq;
		loading = true;
		const t = setTimeout(async () => {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
			if (id !== seq) return;
			results = res.ok ? ((await res.json()) as ProductCardData[]) : [];
			active = 0;
			loading = false;
		}, 160);
		return () => clearTimeout(t);
	});

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') active = Math.min(rows.length - 1, active + 1);
		else if (e.key === 'ArrowUp') active = Math.max(0, active - 1);
		else if (e.key === 'Enter' && rows[active]) go(rows[active].href);
		else return;
		e.preventDefault();
	}

	function go(href: string) {
		palette.hide();
		goto(href);
	}
</script>

<Dialog
	bind:open={palette.open}
	title="Search products"
	chrome={false}
	class="top-[12vh] bottom-auto"
>
	<div class="-mx-5 -mt-5 flex items-center gap-3 border-b border-line px-5">
		<Search class="size-5 text-fg-muted" aria-hidden="true" />
		<input
			bind:this={input}
			bind:value={query}
			{onkeydown}
			type="search"
			role="combobox"
			aria-label="Search by model number or name"
			aria-expanded={rows.length > 0}
			aria-controls={listId}
			aria-activedescendant={rows[active] ? `pal-${rows[active].key}` : undefined}
			aria-autocomplete="list"
			placeholder="Model number or name, e.g. NB-8M"
			autocomplete="off"
			spellcheck="false"
			class="palette-input h-16 flex-1 bg-transparent font-mono text-base outline-none placeholder:font-sans placeholder:text-fg-muted"
		/>
	</div>
	<p class="mt-4 mb-2 eyebrow" aria-live="polite">
		{#if query.trim().length < 2}Browse categories{:else if loading}Searching…{:else}{results.length}
			{results.length === 1 ? 'match' : 'matches'}{/if}
	</p>
	<ul id={listId} role="listbox" aria-label="Results" class="grid gap-0.5">
		{#each rows as row, i (row.key)}
			<li
				id="pal-{row.key}"
				role="option"
				aria-selected={i === active}
				class={cn(
					'flex min-h-14 cursor-pointer items-center gap-4 rounded-control px-3',
					i === active ? 'bg-raised' : 'hover:bg-raised/60'
				)}
				onmousemove={() => (active = i)}
				onclick={() => go(row.href)}
				onkeydown={() => {}}
			>
				{#if row.kind === 'product'}
					{@const p = row.item as ProductCardData}
					<SanityImage
						image={p.image}
						sizes="64px"
						aspect={4 / 3}
						class="h-10 w-14 shrink-0 rounded-chip"
					/>
					<span class="grid">
						<span class="font-mono text-sm text-accent">{p.modelNumber}</span>
						<span class="text-sm text-fg-muted">{p.name}</span>
					</span>
				{:else}
					{@const c = row.item as CategoryTree[number]}
					<CategoryIcon name={c.icon ?? ''} class="size-5 text-accent" />
					<span class="flex-1 text-sm">{c.title}</span>
					<span class="font-mono text-mono-sm text-fg-muted">{c.count}</span>
				{/if}
				{#if i === active}<CornerDownLeft
						class="ml-auto size-4 text-fg-muted"
						aria-hidden="true"
					/>{/if}
			</li>
		{:else}
			{#if !loading}
				<li class="px-3 py-6 text-sm text-fg-muted">
					No model matches “{query}”. Try part of a model number such as “NT-” or a word like
					“thermal”.
				</li>
			{/if}
		{/each}
	</ul>
</Dialog>

<style>
	.palette-input::-webkit-search-cancel-button {
		filter: invert(0.55);
		cursor: pointer;
	}
</style>
