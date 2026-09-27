<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Chip } from '$lib/catalogue/selector';

	/** No results: say what happened and offer the quickest ways out. */
	let {
		chips,
		onremove,
		onclear,
		suggestions = []
	}: {
		chips: Chip[];
		onremove: (c: Chip) => void;
		onclear: () => void;
		suggestions?: { label: string; href: string }[];
	} = $props();

	const last = $derived(chips.at(-1));
</script>

<div class="grid justify-items-start gap-5 rounded-panel p-8 hairline">
	<p class="font-display text-h3">No products match all of these filters</p>
	<p class="max-w-[52ch] text-fg-muted">
		{chips.length} filters are active. Remove the most specific one, or clear them and start from the
		full range.
	</p>
	<div class="flex flex-wrap gap-3">
		{#if last}<Button onclick={() => onremove(last)}>Remove “{last.label}”</Button>{/if}
		<Button variant="secondary" onclick={onclear}>Clear all filters</Button>
	</div>
	{#if suggestions.length}
		<div class="grid gap-2">
			<p class="eyebrow">Or browse</p>
			<ul class="flex flex-wrap gap-2">
				{#each suggestions as s (s.href)}
					<li>
						<a
							href={s.href}
							class="flex min-h-11 items-center rounded-full px-4 text-sm hairline hover:border-accent"
							>{s.label}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
