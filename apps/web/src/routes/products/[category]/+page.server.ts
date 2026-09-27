import { error } from '@sveltejs/kit';
import type { CategoryQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { loadListing, mergeConfigs } from '$lib/server/listing';
import { categoryQuery } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { category } = event.params;
	const cat = await sanityFetch<CategoryQueryResult>(event, categoryQuery, { category });
	if (!cat) error(404, 'Not found');
	// Category-wide selector: the union of its subcategories' filters.
	const config = mergeConfigs(cat.subcategories.map((s) => s.filterConfig));
	const listing = await loadListing(event, { category, subcategory: null }, config);
	if (!event.locals.preview) {
		event.setHeaders({
			'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
		});
	}
	return { cat, listing };
};
