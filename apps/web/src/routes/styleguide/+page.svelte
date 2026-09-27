<script lang="ts">
	import Foundations from './Foundations.svelte';
	import Controls from './Controls.svelte';
	import Patterns from './Patterns.svelte';
	import Cards from './Cards.svelte';
</script>

<svelte:head>
	<title>Styleguide</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container-site pt-32 pb-24">
	<header class="grid max-w-3xl gap-4 pb-12">
		<p class="eyebrow">Dev only</p>
		<h1 class="text-h1">Component library</h1>
		<p class="text-body-lg text-fg-muted">
			Every primitive in <code class="font-mono text-sm">src/lib/components</code> with its states. Tab
			through the page to check focus rings; toggle reduced motion in the footer.
		</p>
	</header>
	<Foundations />
	<Controls />
	<Patterns />
	<Cards />
</div>
