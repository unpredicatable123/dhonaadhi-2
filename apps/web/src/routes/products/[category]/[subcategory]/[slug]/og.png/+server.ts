import { error } from '@sveltejs/kit';
import type { BrandQueryResult, ProductQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { brandQuery, productQuery } from '$lib/sanity/queries';
import { imageUrl } from '$lib/sanity/image';
import { renderOg } from '$lib/server/og/render';
import type { RequestHandler } from './$types';

/** Per-product Open Graph image (1200×630 PNG). */
export const GET: RequestHandler = async (event) => {
	const [p, brand] = await Promise.all([
		sanityFetch<ProductQueryResult>(event, productQuery, event.params, { stega: false }),
		sanityFetch<BrandQueryResult>(event, brandQuery, {}, { stega: false })
	]);
	if (!p) error(404, 'Not found');
	const img = imageUrl(p.image, 900, 675);
	const png = await renderOg({
		brand: brand?.brandName ?? '',
		model: p.modelNumber ?? '',
		name: p.name ?? '',
		specs: (p.cardSpecs ?? []).map(
			(s) => `${s.value}${s.unit ? ` ${s.unit}` : ''} ${s.label?.toLowerCase()}`
		),
		image: img ? new URL(img, event.url.origin).href : undefined,
		fetcher: event.fetch
	});
	return new Response(new Uint8Array(png), {
		headers: {
			'content-type': 'image/png',
			'cache-control': 'public, max-age=86400, s-maxage=604800'
		}
	});
};
