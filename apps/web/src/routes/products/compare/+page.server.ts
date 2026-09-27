import type { CompareQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { compareQuery } from '$lib/sanity/queries';
import { COMPARE_MAX } from '$lib/stores/compare.svelte';
import type { PageServerLoad } from './$types';

/** /products/compare?ids=a,b,c — order follows the URL; unknown slugs are dropped. */
export const load: PageServerLoad = async (event) => {
	const slugs = (event.url.searchParams.get('ids') ?? '')
		.split(',')
		.map((s) => s.trim().toLowerCase())
		.filter((s) => /^[a-z0-9-]{2,40}$/.test(s))
		.filter((s, i, a) => a.indexOf(s) === i)
		.slice(0, COMPARE_MAX);
	const found = slugs.length
		? await sanityFetch<CompareQueryResult>(event, compareQuery, { slugs })
		: [];
	const products = slugs.map((s) => found.find((p) => p.slug === s)).filter((p) => !!p);
	return { products };
};
