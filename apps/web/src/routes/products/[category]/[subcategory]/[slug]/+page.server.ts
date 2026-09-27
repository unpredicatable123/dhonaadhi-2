import { error } from '@sveltejs/kit';
import type { ProductQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { productQuery } from '$lib/sanity/queries';
import type { Config } from '@sveltejs/adapter-vercel';
import type { PageServerLoad } from './$types';

/**
 * Product pages are statically regenerated on Vercel (ISR) and refreshed on demand by
 * the Sanity webhook (/api/revalidate sends the bypass token).
 */
export const config: Config = {
	isr: {
		expiration: 3600,
		bypassToken: process.env.SANITY_REVALIDATE_SECRET,
		allowQuery: []
	}
};

export const load: PageServerLoad = async (event) => {
	const product = await sanityFetch<ProductQueryResult>(event, productQuery, event.params);
	if (!product) error(404, 'Not found');
	return { product };
};
