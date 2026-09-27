<script lang="ts">
	import { counter } from '$lib/motion/actions';
	import { motion } from '$lib/stores/motion.svelte';
	import { cn } from '$lib/utils/cn';

	/** Big thermal number that counts up, with a sparkline that draws itself on reveal. */
	type Props = {
		value: number;
		suffix?: string;
		label: string;
		/** 4–24 points, any scale; normalised to the sparkline box. */
		trend?: number[];
		class?: string;
	};

	let { value, suffix = '', label, trend = [], class: className }: Props = $props();

	const path = $derived.by(() => {
		if (trend.length < 2) return '';
		const min = Math.min(...trend);
		const span = Math.max(...trend) - min || 1;
		return trend
			.map(
				(v, i) =>
					`${i ? 'L' : 'M'}${((i / (trend.length - 1)) * 100).toFixed(1)} ${(28 - ((v - min) / span) * 24).toFixed(1)}`
			)
			.join('');
	});

	let drawn = $state(false);
	function draw(node: SVGSVGElement) {
		const io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				drawn = true;
				io.disconnect();
			}
		});
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

<div class={cn('grid gap-3 border-t border-line pt-5', className)}>
	<p class="stat font-display text-display-xl leading-none font-medium text-highlight tabular-nums">
		<span use:counter={{ to: value }}>{new Intl.NumberFormat('en').format(value)}</span>{suffix}
	</p>
	<p class="text-sm text-fg-muted">{label}</p>
	{#if path}
		<svg
			use:draw
			viewBox="0 0 100 30"
			preserveAspectRatio="none"
			class="h-8 w-full"
			aria-hidden="true"
		>
			<path
				d={path}
				pathLength="1"
				fill="none"
				stroke="var(--color-thermal-400)"
				stroke-width="1.5"
				vector-effect="non-scaling-stroke"
				class="spark"
				class:drawn={drawn || motion.reduced}
			/>
		</svg>
	{/if}
</div>

<style>
	.stat {
		text-shadow: 0 0 36px color-mix(in oklab, var(--color-thermal-400) 35%, transparent);
	}
	.spark {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke-dashoffset 1.6s var(--ease-lens);
	}
	.spark.drawn {
		stroke-dashoffset: 0;
	}
</style>
