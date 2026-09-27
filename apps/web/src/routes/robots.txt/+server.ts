import { env } from '$lib/server/env';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const site = env.PUBLIC_SITE_URL.replace(/\/$/, '');
	const body = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /api/',
		'Disallow: /styleguide',
		'Disallow: /products/compare',
		`Sitemap: ${site}/sitemap.xml`,
		''
	].join('\n');
	return new Response(body, { headers: { 'content-type': 'text/plain' } });
};
