<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import type { Section } from './types';

	let { section }: { section: Section<'richTextSection'> } = $props();
</script>

<section aria-labelledby="rt-{section._key}" id={section.anchor ?? undefined} class="py-24">
	<div class="container-site grid gap-8 md:grid-cols-12">
		<h2 id="rt-{section._key}" class="text-h2 md:col-span-4">{section.title}</h2>
		<div
			class="prose-dh grid max-w-[68ch] gap-4 text-body-lg text-fg/85 md:col-span-7 md:col-start-6"
		>
			<PortableText value={section.body ?? []} />
		</div>
	</div>
</section>

<style>
	.prose-dh :global(h3) {
		font-size: var(--text-h3);
		margin-top: 1rem;
	}
	.prose-dh :global(blockquote) {
		border-left: 2px solid var(--color-optic-400);
		padding-left: 1rem;
		color: var(--fg);
	}
	.prose-dh :global(a) {
		color: var(--link);
		text-decoration: underline;
	}
</style>
