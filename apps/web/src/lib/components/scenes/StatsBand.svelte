<script lang="ts">
	import StatCard from '$lib/components/cards/StatCard.svelte';
	import type { Section } from './types';

	let { section }: { section: Section<'statsBand'> } = $props();
</script>

<section
	aria-labelledby="stats-title"
	id={section.anchor ?? undefined}
	class="relative overflow-hidden py-28"
>
	<div
		class="absolute top-1/2 left-1/4 -z-10 size-[50rem] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-thermal-400)_7%,transparent),transparent)]"
		aria-hidden="true"
	></div>
	<div class="container-site grid gap-14">
		<div class="grid max-w-[40rem] gap-4">
			<h2 id="stats-title" class="text-h2">{section.title}</h2>
			{#if section.lead}<p class="text-body-lg text-fg-muted">{section.lead}</p>{/if}
		</div>
		<div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
			{#each section.stats ?? [] as s (s._key)}
				<StatCard
					value={s.value ?? 0}
					suffix={s.suffix ?? ''}
					label={s.label ?? ''}
					trend={s.trend ?? []}
				/>
			{/each}
		</div>
	</div>
</section>
