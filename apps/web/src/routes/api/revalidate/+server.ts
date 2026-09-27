import { error, json } from '@sveltejs/kit';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { env } from '$lib/server/env';
import { sanityFetch } from '$lib/server/sanity';
import { pathsForDocumentQuery } from '$lib/sanity/queries';
import type { RequestHandler } from './$types';

type Doc = {
	_type: string;
	slug: string | null;
	category: string | null;
	subcategory: string | null;
} | null;

/** Which public paths depend on a changed document. */
function pathsFor(doc: Doc): string[] {
	if (!doc) return ['/'];
	switch (doc._type) {
		case 'product':
			return [
				`/products/${doc.category}/${doc.subcategory}/${doc.slug}`,
				`/products/${doc.category}/${doc.subcategory}`,
				`/products/${doc.category}`,
				'/products',
				'/'
			];
		case 'productSubcategory':
			return [`/products/${doc.category}/${doc.slug}`, `/products/${doc.category}`, '/products'];
		case 'productCategory':
			return [`/products/${doc.slug}`, '/products', '/'];
		default:
			// Site settings, navigation, footer, taxonomy: affects every page.
			return ['/', '/products'];
	}
}

/**
 * Sanity webhook → on-demand ISR revalidation. The webhook body must be signed with
 * SANITY_REVALIDATE_SECRET; Vercel re-renders each path when requested with the
 * bypass token header.
 */
export const POST: RequestHandler = async (event) => {
	const secret = env.SANITY_REVALIDATE_SECRET;
	if (!secret) error(501, 'Revalidation is not configured');
	const body = await event.request.text();
	const signature = event.request.headers.get(SIGNATURE_HEADER_NAME) ?? '';
	if (!(await isValidSignature(body, signature, secret))) error(401, 'Invalid signature');

	const { _id } = JSON.parse(body) as { _id?: string };
	if (!_id) error(400, 'Missing _id');
	const doc = await sanityFetch<Doc>(event, pathsForDocumentQuery, {
		id: _id.replace(/^drafts\./, '')
	});
	const paths = pathsFor(doc);
	const origin = env.PUBLIC_SITE_URL;
	const results = await Promise.allSettled(
		paths.map((p) =>
			fetch(new URL(p, origin), { method: 'HEAD', headers: { 'x-prerender-revalidate': secret } })
		)
	);
	return json({ revalidated: paths, ok: results.every((r) => r.status === 'fulfilled') });
};
