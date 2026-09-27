<script lang="ts">
	import Seo from '$lib/components/seo/Seo.svelte';
	import HeroAperture from '$lib/components/scenes/hero/HeroAperture.svelte';
	import TrustBand from '$lib/components/scenes/TrustBand.svelte';
	import CategoryRail from '$lib/components/scenes/rail/CategoryRail.svelte';
	import DuskToNight from '$lib/components/scenes/dusk/DuskToNight.svelte';
	import ExplodedView from '$lib/components/scenes/exploded/ExplodedView.svelte';
	import StatsBand from '$lib/components/scenes/StatsBand.svelte';
	import FeaturedProducts from '$lib/components/scenes/featured/FeaturedProducts.svelte';
	import IndustriesMosaic from '$lib/components/scenes/IndustriesMosaic.svelte';
	import CtaSearch from '$lib/components/scenes/CtaSearch.svelte';
	import RichTextSection from '$lib/components/scenes/RichTextSection.svelte';

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
	{:else if s._type === 'explodedView'}<ExplodedView section={s} />
	{:else if s._type === 'statsBand'}<StatsBand section={s} />
	{:else if s._type === 'featuredProducts'}<FeaturedProducts section={s} />
	{:else if s._type === 'industriesMosaic'}<IndustriesMosaic section={s} />
	{:else if s._type === 'ctaSearch'}<CtaSearch section={s} />
	{:else if s._type === 'richTextSection'}<RichTextSection section={s} />
	{/if}
{/each}
