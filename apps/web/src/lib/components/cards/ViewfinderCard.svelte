<script lang="ts" module>
	export type CardSpec = { label: string; value: string | number; unit?: string };
	export type CardStatus = 'new' | 'active' | 'discontinued';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import SpecChip from '$lib/components/ui/SpecChip.svelte';
	import Tag from '$lib/components/ui/Tag.svelte';
	import { tilt } from '$lib/motion/actions';
	import { cn } from '$lib/utils/cn';

	/**
	 * Product card, "Viewfinder": corner brackets close in on hover, a rack-focus on the
	 * image, a pointer-following spotlight and a ≤6° tilt. The whole card is one link
	 * (stretched pseudo-element); the compare toggle sits above it.
	 */
	type Props = {
		href: string;
		modelNumber: string;
		name: string;
		specs: CardSpec[];
		status?: CardStatus;
		media: Snippet;
		layout?: 'grid' | 'list';
		/** Unique view-transition-name shared with the detail page hero. */
		transitionName?: string;
		compare?: { checked: boolean; disabled?: boolean; onchange: (checked: boolean) => void };
		headingLevel?: 2 | 3;
		class?: string;
	};

	let {
		href,
		modelNumber,
		name,
		specs,
		status = 'active',
		media,
		layout = 'grid',
		transitionName,
		compare,
		headingLevel = 3,
		class: className
	}: Props = $props();

	const id = $props.id();
</script>

<article
	use:tilt
	class={cn(
		'viewfinder group relative isolate rounded-control bg-surface p-3 shadow-card transition-colors duration-(--dur-base) hairline hover:border-steel-500',
		layout === 'list'
			? 'grid grid-cols-[8rem_1fr] gap-4 sm:grid-cols-[12rem_1fr_auto]'
			: 'grid gap-4',
		className
	)}
	aria-labelledby="{id}-title"
>
	<div
		class="media relative aspect-4/3 overflow-hidden rounded-[6px] bg-ink-900"
		style:view-transition-name={transitionName}
	>
		<div
			class="h-full w-full transition-transform duration-(--dur-slow) ease-lens group-hover:scale-[1.04]"
		>
			{@render media()}
		</div>
		{#each ['tl', 'tr', 'bl', 'br'] as c (c)}
			<span class="bracket bracket-{c}" aria-hidden="true"></span>
		{/each}
		{#if status !== 'active'}
			<Tag tone={status === 'new' ? 'thermal' : 'danger'} class="absolute top-2.5 left-2.5"
				>{status}</Tag
			>
		{/if}
	</div>

	<div class="grid content-start gap-2 px-1 pb-1">
		<p class="font-mono text-mono-sm tracking-[0.04em] text-accent">{modelNumber}</p>
		<svelte:element
			this={`h${headingLevel}`}
			id="{id}-title"
			class="font-sans text-base leading-snug font-medium"
		>
			<a
				{href}
				class="after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:outline-none"
			>
				{name}
			</a>
		</svelte:element>
		<ul class="mt-1 flex flex-wrap gap-1.5" aria-label="Key specifications">
			{#each specs.slice(0, 3) as s (s.label)}
				<li><SpecChip {...s} /></li>
			{/each}
		</ul>
	</div>

	{#if compare}
		<label
			class={cn(
				'relative z-10 flex min-h-11 cursor-pointer items-center gap-2 self-end px-1 text-caption text-fg-muted hover:text-fg',
				layout === 'list' && 'col-start-2 sm:col-start-3 sm:row-start-1'
			)}
		>
			<input
				type="checkbox"
				class="size-4 accent-optic-400"
				checked={compare.checked}
				disabled={compare.disabled && !compare.checked}
				onchange={(e) => compare.onchange(e.currentTarget.checked)}
			/>
			Compare<span class="sr-only"> {modelNumber}</span>
		</label>
	{/if}
</article>

<style>
	.viewfinder {
		transform-style: preserve-3d;
	}
	.viewfinder:has(a:focus-visible) {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}
	/* Spotlight follows the pointer (vars set by use:tilt). */
	.viewfinder::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		opacity: 0;
		transition: opacity var(--dur-base) var(--ease-lens);
		background: radial-gradient(
			22rem circle at var(--mx, 50%) var(--my, 30%),
			color-mix(in oklab, var(--color-optic-400) 9%, transparent),
			transparent 70%
		);
	}
	.viewfinder:hover::before {
		opacity: 1;
	}
	.bracket {
		position: absolute;
		width: 14px;
		height: 14px;
		border-color: color-mix(in oklab, var(--color-mist-100) 55%, transparent);
		transition:
			translate var(--dur-base) var(--ease-lens),
			border-color var(--dur-base);
	}
	.bracket-tl {
		top: 10px;
		left: 10px;
		border-top: 1.5px solid;
		border-left: 1.5px solid;
	}
	.bracket-tr {
		top: 10px;
		right: 10px;
		border-top: 1.5px solid;
		border-right: 1.5px solid;
	}
	.bracket-bl {
		bottom: 10px;
		left: 10px;
		border-bottom: 1.5px solid;
		border-left: 1.5px solid;
	}
	.bracket-br {
		bottom: 10px;
		right: 10px;
		border-bottom: 1.5px solid;
		border-right: 1.5px solid;
	}
	.viewfinder:hover .bracket,
	.viewfinder:focus-within .bracket {
		border-color: var(--color-optic-400);
	}
	.viewfinder:hover .bracket-tl,
	.viewfinder:focus-within .bracket-tl {
		translate: 8px 8px;
	}
	.viewfinder:hover .bracket-tr,
	.viewfinder:focus-within .bracket-tr {
		translate: -8px 8px;
	}
	.viewfinder:hover .bracket-bl,
	.viewfinder:focus-within .bracket-bl {
		translate: 8px -8px;
	}
	.viewfinder:hover .bracket-br,
	.viewfinder:focus-within .bracket-br {
		translate: -8px -8px;
	}
	/* Rack focus: a brief blur → sharp pull when the card is targeted. Rest state stays sharp. */
	.viewfinder:hover .media > div {
		animation: rack-focus 520ms var(--ease-lens);
	}
	@keyframes rack-focus {
		0% {
			filter: blur(0);
		}
		35% {
			filter: blur(3px);
		}
		100% {
			filter: blur(0);
		}
	}
	:global([data-motion='reduced']) .viewfinder .bracket,
	:global([data-motion='reduced']) .viewfinder:hover .media > div {
		translate: none;
		animation: none;
	}
</style>
