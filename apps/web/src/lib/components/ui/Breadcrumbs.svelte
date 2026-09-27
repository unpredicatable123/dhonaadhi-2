<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { cn } from '$lib/utils/cn';

	export type Crumb = { label: string; href: string };

	/** The last crumb is the current page and is not a link. */
	let { items, class: className }: { items: Crumb[]; class?: string } = $props();
</script>

<nav aria-label="Breadcrumb" class={cn('text-caption', className)}>
	<ol class="flex flex-wrap items-center gap-x-1 gap-y-1 text-fg-muted">
		{#each items as item, i (item.href)}
			<li class="flex items-center gap-1">
				{#if i < items.length - 1}
					<a
						href={item.href}
						class="inline-flex min-h-11 items-center rounded-chip px-1 transition-colors hover:text-fg"
						>{item.label}</a
					>
					<ChevronRight class="size-3.5 opacity-60" aria-hidden="true" />
				{:else}
					<span aria-current="page" class="px-1 text-fg">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
