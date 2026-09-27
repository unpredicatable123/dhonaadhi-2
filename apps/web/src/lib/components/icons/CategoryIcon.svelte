<script lang="ts" module>
	/**
	 * Dhonaadhi category icon set: 24-unit grid, 1.5 stroke, round caps. Every path has
	 * pathLength=1 so it can "draw itself" (see .draw in the style block).
	 */
	export const categoryPaths: Record<string, string[]> = {
		'camera-network': [
			'M4 8.5h11.5a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5H4z',
			'M3 7.5h16',
			'M18 11h2.5',
			'M9 13.5v3.5',
			'M6 19.5h6',
			'M9 17v2.5'
		],
		'camera-ptz': [
			'M4 3.5h8',
			'M8 3.5v4',
			'M5 7.5h6v2.5H5z',
			'M4.5 10h7a3.5 3.5 0 0 1-7 0z',
			'M8 13.5a1 1 0 1 0 0 .01',
			'M15 12a5 5 0 0 1 5 5',
			'M15 15a2 2 0 0 1 2 2'
		],
		recorder: [
			'M3 7h18v10H3z',
			'M6 10.5h2.5v3H6z',
			'M10 10.5h2.5v3H10z',
			'M16 12h.01',
			'M18 12h.01',
			'M3 14.5h18'
		],
		thermal: [
			'M10 4a2 2 0 0 1 4 0v9.5a3.5 3.5 0 1 1-4 0z',
			'M12 9v6',
			'M17 6c1.5 1.2 1.5 3.3 0 4.5',
			'M19 4.5c2.5 2.2 2.5 5.8 0 8'
		],
		access: [
			'M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8',
			'M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8',
			'M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16',
			'M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16',
			'M12 8a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5',
			'M8 17a4.5 4.5 0 0 1 8 0'
		],
		intercom: [
			'M7 3h10v18H7z',
			'M10 6.5h4v3h-4z',
			'M10 12.5h.01',
			'M12 12.5h.01',
			'M14 12.5h.01',
			'M12 17.5a1 1 0 1 0 0 .01'
		],
		alarm: ['M12 3l7 3v5c0 4.5-3 8-7 10c-4-2-7-5.5-7-10V6z', 'M12 8v4.5', 'M12 15.5h.01'],
		display: ['M3 5h18v11H3z', 'M9 20h6', 'M12 16v4', 'M6 8h5v5H6z', 'M13 8h5'],
		'network-switch': [
			'M2.5 9h19v6h-19z',
			'M5 11.5h2v1.5H5z',
			'M8.5 11.5h2v1.5h-2z',
			'M12 11.5h2v1.5h-2z',
			'M17 12h.01',
			'M19 12h.01',
			'M7 9V6.5',
			'M17 9V6.5'
		],
		traffic: [
			'M5 13l1.5-4.5h11L19 13',
			'M4 13h16v4H4z',
			'M7 17v2',
			'M17 17v2',
			'M7 15h.01',
			'M17 15h.01',
			'M9.5 15h5'
		],
		software: [
			'M3 4h18v14H3z',
			'M3 8h18',
			'M6 6h.01',
			'M8 6h.01',
			'M7 11h4v4H7z',
			'M13 11h5',
			'M13 14h3'
		]
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils/cn';

	let {
		name,
		class: className,
		draw = false,
		strokeWidth = 1.5
	}: { name: string; class?: string; draw?: boolean; strokeWidth?: number } = $props();

	const paths = $derived(categoryPaths[name] ?? categoryPaths['camera-network']);
</script>

<svg
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	class={cn('size-6', draw && 'draw', className)}
>
	{#each paths as d, i (i)}
		<path {d} pathLength="1" style:--i={i} />
	{/each}
</svg>

<style>
	.draw path {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1.1s var(--ease-lens) forwards;
		animation-delay: calc(var(--i) * 90ms + 150ms);
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	:global([data-motion='reduced']) .draw path {
		animation: none;
		stroke-dashoffset: 0;
	}
</style>
