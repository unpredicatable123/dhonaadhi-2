<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { X } from '@lucide/svelte';
	import { toast } from './toast.svelte';
	import { cn } from '$lib/utils/cn';
	import { motion } from '$lib/stores/motion.svelte';
</script>

<!-- Polite live region: announced without stealing focus. -->
<div
	class="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-center gap-2 sm:right-6 sm:left-auto sm:items-end"
	role="status"
	aria-live="polite"
>
	{#each toast.items as t (t.id)}
		<div
			animate:flip={{ duration: motion.reduced ? 0 : 240 }}
			in:fly={{ y: motion.reduced ? 0 : 16, duration: motion.reduced ? 120 : 320 }}
			out:fly={{ x: motion.reduced ? 0 : 24, duration: 180 }}
			class="pointer-events-auto flex min-h-12 max-w-sm items-center gap-3 rounded-control bg-raised py-2 pr-2 pl-4 text-sm shadow-2xl hairline"
		>
			<span
				class={cn(
					'size-2 shrink-0 rounded-full',
					t.tone === 'success' && 'bg-accent-fill',
					t.tone === 'error' && 'bg-danger',
					t.tone === 'neutral' && 'bg-steel-400'
				)}
				aria-hidden="true"
			></span>
			<p class="flex-1">{t.message}</p>
			<button
				type="button"
				class="grid tap place-items-center rounded-control text-fg-muted hover:text-fg"
				onclick={() => toast.dismiss(t.id)}
			>
				<X class="size-4" aria-hidden="true" /><span class="sr-only">Dismiss</span>
			</button>
		</div>
	{/each}
</div>
