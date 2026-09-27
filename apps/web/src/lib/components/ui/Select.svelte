<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { ChevronDown } from '@lucide/svelte';
	import { cn } from '$lib/utils/cn';

	type Option = { value: string; label: string };
	type Props = Omit<HTMLSelectAttributes, 'class' | 'value'> & {
		label: string;
		hideLabel?: boolean;
		options: Option[];
		value?: string;
		class?: string;
	};

	let {
		label,
		hideLabel = false,
		options,
		value = $bindable(''),
		class: className,
		id: idProp,
		...rest
	}: Props = $props();
	const autoId = $props.id();
	const id = $derived(idProp ?? autoId);
</script>

<!-- Native select: best keyboard, screen-reader and mobile behaviour; styled to match. -->
<div class={cn('grid gap-1.5', className)}>
	<label for={id} class={cn('text-caption font-medium', hideLabel && 'sr-only')}>{label}</label>
	<div class="relative">
		<select
			{id}
			bind:value
			class="h-11 w-full appearance-none rounded-control border border-control bg-surface pr-10 pl-3.5 text-sm text-fg transition-colors duration-(--dur-fast) hover:border-accent"
			{...rest}
		>
			{#each options as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</select>
		<ChevronDown
			class="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-muted"
			aria-hidden="true"
		/>
	</div>
</div>
