<script lang="ts">
	import '../app.css';
	import Toaster from '$lib/components/ui/Toaster.svelte';
	import Shutter, { type ShutterApi } from '$lib/motion/Shutter.svelte';
	import { setupPageTransitions } from '$lib/motion/transitions';
	import { startLenis, stopLenis } from '$lib/motion/lenis';
	import { motion } from '$lib/stores/motion.svelte';

	let { data, children } = $props();
	let shutter: { api: ShutterApi } | undefined = $state();

	setupPageTransitions(() => shutter?.api);

	$effect(() => motion.init(data.motionPref));

	// Reduced motion: attribute for CSS + no smooth scroll.
	$effect(() => {
		document.documentElement.dataset.motion = motion.reduced ? 'reduced' : 'full';
		if (motion.reduced) stopLenis();
		else startLenis();
	});
</script>

<a
	href="#main"
	class="fixed top-3 left-3 z-[100] -translate-y-24 rounded-control bg-accent-fill px-4 py-3 font-medium text-on-accent focus:translate-y-0"
	>Skip to content</a
>
<main id="main" tabindex="-1" class="outline-none">
	{@render children()}
</main>
<Toaster />
<Shutter bind:this={shutter} />
<div class="grain" aria-hidden="true"></div>
