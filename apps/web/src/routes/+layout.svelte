<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/shell/Header.svelte';
	import Footer from '$lib/components/shell/Footer.svelte';
	import CommandPalette from '$lib/components/shell/CommandPalette.svelte';
	import CompareTray from '$lib/components/products/CompareTray.svelte';
	import Toaster from '$lib/components/ui/Toaster.svelte';
	import Shutter, { type ShutterApi } from '$lib/motion/Shutter.svelte';
	import { setupPageTransitions } from '$lib/motion/transitions';
	import { startLenis, stopLenis } from '$lib/motion/lenis';
	import { motion } from '$lib/stores/motion.svelte';
	import { page } from '$app/state';
	import { themeFor } from '$lib/theme';

	let { data, children } = $props();
	let shutter: { api: ShutterApi } | undefined = $state();

	const smooth = $derived(data.settings.motion?.smoothScroll !== false);
	const transitions = $derived(data.settings.motion?.pageTransitions !== false);

	setupPageTransitions(() => (transitions ? shutter?.api : undefined));

	$effect(() => motion.init(data.motionPref));

	// Mixed theme: light catalogue, dark cinematic pages.
	$effect(() => {
		const theme = themeFor(page.url.pathname);
		document.documentElement.dataset.theme = theme;
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', theme === 'light' ? '#f6f8fb' : '#07090d');
	});

	// Reduced motion: attribute for CSS + no smooth scroll.
	$effect(() => {
		document.documentElement.dataset.motion = motion.reduced ? 'reduced' : 'full';
		if (motion.reduced || !smooth) stopLenis();
		else startLenis();
	});
</script>

<a
	href="#main"
	class="fixed top-3 left-3 z-[100] -translate-y-24 rounded-control bg-accent-fill px-4 py-3 font-medium text-on-accent focus:translate-y-0"
	>Skip to content</a
>
<Header
	brandName={data.settings.brandName ?? ''}
	navigation={data.navigation}
	categories={data.categories}
/>
<main id="main" tabindex="-1" class="outline-none">
	{@render children()}
</main>
<Footer settings={data.settings} footer={data.footer} />
<CommandPalette categories={data.categories} />
<CompareTray />
<Toaster />
<Shutter bind:this={shutter} />
{#if data.settings.motion?.grain !== false}<div class="grain" aria-hidden="true"></div>{/if}
<!-- Loaded only in preview: keeps the editor overlay (and its React runtime) out of the public bundle. -->
{#if data.preview}
	{#await import('@sanity/visual-editing/svelte') then { VisualEditing }}<VisualEditing />{/await}
{/if}
