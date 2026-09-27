<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ArrowUpRight } from '@lucide/svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Category card, "Lens": the image sits in a circular aperture that opens to fill the
	 * card on hover/focus. Product count in mono.
	 */
	type Props = {
		href: string;
		title: string;
		description?: string;
		count?: number;
		media: Snippet;
		icon?: Snippet;
		headingLevel?: 2 | 3;
		class?: string;
	};

	let {
		href,
		title,
		description,
		count,
		media,
		icon,
		headingLevel = 3,
		class: className
	}: Props = $props();
</script>

<a
	{href}
	class={cn(
		'lens group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-panel bg-surface p-6 hairline',
		className
	)}
>
	<div class="aperture absolute inset-0 -z-10" aria-hidden="true">
		<div
			class="h-full w-full scale-110 transition-transform duration-(--dur-scene) ease-lens group-hover:scale-100"
		>
			{@render media()}
		</div>
		<div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent"></div>
	</div>
	<div class="flex items-start justify-between gap-4">
		{#if icon}<span class="text-accent" aria-hidden="true">{@render icon()}</span>{/if}
		{#if count !== undefined}
			<span class="ml-auto font-mono text-mono-sm text-fg-muted tabular-nums">
				{String(count).padStart(2, '0')} products
			</span>
		{/if}
	</div>
	<div class="mt-auto grid gap-2 pt-24">
		<svelte:element
			this={`h${headingLevel}`}
			class="flex items-center gap-2 font-display text-h3 font-medium"
		>
			{title}
			<ArrowUpRight
				class="size-5 -translate-x-1 opacity-0 transition duration-(--dur-base) group-hover:translate-x-0 group-hover:opacity-100"
				aria-hidden="true"
			/>
		</svelte:element>
		{#if description}<p class="line-clamp-2 max-w-[40ch] text-sm text-fg-muted">
				{description}
			</p>{/if}
	</div>
</a>

<style>
	.aperture {
		clip-path: circle(26% at 76% 30%);
		transition: clip-path var(--dur-scene) var(--ease-lens);
	}
	.lens:hover .aperture,
	.lens:focus-visible .aperture {
		clip-path: circle(80% at 50% 50%);
	}
	:global([data-motion='reduced']) .aperture {
		transition-duration: 0ms;
	}
</style>
