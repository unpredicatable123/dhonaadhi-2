<script lang="ts">
	import { FileText, FileCog, BookOpen, Box, BadgeCheck, Download } from '@lucide/svelte';
	import type { Product } from './types';

	let { product }: { product: Product } = $props();

	const icons = {
		datasheet: FileText,
		manual: BookOpen,
		firmware: FileCog,
		cad: Box,
		certificate: BadgeCheck
	} as const;
	const kinds = {
		datasheet: 'Datasheet',
		manual: 'Manual',
		firmware: 'Firmware',
		cad: 'CAD',
		certificate: 'Certificate'
	} as const;

	function size(bytes: number | null | undefined) {
		if (!bytes) return '';
		return bytes > 1e6
			? `${(bytes / 1e6).toFixed(1)} MB`
			: `${Math.max(1, Math.round(bytes / 1e3))} KB`;
	}
	const date = (d: string | null | undefined) =>
		d
			? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
			: '';
</script>

<section
	id="downloads"
	class="container-site scroll-mt-32 border-t border-line py-20"
	aria-labelledby="downloads-title"
>
	<h2 id="downloads-title" class="text-h2">Downloads</h2>
	{#if product.downloads?.length}
		<ul class="mt-8 grid max-w-4xl divide-y divide-line rounded-panel border border-line">
			{#each product.downloads as d (d._key)}
				{@const Icon = icons[d.kind as keyof typeof icons] ?? FileText}
				<li>
					<a
						href={d.url ?? '#'}
						download
						class="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-raised"
					>
						<span
							class="grid size-10 place-items-center rounded-control bg-surface text-accent hairline"
							><Icon class="size-5" aria-hidden="true" /></span
						>
						<span class="grid gap-0.5">
							<span class="font-medium">{d.title}</span>
							<span class="font-mono text-mono-sm text-fg-muted">
								{kinds[d.kind as keyof typeof kinds] ?? d.kind} · {d.ext?.toUpperCase()}{d.size
									? ` · ${size(d.size)}`
									: ''}{d.version ? ` · ${d.version}` : ''}{d.date ? ` · ${date(d.date)}` : ''}
							</span>
						</span>
						<Download
							class="size-5 text-fg-muted transition-colors group-hover:text-accent"
							aria-hidden="true"
						/>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mt-6 text-fg-muted">Documents for this product are being prepared.</p>
	{/if}
</section>
