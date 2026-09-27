export type Box = { x: number; y: number; w: number; h: number };

/**
 * Maps a box given in % of the source image to % of a container that shows the
 * image with `object-fit: cover; object-position: center`. Keeps detection boxes
 * locked to their subjects at every viewport aspect ratio.
 */
export function coverMap(
	box: Box,
	container: { width: number; height: number },
	image: { width: number; height: number }
): Box {
	const scale = Math.max(container.width / image.width, container.height / image.height);
	const drawnW = image.width * scale;
	const drawnH = image.height * scale;
	const offX = (container.width - drawnW) / 2;
	const offY = (container.height - drawnH) / 2;
	const px = (v: number, drawn: number, off: number, size: number) =>
		((off + (v / 100) * drawn) / size) * 100;
	return {
		x: px(box.x, drawnW, offX, container.width),
		y: px(box.y, drawnH, offY, container.height),
		w: ((box.w / 100) * drawnW * 100) / container.width,
		h: ((box.h / 100) * drawnH * 100) / container.height
	};
}

/** True when the mapped box is at least mostly inside the visible frame. */
export const isVisible = (b: Box) =>
	b.x > -b.w * 0.3 && b.x + b.w < 100 + b.w * 0.3 && b.y > -5 && b.y + b.h < 105;
