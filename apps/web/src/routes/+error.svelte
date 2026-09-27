<script lang="ts">
	import { page } from '$app/state';
	import { Search } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { palette } from '$lib/components/shell/palette.svelte';

	const notFound = $derived(page.status === 404);
	const company = $derived(page.data.settings?.companyName);
</script>

<svelte:head>
	<title
		>{notFound ? 'Page not found' : 'Something went wrong'}{company ? ` · ${company}` : ''}</title
	>
	<meta name="robots" content="noindex" />
</svelte:head>

<section
	class="relative isolate grid min-h-[88svh] place-items-center overflow-hidden pt-(--header-h)"
>
	<div class="container-site grid justify-items-center gap-6 text-center">
		<p
			class="code font-display text-[clamp(7rem,22vw,16rem)] leading-none font-semibold text-fg/90 select-none"
			aria-hidden="true"
		>
			{page.status}
		</p>
		<h1 class="text-h2">{notFound ? 'Out of frame' : 'Signal lost'}</h1>
		<p class="max-w-[48ch] text-body-lg text-fg-muted">
			{#if notFound}
				This page isn’t in view. It may have moved, or the link may be mistyped. Search for a model
				or go back to the catalogue.
			{:else}
				{page.error?.message ?? 'The page could not be loaded.'} Try again in a moment.
			{/if}
		</p>
		<div class="flex flex-wrap justify-center gap-3">
			<Button href="/products">Browse products</Button>
			<Button variant="secondary" onclick={() => palette.show()}
				><Search class="size-4" aria-hidden="true" /> Search models</Button
			>
		</div>
	</div>
</section>

<style>
	/* The number racks into focus once. */
	.code {
		animation: focus-pull 1.4s var(--ease-lens) both;
	}
	@keyframes focus-pull {
		from {
			filter: blur(18px);
			opacity: 0.2;
			letter-spacing: 0.08em;
		}
	}
	:global([data-motion='reduced']) .code {
		animation: none;
	}
</style>
