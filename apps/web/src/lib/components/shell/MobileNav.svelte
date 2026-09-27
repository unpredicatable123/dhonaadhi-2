<script lang="ts">
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CategoryIcon from '$lib/components/icons/CategoryIcon.svelte';
	import { paths, resolveLink } from '$lib/links';
	import type { CategoryTree, Navigation } from '$lib/sanity/types';

	let {
		open = $bindable(false),
		brandName,
		navigation,
		categories
	}: {
		open?: boolean;
		brandName: string;
		navigation: Navigation | null;
		categories: CategoryTree;
	} = $props();
</script>

<Dialog bind:open title="{brandName} menu" hideTitle placement="full" class="bg-bg">
	<nav aria-label="Mobile" class="stagger grid gap-2 pb-8">
		{#each navigation?.items ?? [] as item, i (item._key)}
			<div style:--i={i}>
				{#if item.mega === 'catalogue'}
					<Accordion title={item.link?.label ?? 'Products'} level={2} open>
						<ul class="grid gap-0.5">
							{#each categories as c (c._id)}
								<li>
									<a
										href={paths.category(c.slug ?? '')}
										class="flex min-h-12 items-center gap-3 rounded-control px-2 hover:bg-raised"
									>
										<CategoryIcon name={c.icon ?? ''} class="size-5 text-accent" />
										<span class="flex-1">{c.title}</span>
										<span class="font-mono text-mono-sm text-fg-muted">{c.count}</span>
									</a>
								</li>
							{/each}
							<li>
								<a
									href={paths.products()}
									class="flex min-h-12 items-center px-2 font-medium text-accent">All products</a
								>
							</li>
						</ul>
					</Accordion>
				{:else}
					<a
						href={resolveLink(item.link)}
						class="flex min-h-14 items-center border-b border-line font-display text-2xl font-medium"
					>
						{item.link?.label}
					</a>
				{/if}
			</div>
		{/each}
		<div class="mt-4 flex flex-wrap gap-x-5" style:--i={(navigation?.items?.length ?? 0) + 1}>
			{#each navigation?.utility ?? [] as l (l._key)}
				<a href={resolveLink(l)} class="flex min-h-11 items-center text-fg-muted">{l.label}</a>
			{/each}
		</div>
		{#if navigation?.cta}
			<div style:--i={(navigation?.items?.length ?? 0) + 2}>
				<Button href={resolveLink(navigation.cta)} class="mt-4 w-full"
					>{navigation.cta.label}</Button
				>
			</div>
		{/if}
	</nav>
</Dialog>

<style>
	.stagger > div {
		animation: rise var(--dur-slow) var(--ease-lens) both;
		animation-delay: calc(var(--i) * 50ms + 80ms);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
	}
	:global([data-motion='reduced']) .stagger > div {
		animation: none;
	}
</style>
