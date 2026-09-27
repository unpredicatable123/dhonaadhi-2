import { json } from '@sveltejs/kit';
import type { SearchQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { searchQuery } from '$lib/sanity/queries';
import type { RequestHandler } from './$types';

/** Command-palette search by model number / name (GROQ `match`, prefix wildcard). */
export const GET: RequestHandler = async (event) => {
	const raw = (event.url.searchParams.get('q') ?? '').trim().slice(0, 40);
	const q = raw.replace(/[^\p{L}\p{N}\s-]/gu, '');
	if (q.length < 2) return json([]);
	const results = await sanityFetch<SearchQueryResult>(
		event,
		searchQuery,
		{ q: `${q}*` },
		{ stega: false }
	);
	return json(results, { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } });
};
