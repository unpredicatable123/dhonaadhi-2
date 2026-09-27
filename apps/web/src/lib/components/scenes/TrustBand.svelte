<script lang="ts">
	import SanityImage from '$lib/components/media/SanityImage.svelte';
	import type { Section } from './types';

	/** Certifications and standards. Text wordmarks unless a logo is uploaded. */
	let { section }: { section: Section<'logoCloud'> } = $props();
</script>

<section
	class="border-y border-line bg-surface py-10"
	aria-labelledby="trust-title"
	id={section.anchor ?? undefined}
>
	<div class="container-site grid items-center gap-8 lg:grid-cols-[16rem_1fr]">
		<h2
			id="trust-title"
			class="max-w-[22ch] font-sans text-sm leading-snug font-medium text-fg-muted"
		>
			{section.title}
		</h2>
		<ul
			class="grid grid-cols-2 gap-px overflow-hidden rounded-control bg-line sm:grid-cols-3 lg:grid-cols-6"
		>
			{#each section.items ?? [] as item (item._key)}
				<li class="grid min-h-20 content-center gap-0.5 bg-surface px-4 py-3">
					{#if item.logo?.asset}
						<SanityImage
							image={item.logo}
							sizes="160px"
							class="h-8 w-auto bg-transparent"
							imgClass="object-contain object-left"
						/>
					{:else}
						<span class="font-display text-lg font-medium tracking-tight text-fg">{item.name}</span>
					{/if}
					{#if item.detail}<span class="text-caption text-fg-muted">{item.detail}</span>{/if}
				</li>
			{/each}
		</ul>
	</div>
</section>
