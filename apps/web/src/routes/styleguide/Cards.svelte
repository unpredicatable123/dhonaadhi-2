<script lang="ts">
	import { Cctv, Moon } from '@lucide/svelte';
	import ViewfinderCard from '$lib/components/cards/ViewfinderCard.svelte';
	import LensCard from '$lib/components/cards/LensCard.svelte';
	import TechCard from '$lib/components/cards/TechCard.svelte';
	import StatCard from '$lib/components/cards/StatCard.svelte';
	import Specimen from './Specimen.svelte';

	let compared = $state(false);
	const specs = [
		{ label: 'Resolution', value: 8, unit: 'MP' },
		{ label: 'Lens', value: '2.8', unit: 'mm' },
		{ label: 'Light', value: 40, unit: 'm' }
	];
	const img = '/renders/styleguide-bullet.webp';
</script>

<Specimen title="Cards" note="Viewfinder (product), Lens (category), Technology, Stat.">
	<div class="grid gap-6">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<ViewfinderCard
				href="#viewfinder"
				modelNumber="NB-8M-B28L"
				name="8 MP LumaNight fixed bullet camera"
				{specs}
				status="new"
				compare={{ checked: compared, onchange: (c) => (compared = c) }}
			>
				{#snippet media()}<img
						src={img}
						alt=""
						class="h-full w-full object-cover"
						loading="lazy"
					/>{/snippet}
			</ViewfinderCard>
			<ViewfinderCard
				href="#viewfinder"
				modelNumber="ND-4M-T40"
				name="4 MP turret camera with two-way audio"
				{specs}
				compare={{ checked: false, onchange: () => {} }}
			>
				{#snippet media()}<img
						src={img}
						alt=""
						class="h-full w-full object-cover"
						loading="lazy"
					/>{/snippet}
			</ViewfinderCard>
			<ViewfinderCard
				href="#viewfinder"
				modelNumber="NP-2M-P25X"
				name="2 MP 25× PTZ dome"
				{specs}
				status="discontinued"
			>
				{#snippet media()}<img
						src={img}
						alt=""
						class="h-full w-full object-cover"
						loading="lazy"
					/>{/snippet}
			</ViewfinderCard>
		</div>
		<ViewfinderCard
			layout="list"
			href="#viewfinder"
			modelNumber="NB-8M-B28L"
			name="8 MP LumaNight fixed bullet camera (list layout)"
			{specs}
			compare={{ checked: compared, onchange: (c) => (compared = c) }}
		>
			{#snippet media()}<img
					src={img}
					alt=""
					class="h-full w-full object-cover"
					loading="lazy"
				/>{/snippet}
		</ViewfinderCard>
		<div class="grid gap-4 md:grid-cols-2">
			<LensCard
				href="#lens"
				title="Network cameras"
				description="Bullet, dome, turret and fisheye cameras from 2 to 12 MP."
				count={18}
			>
				{#snippet media()}<img
						src="/renders/styleguide-scene.webp"
						alt=""
						class="h-full w-full object-cover"
						loading="lazy"
					/>{/snippet}
				{#snippet icon()}<Cctv class="size-8" strokeWidth={1.25} />{/snippet}
			</LensCard>
			<div class="grid gap-4">
				<TechCard
					title="LumaNight"
					summary="Full colour at 0.0005 lux with a large-aperture lens and a back-illuminated sensor."
				>
					{#snippet icon()}<Moon class="size-6" strokeWidth={1.5} />{/snippet}
				</TechCard>
				<StatCard
					value={2840}
					label="R&D engineers across four labs"
					trend={[3, 4, 4, 6, 7, 9, 11, 14]}
				/>
			</div>
		</div>
	</div>
</Specimen>
