import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';
import { routes } from './helpers';

/**
 * Review screenshots (not pixel assertions): every Stage 1 page at the four review
 * widths, written to /screenshots for the design review after each milestone.
 */
const widths = [375, 768, 1280, 1920];
const out = path.resolve(process.cwd(), '../../screenshots');
const pages = {
	home: routes.home,
	hub: routes.hub,
	listing: routes.listing,
	pdp: routes.pdp,
	compare: routes.compare,
	'coming-soon': routes.comingSoon
};

test.use({ reducedMotion: 'reduce' });

for (const w of widths) {
	for (const [name, url] of Object.entries(pages)) {
		test(`screenshot ${name} @${w}`, async ({ page }) => {
			fs.mkdirSync(out, { recursive: true });
			await page.setViewportSize({ width: w, height: w < 800 ? 812 : 1000 });
			await page.goto(url);
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(600);
			await page.screenshot({ path: path.join(out, `${name}-${w}.png`), fullPage: true });
		});
	}
}
