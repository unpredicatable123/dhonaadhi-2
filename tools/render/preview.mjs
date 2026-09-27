// Contact sheet of every model kind (dev aid): node preview.mjs <out.png>
import sharp from 'sharp';
import { openScene, dataUrlToBuffer } from './harness.mjs';

const all = [
	['bullet', {}],
	['bullet', { light: 'hybrid', color: 'graphite' }],
	['bullet', { solar: true }],
	['dome', {}],
	['turret', {}],
	['turret', { color: 'graphite' }],
	['ptz', {}],
	['fisheye', {}],
	['box', {}],
	['thermal', {}],
	['nvr', {}],
	['switch', {}],
	['faceTerminal', {}],
	['reader', {}],
	['doorStation', {}],
	['indoorStation', {}],
	['bridge', {}]
];
const only = process.argv[3]?.split(',');
const kinds = only ? all.filter((_, i) => only.includes(String(i))) : all;
const { browser, page } = await openScene();
const tiles = [];
const t0 = Date.now();
for (const [kind, options] of kinds) {
	const url = await page.evaluate((a) => window.shot(a), {
		kind,
		options,
		width: 360,
		height: 270
	});
	tiles.push(await sharp(dataUrlToBuffer(url)).resize(360, 270).png().toBuffer());
}
console.log('rendered', tiles.length, 'in', ((Date.now() - t0) / 1000).toFixed(1) + 's');
await browser.close();
const cols = 6;
const rows = Math.ceil(tiles.length / cols);
await sharp({ create: { width: cols * 360, height: rows * 270, channels: 3, background: '#000' } })
	.composite(
		tiles.map((input, i) => ({ input, left: (i % cols) * 360, top: Math.floor(i / cols) * 270 }))
	)
	.png()
	.toFile(process.argv[2]);
