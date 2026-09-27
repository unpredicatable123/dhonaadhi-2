<script lang="ts">
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RangeSlider from '$lib/components/ui/RangeSlider.svelte';
	import type { Facet } from '$lib/catalogue/facets';
	import type { Selection } from '$lib/catalogue/selector';

	/** Filter groups generated from the listing's filterConfig. Emits a new selection. */
	let {
		facets,
		selection,
		onchange
	}: { facets: Facet[]; selection: Selection; onchange: (next: Selection) => void } = $props();

	function update(mutate: (s: Selection) => void) {
		const next = structuredClone($state.snapshot(selection)) as Selection;
		mutate(next);
		next.page = 1;
		onchange(next);
	}

	function toggle(key: string, value: string, on: boolean) {
		update((s) => {
			const rest = (s.values[key] ?? []).filter((v) => v !== value);
			s.values[key] = on ? [...rest, value] : rest;
		});
	}

	function activeIn(f: Facet): number {
		if (f.ui === 'checkbox') return selection.values[f.key]?.length ?? 0;
		if (f.ui === 'range') return (selection.ranges[f.key] ?? []).some((v) => v !== null) ? 1 : 0;
		return selection.bools[f.key] ? 1 : 0;
	}
</script>

<div class="grid">
	{#each facets as f (f.key)}
		{@const n = activeIn(f)}
		<Accordion
			title={f.label}
			level={3}
			open={!f.collapsed || n > 0}
			meta={n ? `${n} on` : undefined}
		>
			{#if f.ui === 'checkbox'}
				<div class="grid">
					{#each f.options as o (o.value)}
						<Checkbox
							label={o.label}
							count={o.count}
							checked={selection.values[f.key]?.includes(o.value) ?? false}
							onchange={(e) => toggle(f.key, o.value, e.currentTarget.checked)}
						/>
					{/each}
				</div>
			{:else if f.ui === 'range'}
				{@const [lo, hi] = selection.ranges[f.key] ?? [null, null]}
				<RangeSlider
					label={f.label}
					hideLabel
					min={f.min}
					max={f.max}
					step={1}
					unit={f.unit ? ` ${f.unit}` : ''}
					value={[lo ?? f.min, hi ?? f.max]}
					onchange={([a, b]) =>
						update((s) => {
							s.ranges[f.key] = [a <= f.min ? null : a, b >= f.max ? null : b];
						})}
				/>
			{:else}
				<Checkbox
					label="{f.label} only"
					count={f.count}
					checked={selection.bools[f.key] === true}
					onchange={(e) =>
						update((s) => {
							s.bools[f.key] = e.currentTarget.checked ? true : null;
						})}
				/>
			{/if}
		</Accordion>
	{/each}
</div>
