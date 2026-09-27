import { error } from '@sveltejs/kit';
import type { ComingSoonQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { comingSoonQuery } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const page = await sanityFetch<ComingSoonQueryResult>(event, comingSoonQuery, {
		section: event.params.section
	});
	if (!page) error(404, 'Not found');
	event.setHeaders({
		'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
	});
	return { page };
};
