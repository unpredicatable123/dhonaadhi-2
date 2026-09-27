<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '$lib/utils/cn';

	export const tag = tv({
		base: 'inline-flex h-6 items-center gap-1.5 rounded-chip px-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em]',
		variants: {
			tone: {
				neutral: 'hairline bg-surface text-fg-muted',
				optic: 'border border-accent/40 bg-accent/10 text-accent',
				thermal: 'bg-thermal-400 text-ink',
				info: 'border border-link/40 bg-link/10 text-link',
				danger: 'border border-danger/40 bg-danger/10 text-danger'
			}
		},
		defaultVariants: { tone: 'neutral' }
	});
	export type TagTone = NonNullable<VariantProps<typeof tag>['tone']>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tone,
		class: className,
		children
	}: { tone?: TagTone; class?: string; children: Snippet } = $props();
</script>

<span class={tag({ tone, class: className })}>{@render children()}</span>
