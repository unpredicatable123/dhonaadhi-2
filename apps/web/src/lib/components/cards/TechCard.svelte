<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Technology card: a slow light sweep travels around the border. A conic-gradient
	 * layer rotates behind a 1px-inset surface; only `transform` animates, so the sweep
	 * runs on the compositor with no per-frame style recalculation.
	 */
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
		'tech group relative isolate grid gap-3 overflow-hidden rounded-panel p-6 shadow-card',
		className
	)}
>
	<span class="sweep" aria-hidden="true"></span>
	<span class="face" aria-hidden="true"></span>
	{#if icon}<span class="text-accent" aria-hidden="true">{@render icon()}</span>{/if}
	<svelte:element this={`h${headingLevel}`} class="font-display text-xl font-medium"
		>{title}</svelte:element
	>
	<p class="text-sm text-fg-muted">{summary}</p>
</svelte:element>

<style>
	.tech {
		background: var(--line);
	}
	/* Oversized square so the rotating gradient always covers the card's edges. */
	.sweep {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 200%;
		aspect-ratio: 1;
		z-index: -2;
		translate: -50% -50%;
		background: conic-gradient(
			transparent 0deg,
			transparent 250deg,
			var(--color-optic-400) 320deg,
			transparent 360deg
		);
		animation: sweep-rotate 3.2s linear infinite;
	}
	.face {
		position: absolute;
		inset: 1px;
		z-index: -1;
		border-radius: calc(var(--radius-panel) - 1px);
		background: var(--surface);
	}
	.tech:hover .sweep {
		animation-duration: 1.6s;
	}
	@keyframes sweep-rotate {
		to {
			transform: rotate(360deg);
		}
	}
	:global([data-motion='reduced']) .sweep {
		animation: none;
		opacity: 0;
	}
</style>
