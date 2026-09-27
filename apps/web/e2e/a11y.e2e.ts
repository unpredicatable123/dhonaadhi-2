import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { routes } from './helpers';

for (const [name, path] of Object.entries(routes)) {
	test(`${name}: no serious or critical axe violations`, async ({ page }) => {
		await page.goto(path);
		await page.waitForLoadState('networkidle');
		// Let entrance animations settle so contrast is measured on final colours.
		await page.waitForTimeout(2500);
		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
			.analyze();
		const blocking = results.violations.filter(
			(v) => v.impact === 'serious' || v.impact === 'critical'
		);
		expect(
			blocking.map(
				(v) =>
					`${v.id}: ${v.nodes
						.map((n) => n.target.join(' '))
						.slice(0, 3)
						.join(' | ')}`
			),
			'axe violations'
		).toEqual([]);
	});
}

test('skip link moves focus to main content', async ({ page }) => {
	await page.goto(routes.listing);
	await page.keyboard.press('Tab');
	const skip = page.getByRole('link', { name: 'Skip to content' });
	await expect(skip).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator('#main')).toBeFocused();
});
