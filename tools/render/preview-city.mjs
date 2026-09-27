// Dev aid: node preview-city.mjs <out.png>
import sharp from 'sharp';
import { openScene, dataUrlToBuffer } from './harness.mjs';
const { browser, page } = await openScene('city.js');
const tiles = [];
for (const mode of ['day', 'night', 'luma', 'hero']) {
	const t = Date.now();
	const r = await page.evaluate((m) => window.city({ mode: m, width: 960, height: 540 }), mode);
	console.log(
		mode,
		((Date.now() - t) / 1000).toFixed(1) + 's',
		JSON.stringify(
			r.detections.map((d) => [d.label, ...[d.x, d.y, d.w, d.h].map((v) => +v.toFixed(1))])
		)
	);
	tiles.push(await sharp(dataUrlToBuffer(r.url)).png().toBuffer());
}
await browser.close();
await sharp({ create: { width: 1920, height: 1080, channels: 3, background: '#000' } })
	.composite(
		tiles.map((input, i) => ({ input, left: (i % 2) * 960, top: Math.floor(i / 2) * 540 }))
	)
	.png()
	.toFile(process.argv[2]);
