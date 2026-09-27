<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Real links (crawlable, work without JS) plus an optional "Load more" that appends
	 * the next page in place. `href(page)` builds the URL so filters are preserved.
	 */
	type Props = {
		page: number;
		pages: number;
		href: (page: number) => string;
		onloadmore?: () => void;
		loading?: boolean;
		remaining?: number;
		class?: string;
	};

	let {
		page,
		pages,
		href,
		onloadmore,
		loading = false,
		remaining,
		class: className
	}: Props = $props();

	const windowed = $derived.by(() => {
		const out: (number | '…')[] = [];
		for (let p = 1; p <= pages; p++) {
			if (p === 1 || p === pages || Math.abs(p - page) <= 1) out.push(p);
			else if (out.at(-1) !== '…') out.push('…');
		}
		return out;
	});

	const link =
		'tap inline-grid place-items-center rounded-control px-3 font-mono text-sm tabular-nums transition-colors';
</script>

{#if pages > 1}
	<div class={cn('grid min-w-0 justify-items-center gap-6', className)}>
		{#if onloadmore && page < pages}
			<button
				type="button"
				onclick={onloadmore}
				disabled={loading}
				aria-busy={loading}
				class="h-12 rounded-control px-6 text-sm font-medium transition-colors hairline hover:border-accent hover:text-accent disabled:opacity-60"
			>
				{loading ? 'Loading…' : `Load more${remaining ? ` (${remaining})` : ''}`}
			</button>
		{/if}
		<nav aria-label="Pagination">
			<ul class="flex flex-wrap items-center justify-center gap-1">
				<li>
					{#if page > 1}
						<a class={cn(link, 'hover:bg-raised')} href={href(page - 1)} rel="prev">
							<ChevronLeft class="size-4" aria-hidden="true" /><span class="sr-only"
								>Previous page</span
							>
						</a>
					{/if}
				</li>
				{#each windowed as p, i (`${p}-${i}`)}
					<li>
						{#if p === '…'}
							<span class="px-2 text-fg-muted" aria-hidden="true">…</span>
						{:else}
							<a
								href={href(p)}
								aria-current={p === page ? 'page' : undefined}
								class={cn(link, p === page ? 'bg-accent-fill text-on-accent' : 'hover:bg-raised')}
								><span class="sr-only">Page </span>{p}</a
							>
						{/if}
					</li>
				{/each}
				<li>
					{#if page < pages}
						<a class={cn(link, 'hover:bg-raised')} href={href(page + 1)} rel="next">
							<ChevronRight class="size-4" aria-hidden="true" /><span class="sr-only"
								>Next page</span
							>
						</a>
					{/if}
				</li>
			</ul>
		</nav>
	</div>
{/if}
