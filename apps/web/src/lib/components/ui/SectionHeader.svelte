<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Eyebrow is optional and should carry information (a count, a category),
	 * not decorate every heading. See docs/design-system.md §1.
	 */
	type Props = {
		eyebrow?: string;
		title: string;
		lead?: string;
		level?: 1 | 2 | 3;
		size?: 'display' | 'h1' | 'h2';
		align?: 'start' | 'center';
		actions?: Snippet;
		id?: string;
		class?: string;
	};

	let {
		eyebrow,
		title,
		lead,
		level = 2,
		size = 'h2',
		align = 'start',
		actions,
		id,
		class: className
	}: Props = $props();

	const sizes = { display: 'text-display-xl', h1: 'text-h1', h2: 'text-h2' } as const;
</script>

<header
	class={cn(
		'grid gap-4',
		align === 'center' && 'justify-items-center text-center',
		actions && 'md:grid-cols-[1fr_auto] md:items-end',
		className
	)}
>
	<div class={cn('grid max-w-[46rem] gap-4', align === 'center' && 'justify-items-center')}>
		{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
		<svelte:element this={`h${level}`} {id} class={cn(sizes[size], 'font-display font-semibold')}>
			{title}
		</svelte:element>
		{#if lead}<p class="max-w-[60ch] text-body-lg text-fg-muted">{lead}</p>{/if}
	</div>
	{#if actions}<div class="flex flex-wrap gap-3">{@render actions()}</div>{/if}
</header>
