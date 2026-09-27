<script lang="ts">
	import { cn } from '$lib/utils/cn';

	/** A single key spec, e.g. label="Resolution" value="8" unit="MP". Value is mono so columns align. */
	let {
		label,
		value,
		unit,
		class: className
	}: { label: string; value: string | number; unit?: string; class?: string } = $props();
</script>

<span class={cn('inline-flex flex-col rounded-chip bg-surface px-2.5 py-1.5 hairline', className)}>
	<span class="text-[0.6875rem] leading-tight text-fg-muted">{label}</span>
	<span class="font-mono text-[0.8125rem] leading-tight font-medium text-fg"
		>{value}{#if unit}<span class="ml-0.5 text-fg-muted">{unit}</span>{/if}</span
	>
</span>
