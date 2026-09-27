import { createImageUrlBuilder } from '@sanity/image-url';

export type ImageData = {
	alt?: string | null;
	decorative?: boolean | null;
	hotspot?: { x?: number; y?: number; width?: number; height?: number } | null;
	crop?: { top?: number; bottom?: number; left?: number; right?: number } | null;
	asset?: {
		_id: string;
		url?: string | null;
		metadata?: {
			lqip?: string | null;
			dimensions?: {
				width?: number | null;
				height?: number | null;
				aspectRatio?: number | null;
			} | null;
		} | null;
	} | null;
} | null;

const CDN = /^https:\/\/cdn\.sanity\.io\/images\/([^/]+)\/([^/]+)\//;

/** Fixture mode: the local /fixtures route resizes on request (?w=), mirroring the CDN. */
const FIXTURE = /^\/fixtures\/images\//;

/** Widths offered in srcset; the browser picks via `sizes`. */
export const WIDTHS = [160, 320, 480, 640, 800, 1024, 1280, 1600, 1920, 2400];

/**
 * URL for one width. Sanity CDN images get hotspot-aware crops and automatic
 * AVIF/WebP; fixture images are resized by the local /fixtures route.
 */
export function imageUrl(image: ImageData, width: number, height?: number): string | undefined {
	const url = image?.asset?.url;
	if (!url) return undefined;
	if (FIXTURE.test(url)) return `${url}?w=${width}`;
	const m = url.match(CDN);
	if (!m) return url;
	const b = createImageUrlBuilder({ projectId: m[1], dataset: m[2] })
		.image({
			asset: { _ref: image!.asset!._id },
			hotspot: image!.hotspot ?? undefined,
			crop: image!.crop ?? undefined
		})
		.width(width)
		.auto('format')
		.quality(78)
		.fit(height ? 'crop' : 'max');
	return (height ? b.height(height) : b).url();
}

export function srcset(image: ImageData, aspect?: number): string | undefined {
	const url = image?.asset?.url;
	if (!url || !(CDN.test(url) || FIXTURE.test(url))) return undefined;
	const max = image?.asset?.metadata?.dimensions?.width ?? 2400;
	return WIDTHS.filter((w) => w <= max * 1.1)
		.map((w) => `${imageUrl(image, w, aspect ? Math.round(w / aspect) : undefined)} ${w}w`)
		.join(', ');
}

export function dimensions(image: ImageData): { width: number; height: number } {
	const d = image?.asset?.metadata?.dimensions;
	return { width: d?.width ?? 1600, height: d?.height ?? 900 };
}
