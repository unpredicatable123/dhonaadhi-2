<script lang="ts">
	import { SLOTS } from './sequence';

	type Callout = {
		_key: string;
		frame: number | null;
		title: string | null;
		body: string | null;
		x: number | null;
		y: number | null;
	};

	/**
	 * Each callout: a dot on its part, a leader line to a card in a fixed corner slot.
	 * Cards are real text (an ordered list), so the scene has a full text equivalent.
	 */
	let {
		callouts,
		frame,
		variant = 'overlay'
	}: { callouts: Callout[]; frame: number; variant?: 'overlay' | 'list' } = $props();

	const items = $derived(
		callouts.map((c, i) => ({
			...c,
			slot: SLOTS[i % SLOTS.length],
			shown: frame >= (c.frame ?? 0)
		}))
	);
</script>

{#if variant === 'overlay'}
	<svg
		class="pointer-events-none absolute inset-0 h-full w-full"
		viewBox="0 0 100 100"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		{#each items as c (c._key)}
			<line
				x1={c.x ?? 50}
				y1={c.y ?? 50}
				x2={c.slot.x}
				y2={c.slot.y + 6}
				class="leader"
				class:shown={c.shown}
				vector-effect="non-scaling-stroke"
			/>
		{/each}
	</svg>

	<ol class="absolute inset-0 hidden md:block">
		{#each items as c (c._key)}
			<li
				class="dot absolute size-3 -translate-1/2 rounded-full"
				class:shown={c.shown}
				style:left="{c.x}%"
				style:top="{c.y}%"
				aria-hidden="true"
			></li>
			<li
				class="card absolute w-[min(17rem,24vw)] rounded-control border border-line bg-ink-950/85 p-4 backdrop-blur"
				class:shown={c.shown}
				style:left={c.slot.align === 'left' ? `${c.slot.x}%` : undefined}
				style:right={c.slot.align === 'right' ? `${100 - c.slot.x}%` : undefined}
				style:top="{c.slot.y}%"
			>
				<p class="font-sans text-sm font-medium text-fg">{c.title}</p>
				{#if c.body}<p class="mt-1 text-caption text-fg-muted">{c.body}</p>{/if}
			</li>
		{/each}
	</ol>
{:else}
	<!-- Small screens: the same callouts as a list under the frame. -->
	<ol class="mt-4 grid gap-2 md:hidden">
		{#each items as c (c._key)}
			<li
				class="rounded-control border border-line p-3 transition-opacity duration-(--dur-base)"
				class:opacity-40={!c.shown}
			>
				<p class="text-sm font-medium">{c.title}</p>
				{#if c.body}<p class="text-caption text-fg-muted">{c.body}</p>{/if}
			</li>
		{/each}
	</ol>
{/if}

<style>
	.leader {
		stroke: var(--color-optic-400);
		stroke-width: 1;
		stroke-dasharray: 4 3;
		opacity: 0;
		transition: opacity var(--dur-base) var(--ease-lens);
	}
	.dot {
		background: var(--color-optic-400);
		box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-optic-400) 25%, transparent);
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.4);
		transition:
			opacity var(--dur-base) var(--ease-lens),
			transform var(--dur-base) var(--ease-lens);
	}
	.card {
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity var(--dur-slow) var(--ease-lens),
			transform var(--dur-slow) var(--ease-lens);
	}
	.shown {
		opacity: 1;
	}
	.dot.shown {
		transform: translate(-50%, -50%) scale(1);
	}
	.card.shown {
		transform: none;
	}
</style>
