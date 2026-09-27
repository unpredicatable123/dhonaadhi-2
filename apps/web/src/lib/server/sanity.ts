import { createClient, type QueryParams, type SanityClient } from '@sanity/client';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from './env';
import { fixtureFetch } from './fixtures';

/** Server client (never shipped to the browser — it may carry the viewer token). */
export const serverClient: SanityClient | undefined =
	env.dataSource === 'sanity'
		? createClient({
				projectId: env.PUBLIC_SANITY_PROJECT_ID,
				dataset: env.PUBLIC_SANITY_DATASET,
				apiVersion: env.PUBLIC_SANITY_API_VERSION,
				useCdn: true,
				token: env.SANITY_API_READ_TOKEN,
				perspective: 'published',
				stega: { studioUrl: env.PUBLIC_SANITY_STUDIO_URL }
			})
		: undefined;

/**
 * The only place that knows about the data source. Load functions call
 * `sanityFetch(event, query, params)` and get the same shape from Sanity or fixtures.
 * In preview (Presentation tool) the draft perspective and stega encoding are used.
 */
export async function sanityFetch<T>(
	event: Pick<RequestEvent, 'locals'>,
	query: string,
	params: QueryParams = {},
	{ stega = true }: { stega?: boolean } = {}
): Promise<T> {
	if (env.dataSource === 'fixtures' || !serverClient) return fixtureFetch<T>(query, params);
	const client = event.locals.client ?? serverClient;
	return client.fetch<T>(query, params, { stega: event.locals.preview ? stega : false });
}
