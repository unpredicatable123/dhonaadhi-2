<script lang="ts">
	import { RotateCw } from '@lucide/svelte';

	/**
	 * Drag-to-rotate 360° viewer over an image sequence. Keyboard: ←/→ rotate by one
	 * frame, Home resets. Frames preload after mount.
	 */
	let { frames, label }: { frames: string[]; label: string } = $props();

	let index = $state(0);
	let dragging = $state(false);
	let startX = 0;
	let startIndex = 0;

	$effect(() => {
		for (const src of frames) {
			const img = new Image();
			img.src = src;
		}
	});

	const wrap = (i: number) => ((i % frames.length) + frames.length) % frames.length;

	function down(e: PointerEvent) {
		dragging = true;
		startX = e.clientX;
		startIndex = index;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}
	function move(e: PointerEvent) {
		if (!dragging) return;
		const w = (e.currentTarget as HTMLElement).clientWidth;
		index = wrap(startIndex - Math.round(((e.clientX - startX) / w) * frames.length));
	}
	function key(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') index = wrap(index + 1);
		else if (e.key === 'ArrowLeft') index = wrap(index - 1);
		else if (e.key === 'Home') index = 0;
		else return;
		e.preventDefault();
	}
</script>

<div
	role="slider"
	tabindex="0"
	aria-label="{label}: drag or use arrow keys to rotate"
	aria-valuemin={0}
	aria-valuemax={359}
	aria-valuenow={Math.round((index / frames.length) * 360)}
	aria-valuetext="{Math.round((index / frames.length) * 360)} degrees"
	class="relative h-full w-full touch-pan-y select-none {dragging
		? 'cursor-grabbing'
		: 'cursor-grab'}"
	onpointerdown={down}
	onpointermove={move}
	onpointerup={() => (dragging = false)}
	onpointercancel={() => (dragging = false)}
	onkeydown={key}
>
	<img
		src={frames[index]}
		alt=""
		draggable="false"
		class="h-full w-full object-cover"
		width="800"
		height="600"
	/>
	<span
		class="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink-950/80 px-3 py-1.5 font-mono text-mono-sm text-fg-muted backdrop-blur"
	>
		<RotateCw class="size-3.5" aria-hidden="true" /> 360° · {Math.round(
			(index / frames.length) * 360
		)}°
	</span>
</div>
