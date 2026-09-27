import { error } from '@sveltejs/kit';
import type { SubcategoryQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { loadListing } from '$lib/server/listing';
import { subcategoryQuery } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { category, subcategory } = event.params;
	const sub = await sanityFetch<SubcategoryQueryResult>(event, subcategoryQuery, {
		category,
		subcategory
	});
	if (!sub) error(404, 'Not found');
	const listing = await loadListing(event, { category, subcategory }, sub.filterConfig ?? []);
	if (!event.locals.preview) {
		event.setHeaders({
			'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
		});
	}
	return { sub, listing };
};
