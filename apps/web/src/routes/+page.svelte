<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import HeroAperture from '$lib/components/scenes/hero/HeroAperture.svelte';
	import TrustBand from '$lib/components/scenes/TrustBand.svelte';
	import CategoryRail from '$lib/components/scenes/rail/CategoryRail.svelte';
	import DuskToNight from '$lib/components/scenes/dusk/DuskToNight.svelte';

	let { data } = $props();
	const sections = $derived(data.home.sections ?? []);
</script>

<Seo title={data.home.seo?.title} description={data.home.seo?.description} />

<!-- Page builder: order and content come from the homePage document in Sanity. -->
{#each sections as s (s._key)}
	{#if s._type === 'heroAperture'}<HeroAperture section={s} />
	{:else if s._type === 'logoCloud'}<TrustBand section={s} />
	{:else if s._type === 'categoryRail'}<CategoryRail section={s} />
	{:else if s._type === 'duskToNight'}<DuskToNight section={s} />
	{/if}
{/each}
