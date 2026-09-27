import { expect, test } from '@playwright/test';
import { routes, watchErrors } from './helpers';

for (const [name, path] of Object.entries(routes)) {
	test(`${name} renders without console errors`, async ({ page }) => {
		const errors = watchErrors(page);
		const res = await page.goto(path);
		expect(res?.status()).toBe(name === 'notFound' ? 404 : 200);
		await expect(page.locator('h1').first()).toBeVisible();
		await page.waitForLoadState('networkidle');
		expect(errors).toEqual([]);
	});
}

test('titles follow "{Page} · {company}" and the brand is read from the CMS', async ({ page }) => {
	await page.goto(routes.pdp);
	await expect(page).toHaveTitle(/NB-4M-B28L .* · Dhonaadhi Hitec Innovations$/);
	await expect(page.getByRole('link', { name: 'Dhonaadhi home' }).first()).toBeVisible();
});

test('structured data: Product and BreadcrumbList on the product page', async ({ page }) => {
	await page.goto(routes.pdp);
	const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
	const types = (JSON.parse(ld ?? '[]') as { '@type': string }[]).map((x) => x['@type']);
	expect(types).toEqual(expect.arrayContaining(['Organization', 'Product', 'BreadcrumbList']));
});

test('sitemap, robots and OG image are served', async ({ request }) => {
	const sitemap = await request.get('/sitemap.xml');
	expect(sitemap.ok()).toBe(true);
	expect((await sitemap.text()).match(/<url>/g)?.length).toBeGreaterThan(50);
	expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
	const og = await request.get(`${routes.pdp}/og.png`);
	expect(og.headers()['content-type']).toBe('image/png');
});

test('Stage 2/3 navigation resolves to coming-soon pages, never 404', async ({ page }) => {
	await page.goto('/');
	const hrefs = await page
		.locator('header a[href^="/coming-soon/"], footer a[href^="/coming-soon/"]')
		.evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
	expect(hrefs.length).toBeGreaterThan(4);
	for (const href of hrefs) {
		const res = await page.request.get(href!);
		expect(res.status(), href!).toBe(200);
	}
});
