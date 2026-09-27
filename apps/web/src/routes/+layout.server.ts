import { error } from '@sveltejs/kit';
import type { LayoutQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { layoutQuery } from '$lib/sanity/queries';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Chrome (header/footer) never carries stega: it would leak into aria labels and hrefs.
	const layout = await sanityFetch<LayoutQueryResult>(event, layoutQuery, {}, { stega: false });
	if (!layout.settings)
		error(500, 'Site settings are missing. Run `pnpm seed` or create them in the Studio.');
	return {
		motionPref: event.locals.motionPref,
		preview: event.locals.preview,
		settings: layout.settings,
		navigation: layout.navigation,
		footer: layout.footer,
		categories: layout.categories
	};
};
