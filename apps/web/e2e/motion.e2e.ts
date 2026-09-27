import { expect, test } from '@playwright/test';
import { routes } from './helpers';

test.describe('reduced motion', () => {
	test.use({ reducedMotion: 'reduce' });

	test('disables smooth scroll, the iris and pinned scenes', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
		await expect(page.locator('html')).not.toHaveClass(/lenis/);
		await expect(page.locator('main div.iris')).toBeHidden();
		expect(await page.locator('.pin-spacer').count()).toBe(0);
		// Exploded view falls back to a static frame with every callout as text.
		await page.locator('#exploded-title').scrollIntoViewIfNeeded();
		await expect(page.getByText('F1.0 LumaNight optics').first()).toBeAttached();
	});
});

test.describe('full motion', () => {
	test('pins scenes and enables smooth scroll', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('html')).toHaveClass(/lenis/);
		await expect.poll(() => page.locator('.pin-spacer').count()).toBeGreaterThan(0);
	});

	test('footer toggle switches to reduced motion and persists', async ({ page }) => {
		await page.goto(routes.comingSoon);
		await page.locator('footer').getByText('Reduced', { exact: true }).click();
		await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
	});
});
