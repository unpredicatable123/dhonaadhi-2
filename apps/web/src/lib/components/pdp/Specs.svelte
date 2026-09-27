<script lang="ts">
	import { Printer } from '@lucide/svelte';
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import type { Product } from './types';

	let { product }: { product: Product } = $props();
	const groups = $derived(product.fullSpecs ?? []);
</script>

<section
	id="specifications"
	class="container-site scroll-mt-32 border-t border-line py-20"
	aria-labelledby="specs-title"
>
	<div class="flex flex-wrap items-end justify-between gap-4">
		<h2 id="specs-title" class="text-h2">Specifications</h2>
		<button
			type="button"
			onclick={() => print()}
			class="flex h-11 items-center gap-2 rounded-control px-4 text-sm hairline hover:border-accent print:hidden"
		>
			<Printer class="size-4" aria-hidden="true" /> Print specifications
		</button>
	</div>
	<Tabs
		label="Specification view"
		class="mt-8"
		tabs={[
			{ id: 'grouped', label: 'By group' },
			{ id: 'all', label: 'Show all' }
		]}
	>
		{#snippet panel(id)}
			{#if id === 'grouped'}
				<div class="max-w-4xl">
					{#each groups as g, i (g._key)}
						<Accordion title={g.group ?? ''} meta="{g.rows?.length ?? 0} rows" open={i < 2}>
							<dl class="grid">
								{#each g.rows ?? [] as r (r._key)}
									<div class="grid gap-1 border-t border-line py-2.5 sm:grid-cols-[14rem_1fr]">
										<dt class="text-sm text-fg-muted">{r.key}</dt>
										<dd class="font-mono text-sm">{r.value}</dd>
									</div>
								{/each}
							</dl>
						</Accordion>
					{/each}
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full min-w-[36rem] text-left text-sm">
						<caption class="sr-only">{product.modelNumber} full specifications</caption>
						{#each groups as g (g._key)}
							<tbody>
								<tr
									><th colspan="2" scope="colgroup" class="pt-6 pb-2 eyebrow text-accent"
										>{g.group}</th
									></tr
								>
								{#each g.rows ?? [] as r (r._key)}
									<tr class="border-t border-line">
										<th scope="row" class="w-64 py-2 pr-4 font-normal text-fg-muted">{r.key}</th>
										<td class="py-2 font-mono">{r.value}</td>
									</tr>
								{/each}
							</tbody>
						{/each}
					</table>
				</div>
			{/if}
		{/snippet}
	</Tabs>
</section>
