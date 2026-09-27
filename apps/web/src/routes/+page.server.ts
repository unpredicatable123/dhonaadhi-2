import { error } from '@sveltejs/kit';
import type { HomeQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { homeQuery } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const home = await sanityFetch<HomeQueryResult>(event, homeQuery);
	if (!home) error(404, 'The home page has not been created in the Studio yet.');
	if (!event.locals.preview) {
		event.setHeaders({
			'cache-control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400'
		});
	}
	return { home };
};
