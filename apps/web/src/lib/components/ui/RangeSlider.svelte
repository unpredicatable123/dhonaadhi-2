<script lang="ts">
	import { cn } from '$lib/utils/cn';

	/**
	 * Dual-thumb range built from two native range inputs (full keyboard + AT support for free).
	 * `onchange` fires on commit (pointer up / key), not on every drag frame.
	 */
	type Props = {
		label: string;
		/** Keep the label for assistive tech only (when a visible heading already names it). */
		hideLabel?: boolean;
		min: number;
		max: number;
		step?: number;
		unit?: string;
		value?: [number, number];
		onchange?: (v: [number, number]) => void;
		class?: string;
	};

	let {
		label,
		hideLabel = false,
		min,
		max,
		step = 1,
		unit = '',
		value = $bindable([min, max]),
		onchange,
		class: className
	}: Props = $props();

	const id = $props.id();
	const pct = (v: number) => ((v - min) / (max - min)) * 100;

	function setLow(v: number) {
		value = [Math.min(v, value[1]), value[1]];
	}
	function setHigh(v: number) {
		value = [value[0], Math.max(v, value[0])];
	}
	const commit = () => onchange?.(value);
</script>

<fieldset class={cn('grid gap-3', className)}>
	<legend class="mb-3 flex w-full items-baseline justify-between text-caption font-medium">
		<span class={hideLabel ? 'sr-only' : undefined}>{label}</span>
		<output for="{id}-lo {id}-hi" class="font-mono text-mono-sm text-fg-muted tabular-nums"
			>{value[0]}–{value[1]}{unit}</output
		>
	</legend>
	<div class="range relative h-11">
		<div class="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line"></div>
		<div
			class="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent-fill"
			style:left="{pct(value[0])}%"
			style:right="{100 - pct(value[1])}%"
		></div>
		<input
			id="{id}-lo"
			type="range"
			aria-label="{label} minimum"
			{min}
			{max}
			{step}
			value={value[0]}
			oninput={(e) => setLow(+e.currentTarget.value)}
			onchange={commit}
		/>
		<input
			id="{id}-hi"
			type="range"
			aria-label="{label} maximum"
			{min}
			{max}
			{step}
			value={value[1]}
			oninput={(e) => setHigh(+e.currentTarget.value)}
			onchange={commit}
		/>
	</div>
</fieldset>

<style>
	.range input {
		position: absolute;
		inset: 0;
		width: 100%;
		appearance: none;
		background: transparent;
		pointer-events: none;
	}
	.range input::-webkit-slider-thumb {
		appearance: none;
		pointer-events: auto;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--surface);
		border: 2px solid var(--accent-fill);
		cursor: grab;
		box-shadow: 0 0 0 6px color-mix(in oklab, var(--accent-fill) 12%, transparent);
	}
	.range input::-moz-range-thumb {
		pointer-events: auto;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--surface);
		border: 2px solid var(--accent-fill);
		cursor: grab;
	}
	.range input:focus-visible::-webkit-slider-thumb {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}
	.range input:focus-visible::-moz-range-thumb {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}
	.range input:focus-visible {
		outline: none;
	}
</style>
