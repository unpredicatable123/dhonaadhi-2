<script lang="ts">
	import { Info } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import Accordion from '$lib/components/ui/Accordion.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import { toast } from '$lib/components/ui/toast.svelte';
	import Specimen from './Specimen.svelte';

	let modal = $state(false);
	let drawer = $state(false);
	let page = $state(3);
</script>

<Specimen title="SectionHeader">
	<SectionHeader
		eyebrow="Network cameras · 18 models"
		title="See colour where others see grain"
		lead="LumaNight sensors keep full colour down to 0.0005 lux, so night footage stays usable as evidence."
	>
		{#snippet actions()}<Button variant="secondary" size="sm">View all</Button>{/snippet}
	</SectionHeader>
</Specimen>

<Specimen title="Tabs" note="Arrow keys, Home and End move between tabs.">
	<Tabs
		label="Product information"
		tabs={[
			{ id: 'overview', label: 'Overview' },
			{ id: 'specs', label: 'Specifications' },
			{ id: 'downloads', label: 'Downloads' }
		]}
	>
		{#snippet panel(id)}<p class="text-fg-muted">Panel content for “{id}”.</p>{/snippet}
	</Tabs>
</Specimen>

<Specimen title="Accordion">
	<div>
		<Accordion title="Camera" meta="6 rows" open>
			<p class="text-fg-muted">1/1.8″ progressive-scan CMOS · 3840 × 2160</p>
		</Accordion>
		<Accordion title="Lens" meta="4 rows"
			><p class="text-fg-muted">2.8–12 mm motorised varifocal</p></Accordion
		>
	</div>
</Specimen>

<Specimen title="Tooltip, Dialog, Toast">
	<div class="flex flex-wrap items-center gap-3">
		<Tooltip text="Detect / Observe / Recognise / Identify distances">
			{#snippet children(a)}
				<button
					type="button"
					class="grid tap place-items-center rounded-control hover:bg-raised"
					{...a}
				>
					<Info class="size-5" aria-hidden="true" /><span class="sr-only">What is DORI?</span>
				</button>
			{/snippet}
		</Tooltip>
		<Button variant="secondary" onclick={() => (modal = true)}>Open modal</Button>
		<Button variant="secondary" onclick={() => (drawer = true)}>Open drawer</Button>
		<Button variant="ghost" onclick={() => toast.show('Added NX-4K-D72 to compare', 'success')}
			>Show toast</Button
		>
	</div>
	<Dialog bind:open={modal} title="Download datasheet">
		<p class="text-fg-muted">
			Focus is trapped here; Esc or the backdrop closes it and focus returns.
		</p>
	</Dialog>
	<Dialog bind:open={drawer} title="Filters" placement="right">
		<p class="text-fg-muted">Drawer placement used for filters on mobile.</p>
		{#snippet footer()}<Button class="w-full" onclick={() => (drawer = false)}
				>Show 24 results</Button
			>{/snippet}
	</Dialog>
</Specimen>

<Specimen title="Breadcrumbs & Pagination">
	<div class="grid gap-8">
		<Breadcrumbs
			items={[
				{ label: 'Products', href: '/products' },
				{ label: 'Network cameras', href: '/products/network-cameras' },
				{ label: 'Bullet cameras', href: '/products/network-cameras/bullet' }
			]}
		/>
		<Pagination
			{page}
			pages={9}
			href={(p) => `?page=${p}`}
			onloadmore={() => (page += 1)}
			remaining={96}
		/>
	</div>
</Specimen>

<Specimen title="Skeleton">
	<div class="grid max-w-sm gap-3">
		<Skeleton class="aspect-4/3" />
		<Skeleton class="h-5 w-2/3" />
		<Skeleton class="h-4 w-1/3" />
	</div>
</Specimen>
