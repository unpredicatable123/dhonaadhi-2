import type { ProductsHubQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { loadListing, mergeConfigs } from '$lib/server/listing';
import { productsHubQuery } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const hub = await sanityFetch<ProductsHubQueryResult>(event, productsHubQuery);
	// ?q=… (from the home "Find your product" search) opens the catalogue-wide selector.
	const searching = event.url.searchParams.has('q') || event.url.searchParams.size > 0;
	const listing = searching
		? await loadListing(
				event,
				{ category: null, subcategory: null },
				mergeConfigs([hub.filterConfig])
			)
		: null;
	if (!event.locals.preview) {
		event.setHeaders({
			'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
		});
	}
	return { hub, listing };
};
