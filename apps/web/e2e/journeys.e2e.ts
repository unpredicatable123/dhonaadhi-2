import { expect, test } from '@playwright/test';
import { routes } from './helpers';

const cards = (page: import('@playwright/test').Page) =>
	page.locator('ul[aria-label="Products"] > li');

test('product selector: filters are shareable URLs and back restores state', async ({ page }) => {
	await page.goto(routes.category);
	await expect(cards(page)).toHaveCount(12);
	await page.locator('aside').getByText('White light', { exact: true }).click();
	await expect(page).toHaveURL(/lightType=white/);
	await expect(cards(page)).toHaveCount(5);
	await page.locator('aside').getByText('Pro series', { exact: true }).click();
	await expect(page).toHaveURL(/series=pro/);
	await expect(cards(page)).toHaveCount(2);
	await page.goBack();
	await expect(cards(page)).toHaveCount(5);
	// A copied URL reproduces the same state on a fresh load.
	await page.goto(`${routes.category}?series=pro&lightType=white`);
	await expect(cards(page)).toHaveCount(2);
	await expect(page.getByRole('list', { name: 'Active filters' })).toContainText('Pro series');
});

test('load more appends results and moves focus to the first new product', async ({ page }) => {
	await page.goto(routes.category);
	await page.getByRole('link', { name: /Show \d+ more/ }).click();
	await expect(page).toHaveURL(/page=2/);
	await expect(cards(page)).toHaveCount(22);
	await expect(page.locator('article h3 a').nth(12)).toBeFocused();
});

test('compare: pick two products, open the table, remove one', async ({ page }) => {
	await page.goto(routes.listing);
	await page.locator('article').nth(0).getByText('Compare').click();
	await page.locator('article').nth(1).getByText('Compare').click();
	const tray = page.getByRole('complementary', { name: 'Compare selection' });
	await expect(tray).toBeVisible();
	await tray.getByRole('link', { name: /Compare 2/ }).click();
	await expect(page).toHaveURL(/\/products\/compare\?ids=/);
	await expect(page.locator('thead th[scope=col] .font-mono')).toHaveCount(2);
	await page
		.getByRole('button', { name: /^Remove / })
		.first()
		.click();
	await expect(page.locator('thead th[scope=col] .font-mono')).toHaveCount(1);
});

test('command palette finds a model and opens its page', async ({ page }) => {
	await page.goto('/');
	await page.keyboard.press('Control+k');
	await page.getByRole('combobox').fill('NT-8M');
	await expect(page.getByRole('option').first()).toContainText('NT-8M-T40A');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/\/nt-8m-t40a$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Sentinel turret/);
});

test('card → detail keeps the shared image name for the view-transition morph', async ({
	page
}) => {
	await page.goto(routes.listing);
	const vtName = await page
		.locator('article')
		.first()
		.evaluate(
			(el) =>
				(el.querySelector('[style*="view-transition-name"]') as HTMLElement)?.style
					.viewTransitionName
		);
	await page.locator('article h3 a').first().click();
	await expect(page).toHaveURL(/\/products\/network-cameras\/bullet-cameras\/[a-z0-9-]+$/);
	const heroName = await page
		.locator('[style*="view-transition-name"]')
		.first()
		.evaluate((el) => (el as HTMLElement).style.viewTransitionName);
	expect(heroName).toBe(vtName);
});

test('datasheet download is a real PDF', async ({ page, request }) => {
	await page.goto(routes.pdp);
	const href = await page.getByRole('link', { name: 'Download datasheet' }).getAttribute('href');
	const res = await request.get(href!);
	expect(res.headers()['content-type']).toBe('application/pdf');
	expect((await res.body()).subarray(0, 4).toString()).toBe('%PDF');
});

test('a tilted carousel card opens its product page at the top', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto(routes.home);
	const slide = page.locator('section[aria-labelledby="featured-title"] [data-slide]').nth(1);
	const href = await slide.locator('a').first().getAttribute('href');
	// Bring the side card on screen and wait until it is still (lazy pins above it change the
	// page height as they load, and smooth scrolling settles over a few frames), then make sure
	// the point we will click really hits the card's link.
	let point = { x: 0, y: 0 };
	await expect(async () => {
		await slide.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 200));
		await page.waitForTimeout(400);
		const a = (await slide.boundingBox())!;
		await page.waitForTimeout(300);
		const b = (await slide.boundingBox())!;
		expect(Math.abs(b.y - 200)).toBeLessThan(80);
		expect(Math.abs(b.y - a.y)).toBeLessThan(1);
		point = { x: b.x + b.width / 2, y: b.y + b.height * 0.35 };
		const hit = await page.evaluate(
			({ x, y }) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href'),
			point
		);
		expect(hit).toBe(href);
	}).toPass({ timeout: 30_000 });
	// Click the card itself (not via locator.click, which would scroll natively and bypass the 3D hit-test).
	await page.mouse.click(point.x, point.y);
	await expect(page).toHaveURL(href!);
	await expect(page.locator('h1')).toBeVisible();
	await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});
