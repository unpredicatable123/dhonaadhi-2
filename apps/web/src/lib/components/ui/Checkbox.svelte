<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	type Props = Omit<HTMLInputAttributes, 'type' | 'class'> & {
		label: string;
		count?: number;
		checked?: boolean;
		class?: string;
	};

	let {
		label,
		count,
		checked = $bindable(false),
		class: className,
		id: idProp,
		...rest
	}: Props = $props();
	const autoId = $props.id();
	const id = $derived(idProp ?? autoId);
</script>

<label
	for={id}
	class={cn(
		'group flex min-h-11 cursor-pointer items-center gap-3 text-sm text-fg has-disabled:cursor-not-allowed has-disabled:opacity-50',
		className
	)}
>
	<span class="relative grid size-5 shrink-0 place-items-center">
		<input
			{id}
			type="checkbox"
			bind:checked
			class="peer size-5 appearance-none rounded-chip border border-control bg-surface transition-colors duration-(--dur-fast) group-hover:border-accent checked:border-accent-fill checked:bg-accent-fill"
			{...rest}
		/>
		<svg
			viewBox="0 0 16 16"
			class="pointer-events-none absolute size-3.5 text-on-accent opacity-0 peer-checked:opacity-100"
			aria-hidden="true"
		>
			<path
				d="M3 8.5 6.5 12 13 4.5"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</span>
	<span class="flex-1">{label}</span>
	{#if count !== undefined}
		<span class="font-mono text-mono-sm text-fg-muted tabular-nums">{count}</span>
	{/if}
</label>
