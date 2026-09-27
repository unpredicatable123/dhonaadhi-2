<script lang="ts">
	import '../app.css';
	import Toaster from '$lib/components/ui/Toaster.svelte';
	import { motion } from '$lib/stores/motion.svelte';

	let { data, children } = $props();

	$effect(() => motion.init(data.motionPref));
	$effect(() => {
		document.documentElement.dataset.motion = motion.reduced ? 'reduced' : 'full';
	});
</script>

<a
	href="#main"
	class="fixed top-3 left-3 z-[100] -translate-y-24 rounded-control bg-accent-fill px-4 py-3 font-medium text-on-accent focus:translate-y-0"
	>Skip to content</a
>
<main id="main" tabindex="-1">
	{@render children()}
</main>
<Toaster />
<div class="grain" aria-hidden="true"></div>
