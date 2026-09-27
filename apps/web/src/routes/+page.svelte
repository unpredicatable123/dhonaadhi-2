<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import HeroAperture from '$lib/components/scenes/hero/HeroAperture.svelte';

	let { data } = $props();
	const sections = $derived(data.home.sections ?? []);
</script>

<Seo title={data.home.seo?.title} description={data.home.seo?.description} />

<!-- Page builder: order and content come from the homePage document in Sanity. -->
{#each sections as s (s._key)}
	{#if s._type === 'heroAperture'}<HeroAperture section={s} />
	{/if}
{/each}
