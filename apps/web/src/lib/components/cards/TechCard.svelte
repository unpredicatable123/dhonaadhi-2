<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	/** Technology card: a slow light sweep travels around the border (conic gradient + mask). */
	type Props = {
		href?: string;
		title: string;
		summary: string;
		icon?: Snippet;
		headingLevel?: 2 | 3;
		class?: string;
	};

	let { href, title, summary, icon, headingLevel = 3, class: className }: Props = $props();
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class={cn(
		'tech group relative isolate grid gap-3 rounded-panel bg-surface p-6 shadow-card',
		className
	)}
>
	{#if icon}<span class="text-accent" aria-hidden="true">{@render icon()}</span>{/if}
	<svelte:element this={`h${headingLevel}`} class="font-display text-xl font-medium"
		>{title}</svelte:element
	>
	<p class="text-sm text-fg-muted">{summary}</p>
</svelte:element>

<style>
	.tech::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		padding: 1px;
		border-radius: inherit;
		background: conic-gradient(
			from var(--sweep-angle),
			var(--color-ink-700) 0deg,
			var(--color-ink-700) 250deg,
			var(--color-optic-400) 320deg,
			var(--color-ink-700) 360deg
		);
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask-composite: exclude;
		animation: var(--animate-sweep);
	}
	.tech:hover::before {
		animation-duration: 1.6s;
	}
	:global([data-motion='reduced']) .tech::before {
		animation: none;
	}
</style>
