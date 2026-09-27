<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Plus } from '@lucide/svelte';
	import { cn } from '$lib/utils/cn';

	type Props = {
		title: string;
		open?: boolean;
		/** Heading level keeps the document outline correct wherever the accordion is placed. */
		level?: 2 | 3 | 4;
		meta?: string;
		children: Snippet;
		class?: string;
	};

	let {
		title,
		open = $bindable(false),
		level = 3,
		meta,
		children,
		class: className
	}: Props = $props();
	const id = $props.id();
</script>

<div class={cn('border-b border-line', className)}>
	<svelte:element this={`h${level}`} class="font-sans text-base font-medium">
		<button
			type="button"
			id="{id}-btn"
			aria-expanded={open}
			aria-controls="{id}-region"
			onclick={() => (open = !open)}
			class="flex min-h-14 w-full items-center gap-4 py-3 text-left transition-colors hover:text-accent"
		>
			<span class="flex-1">{title}</span>
			{#if meta}<span class="font-mono text-mono-sm text-fg-muted">{meta}</span>{/if}
			<Plus
				class={cn(
					'size-4 shrink-0 transition-transform duration-(--dur-base) ease-lens',
					open && 'rotate-45'
				)}
				aria-hidden="true"
			/>
		</button>
	</svelte:element>
	<div
		id="{id}-region"
		role="region"
		aria-labelledby="{id}-btn"
		class={cn(
			'grid transition-[grid-template-rows] duration-(--dur-base) ease-lens print:grid-rows-[1fr]',
			open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
		)}
		inert={!open}
	>
		<div class="overflow-hidden">
			<div class="pb-5">{@render children()}</div>
		</div>
	</div>
</div>
