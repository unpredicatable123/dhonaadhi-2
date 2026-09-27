<script lang="ts" module>
	import type { VariantProps } from 'tailwind-variants';
	import { tv } from '$lib/utils/cn';

	export const button = tv({
		base: [
			'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium',
			'rounded-control transition-[background-color,color,border-color,transform] duration-(--dur-fast) ease-(--ease-lens)',
			'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
			'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
			'active:scale-[0.98]'
		],
		variants: {
			variant: {
				primary: 'bg-btn text-on-btn hover:bg-btn-hover',
				secondary:
					'border border-control bg-transparent text-fg hover:border-accent hover:text-accent',
				ghost: 'bg-transparent text-fg hover:bg-raised',
				icon: 'bg-transparent text-fg hover:bg-raised'
			},
			size: {
				sm: 'h-11 px-4 text-sm',
				md: 'h-12 px-5 text-[0.9375rem]',
				lg: 'h-14 px-7 text-base'
			}
		},
		compoundVariants: [{ variant: 'icon', class: 'aspect-square px-0' }],
		defaultVariants: { variant: 'primary', size: 'md' }
	});

	export type ButtonVariants = VariantProps<typeof button>;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Common = ButtonVariants & { children: Snippet; loading?: boolean; class?: string };
	type Props = Common &
		(
			| ({ href: string } & Omit<HTMLAnchorAttributes, 'class' | 'children'>)
			| ({ href?: undefined } & Omit<HTMLButtonAttributes, 'class' | 'children'>)
		);

	let {
		variant,
		size,
		loading = false,
		class: className,
		children,
		href,
		...rest
	}: Props = $props();

	const classes = $derived(button({ variant, size, class: className }));
</script>

{#if href !== undefined}
	<a {href} class={classes} {...rest as HTMLAnchorAttributes}>{@render children()}</a>
{:else}
	<button
		type="button"
		class={classes}
		aria-busy={loading || undefined}
		{...rest as HTMLButtonAttributes}
		disabled={(rest as HTMLButtonAttributes).disabled || loading}
	>
		{#if loading}
			<span class="absolute inset-0 grid place-items-center" aria-hidden="true">
				<svg viewBox="0 0 24 24" class="h-5 w-5 animate-spin-slow">
					<circle
						cx="12"
						cy="12"
						r="9"
						fill="none"
						stroke="currentColor"
						stroke-opacity=".25"
						stroke-width="2"
					/>
					<path
						d="M21 12a9 9 0 0 0-9-9"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</span>
			<span class="invisible contents">{@render children()}</span>
			<span class="sr-only">Loading</span>
		{:else}
			{@render children()}
		{/if}
	</button>
{/if}
