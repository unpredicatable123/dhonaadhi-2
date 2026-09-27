<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	type Props = Omit<HTMLInputAttributes, 'class'> & {
		label: string;
		hideLabel?: boolean;
		hint?: string;
		error?: string;
		leading?: Snippet;
		class?: string;
		value?: string;
		ref?: HTMLInputElement;
	};

	let {
		label,
		hideLabel = false,
		hint,
		error,
		leading,
		class: className,
		value = $bindable(''),
		ref = $bindable(),
		id: idProp,
		...rest
	}: Props = $props();
	const autoId = $props.id();
	const id = $derived(idProp ?? autoId);

	const describedBy = $derived(error ? `${id}-err` : hint ? `${id}-hint` : undefined);
</script>

<div class={cn('grid gap-1.5', className)}>
	<label for={id} class={cn('text-caption font-medium text-fg', hideLabel && 'sr-only')}
		>{label}</label
	>
	<div
		class={cn(
			'flex h-12 items-center gap-2 rounded-control border bg-surface px-3.5 transition-colors duration-(--dur-fast)',
			'focus-within:border-accent',
			error ? 'border-danger' : 'border-control'
		)}
	>
		{#if leading}<span class="text-fg-muted" aria-hidden="true">{@render leading()}</span>{/if}
		<input
			{id}
			bind:this={ref}
			bind:value
			aria-invalid={error ? true : undefined}
			aria-describedby={describedBy}
			class="h-full min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-muted"
			{...rest}
		/>
	</div>
	{#if error}
		<p id="{id}-err" class="text-caption text-danger">{error}</p>
	{:else if hint}
		<p id="{id}-hint" class="text-caption text-fg-muted">{hint}</p>
	{/if}
</div>
