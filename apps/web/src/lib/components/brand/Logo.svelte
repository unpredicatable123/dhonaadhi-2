<script lang="ts">
	import { monogram, wordmark } from './paths';
	import { cn } from '$lib/utils/cn';

	type Props = {
		/** Accessible name — pass siteSettings.brandName. Empty = decorative. */
		label: string;
		variant?: 'lockup' | 'monogram';
		class?: string;
		/** Rotates the iris blades closed → open once on mount (loader / hero). */
		animated?: boolean;
	};

	let { label, variant = 'lockup', class: className, animated = false }: Props = $props();
</script>

{#snippet mark()}
	<path fill="currentColor" fill-rule="evenodd" d={monogram.outer} />
	<g class={cn('iris', animated && 'iris-animated')}>
		<path fill="var(--accent)" fill-rule="evenodd" d={monogram.iris} />
		<path
			stroke="var(--bg)"
			stroke-width=".7"
			stroke-linecap="round"
			fill="none"
			d={monogram.seams}
		/>
	</g>
{/snippet}

{#if variant === 'monogram'}
	<svg
		viewBox="0 0 32 32"
		role={label ? 'img' : undefined}
		aria-label={label || undefined}
		aria-hidden={label ? undefined : true}
		class={cn('h-8 w-8', className)}
	>
		{@render mark()}
	</svg>
{:else}
	<svg
		viewBox={wordmark.viewBox}
		role={label ? 'img' : undefined}
		aria-label={label || undefined}
		aria-hidden={label ? undefined : true}
		class={cn('h-6 w-auto', className)}
	>
		<g
			transform="translate({wordmark.monogramX} {wordmark.monogramY}) scale({wordmark.monogramScale})"
		>
			{@render mark()}
		</g>
		<path fill="currentColor" transform="translate({wordmark.offsetX} 0)" d={wordmark.d} />
	</svg>
{/if}

<style>
	.iris {
		transform-box: fill-box;
		transform-origin: center;
	}
	.iris-animated {
		animation: iris-open var(--dur-scene) var(--ease-shutter) both;
	}
	@keyframes iris-open {
		from {
			transform: rotate(-120deg) scale(0.6);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
</style>
