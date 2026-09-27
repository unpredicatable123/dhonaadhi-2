<script lang="ts">
	import { ArrowUpRight, Download, Search, SlidersHorizontal } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Tag from '$lib/components/ui/Tag.svelte';
	import SpecChip from '$lib/components/ui/SpecChip.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RangeSlider from '$lib/components/ui/RangeSlider.svelte';
	import Specimen from './Specimen.svelte';

	let loading = $state(false);
	let query = $state('');
	let sort = $state('newest');
	let poe = $state(true);
	let mp = $state<[number, number]>([4, 12]);

	function fakeLoad() {
		loading = true;
		setTimeout(() => (loading = false), 1400);
	}
</script>

<Specimen
	title="Button"
	note="Primary / secondary / ghost / icon · sm md lg · loading · disabled. All ≥ 44px tall."
>
	<div class="grid gap-5">
		<div class="flex flex-wrap items-center gap-3">
			<Button>Explore products</Button>
			<Button variant="secondary">Talk to sales</Button>
			<Button variant="ghost">Compare</Button>
			<Button variant="icon" aria-label="Filters"
				><SlidersHorizontal class="size-5" aria-hidden="true" /></Button
			>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large <ArrowUpRight class="size-4" aria-hidden="true" /></Button>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<Button {loading} onclick={fakeLoad}
				><Download class="size-4" aria-hidden="true" /> Download datasheet</Button
			>
			<Button disabled>Disabled</Button>
			<Button href="/products" variant="secondary">As a link</Button>
		</div>
	</div>
</Specimen>

<Specimen
	title="Tag & SpecChip"
	note="Tags are status; chips are data. Chip values are mono so they align."
>
	<div class="grid gap-5">
		<div class="flex flex-wrap gap-2">
			<Tag>Active</Tag>
			<Tag tone="thermal">New</Tag>
			<Tag tone="optic">SentinelAI</Tag>
			<Tag tone="info">Firmware 5.8</Tag>
			<Tag tone="danger">Discontinued</Tag>
		</div>
		<div class="flex flex-wrap gap-2">
			<SpecChip label="Resolution" value={8} unit="MP" />
			<SpecChip label="Lens" value="2.8–12" unit="mm" />
			<SpecChip label="Light" value={60} unit="m" />
			<SpecChip label="Ingress" value="IP67" />
		</div>
	</div>
</Specimen>

<Specimen
	title="Form controls"
	note="Control borders use stone-500 (≥ 3:1). Errors are text, never colour alone."
>
	<div class="grid max-w-xl gap-6">
		<Input label="Search models" placeholder="e.g. NX-4K-D72" bind:value={query}>
			{#snippet leading()}<Search class="size-4" />{/snippet}
		</Input>
		<Input
			label="Work email"
			type="email"
			value="ops@"
			error="Enter a full email address, like name@company.com."
		/>
		<Select
			label="Sort by"
			bind:value={sort}
			options={[
				{ value: 'newest', label: 'Newest' },
				{ value: 'resolution', label: 'Resolution' },
				{ value: 'name', label: 'Name' }
			]}
		/>
		<div>
			<Checkbox label="PoE powered" count={24} bind:checked={poe} />
			<Checkbox label="Two-way audio" count={11} />
			<Checkbox label="Explosion-proof" count={0} disabled />
		</div>
		<RangeSlider label="Resolution" min={2} max={32} unit=" MP" bind:value={mp} />
	</div>
</Specimen>
