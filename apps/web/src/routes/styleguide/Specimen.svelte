<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, note, children }: { title: string; note?: string; children: Snippet } = $props();
	const id = $props.id();
</script>

<section
	aria-labelledby={id}
	class="grid gap-6 border-t border-line py-12 md:grid-cols-[14rem_1fr]"
>
	<div>
		<h2 {id} class="font-display text-h3">{title}</h2>
		{#if note}<p class="mt-2 text-caption text-fg-muted">{note}</p>{/if}
	</div>
	<div class="min-w-0">{@render children()}</div>
</section>
