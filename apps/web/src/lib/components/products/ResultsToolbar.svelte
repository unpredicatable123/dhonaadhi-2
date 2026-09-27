<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { LayoutGrid, List, SlidersHorizontal, X } from '@lucide/svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { motion } from '$lib/stores/motion.svelte';
	import { cn } from '$lib/utils/cn';
	import type { Chip, Sort } from '$lib/catalogue/selector';

	let {
		total,
		chips,
		sort,
		view = $bindable('grid'),
		onsort,
		onremove,
		onclear,
		onfilters,
		filterCount
	}: {
		total: number;
		chips: Chip[];
		sort: Sort;
		view?: 'grid' | 'list';
		onsort: (s: Sort) => void;
		onremove: (c: Chip) => void;
		onclear: () => void;
		onfilters: () => void;
		filterCount: number;
	} = $props();

	// Result count rolls to its new value instead of jumping.
	const count = new Tween(0, { duration: 420, easing: cubicOut });
	$effect(() => {
		count.set(total, { duration: motion.reduced ? 0 : 420 });
	});
</script>

<div class="grid gap-4">
	<div class="flex flex-wrap items-center gap-3">
		<p class="mr-auto font-mono text-sm text-fg-muted" aria-live="polite" aria-atomic="true">
			<span class="text-fg tabular-nums">{Math.round(count.current)}</span>
			<span class="sr-only">{total}</span>
			{total === 1 ? 'product' : 'products'}
		</p>
		<button
			type="button"
			onclick={onfilters}
			class="flex h-11 items-center gap-2 rounded-control px-4 text-sm hairline hover:border-accent lg:hidden"
		>
			<SlidersHorizontal class="size-4" aria-hidden="true" /> Filters
			{#if filterCount}<span
					class="grid size-5 place-items-center rounded-full bg-accent-fill font-mono text-[0.6875rem] text-on-accent"
					>{filterCount}</span
				>{/if}
		</button>
		<Select
			label="Sort by"
			hideLabel
			value={sort}
			onchange={(e) => onsort(e.currentTarget.value as Sort)}
			class="w-40"
			options={[
				{ value: 'newest', label: 'Newest first' },
				{ value: 'resolution', label: 'Highest resolution' },
				{ value: 'name', label: 'Model A–Z' }
			]}
		/>
		<div class="hidden rounded-control p-0.5 hairline sm:flex" role="group" aria-label="Layout">
			{#each [['grid', LayoutGrid, 'Grid view'], ['list', List, 'List view']] as const as [v, Icon, label] (v)}
				<button
					type="button"
					aria-pressed={view === v}
					onclick={() => (view = v)}
					class={cn(
						'grid size-10 place-items-center rounded-[7px] transition-colors',
						view === v ? 'bg-raised text-fg' : 'text-fg-muted hover:text-fg'
					)}
				>
					<Icon class="size-4" aria-hidden="true" /><span class="sr-only">{label}</span>
				</button>
			{/each}
		</div>
	</div>

	{#if chips.length}
		<ul class="flex flex-wrap items-center gap-2" aria-label="Active filters">
			{#each chips as c (c.key + (c.value ?? ''))}
				<li>
					<button
						type="button"
						onclick={() => onremove(c)}
						class="flex h-9 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 pr-2 pl-3 text-sm text-fg transition-colors hover:border-accent"
					>
						{c.label}<X class="size-3.5 text-accent" aria-hidden="true" /><span class="sr-only"
							>Remove filter</span
						>
					</button>
				</li>
			{/each}
			<li>
				<button
					type="button"
					onclick={onclear}
					class="h-9 px-2 text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline"
					>Clear all</button
				>
			</li>
		</ul>
	{/if}
</div>
