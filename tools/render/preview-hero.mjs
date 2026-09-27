// Dev aid: renders the hero frame and prints projected detection boxes.
import { openScene } from './harness.mjs';
import fs from 'node:fs';
const { browser, page } = await openScene('city.js');
const r = await page.evaluate(() => window.city({ mode: 'hero', width: 960, height: 540 }));
console.log(
	JSON.stringify(
		r.detections.map((d) => [
			d.label,
			Math.round(d.x),
			Math.round(d.y),
			Math.round(d.w),
			Math.round(d.h)
		])
	)
);
fs.writeFileSync(process.argv[2], Buffer.from(r.url.split(',')[1], 'base64'));
await browser.close();
