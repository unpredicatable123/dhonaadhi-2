<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	/** Wraps one focusable trigger. Shows on hover and keyboard focus; Esc dismisses (WCAG 1.4.13). */
	type Props = {
		text: string;
		side?: 'top' | 'bottom';
		children: Snippet<[{ 'aria-describedby': string }]>;
	};

	let { text, side = 'top', children }: Props = $props();
	const id = $props.id();
	let dismissed = $state(false);
</script>

<span
	class="group/tip relative inline-flex"
	role="presentation"
	onkeydown={(e) => {
		if (e.key === 'Escape') dismissed = true;
	}}
	onpointerleave={() => (dismissed = false)}
	onfocusout={() => (dismissed = false)}
>
	{@render children({ 'aria-describedby': id })}
	<span
		{id}
		role="tooltip"
		class={cn(
			'pointer-events-none absolute left-1/2 z-50 w-max max-w-60 -translate-x-1/2 rounded-chip bg-mist-100 px-2.5 py-1.5 text-caption text-ink-950 opacity-0 shadow-lg transition-opacity duration-(--dur-fast)',
			side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
			!dismissed && 'group-focus-within/tip:opacity-100 group-hover/tip:opacity-100'
		)}
	>
		{text}
	</span>
</span>
