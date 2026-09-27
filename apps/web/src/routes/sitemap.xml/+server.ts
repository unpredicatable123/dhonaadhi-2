import type { SitemapQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from '$lib/server/sanity';
import { env } from '$lib/server/env';
import { sitemapQuery } from '$lib/sanity/queries';
import { paths } from '$lib/links';
import type { RequestHandler } from './$types';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET: RequestHandler = async (event) => {
	const data = await sanityFetch<SitemapQueryResult>(event, sitemapQuery, {}, { stega: false });
	const site = env.PUBLIC_SITE_URL.replace(/\/$/, '');
	const urls: { loc: string; lastmod?: string | null }[] = [
		{ loc: '/' },
		{ loc: paths.products() },
		...data.categories.map((c) => ({ loc: paths.category(c.slug ?? ''), lastmod: c._updatedAt })),
		...data.subcategories.map((s) => ({
			loc: paths.subcategory(s.category ?? '', s.slug ?? ''),
			lastmod: s._updatedAt
		})),
		...data.products.map((p) => ({ loc: paths.product(p), lastmod: p._updatedAt }))
	];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${esc(site + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>`;
	return new Response(body, {
		headers: {
			'content-type': 'application/xml',
			'cache-control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
