<script lang="ts">
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { X, ArrowRight } from '@lucide/svelte';
	import { compare, COMPARE_MAX } from '$lib/stores/compare.svelte';
	import { motion } from '$lib/stores/motion.svelte';
	import { paths } from '$lib/links';

	/** Slides up from the bottom once something is selected; hidden on the compare page itself. */
	const visible = $derived(
		compare.items.length > 0 && !page.url.pathname.startsWith('/products/compare')
	);
	const empty = $derived(Math.max(0, COMPARE_MAX - compare.items.length));
</script>

{#if visible}
	<aside
		transition:fly={{
			y: motion.reduced ? 0 : 120,
			duration: motion.reduced ? 120 : 420,
			opacity: motion.reduced ? 0 : 1
		}}
		class="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-panel border border-line bg-ink-900/95 p-3 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)] backdrop-blur-xl print:hidden"
		aria-label="Compare selection"
	>
		<div class="flex items-center gap-3">
			<ul class="flex flex-1 gap-2 overflow-x-auto" data-compare-target>
				{#each compare.items as item (item.slug)}
					<li
						class="group relative shrink-0"
						transition:fly={{ y: 16, duration: motion.reduced ? 0 : 260 }}
					>
						<a
							href={item.href}
							class="block h-14 w-18 overflow-hidden rounded-control bg-ink-800 hairline"
							title="{item.modelNumber} {item.name}"
						>
							{#if item.image}<img
									src={item.image}
									alt=""
									class="h-full w-full object-cover"
									width="72"
									height="56"
								/>{/if}
							<span class="sr-only">{item.modelNumber}</span>
						</a>
						<button
							type="button"
							onclick={() => compare.remove(item.slug)}
							class="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full border border-line bg-ink-950 text-fg-muted hover:text-fg"
						>
							<X class="size-3.5" aria-hidden="true" /><span class="sr-only"
								>Remove {item.modelNumber} from compare</span
							>
						</button>
						<span
							class="mt-1 block max-w-18 truncate font-mono text-[0.625rem] text-fg-muted"
							aria-hidden="true">{item.modelNumber}</span
						>
					</li>
				{/each}
				{#each { length: empty } as _, i (i)}
					<li
						class="hidden h-14 w-18 shrink-0 rounded-control border border-dashed border-line sm:block"
						aria-hidden="true"
					></li>
				{/each}
			</ul>
			<div class="flex shrink-0 flex-col items-stretch gap-1.5 sm:flex-row sm:items-center">
				<a
					href={paths.compare(compare.slugs)}
					aria-disabled={compare.items.length < 2}
					class="flex h-11 items-center justify-center gap-2 rounded-control bg-accent-fill px-4 text-sm font-medium text-on-accent hover:bg-accent-hover aria-disabled:pointer-events-none aria-disabled:opacity-50"
				>
					Compare {compare.items.length}<ArrowRight class="size-4" aria-hidden="true" />
				</a>
				<button
					type="button"
					onclick={() => compare.clear()}
					class="h-9 px-2 text-caption text-fg-muted hover:text-fg">Clear</button
				>
			</div>
		</div>
		{#if compare.items.length < 2}<p class="mt-2 text-caption text-fg-muted" aria-live="polite">
				Add at least one more product to compare.
			</p>{/if}
	</aside>
{/if}
