// Renders all generated imagery. Usage: pnpm render [products|spin|exploded|city ...]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { openScene, dataUrlToBuffer } from './harness.mjs';
import { renders, angles, spins, exploded } from './manifest.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const out = path.join(root, 'seed/data/images');
const seqDir = path.join(root, 'apps/web/static/sequences/exploded');
const want = new Set(process.argv.slice(2));
const run = (k) => want.size === 0 || want.has(k);
const mkdir = (d) => fs.mkdirSync(d, { recursive: true });
const t0 = Date.now();
const log = (...a) => console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s]`, ...a);

async function save(url, file, width, height, quality = 82) {
	mkdir(path.dirname(file));
	await sharp(dataUrlToBuffer(url))
		.resize(width, height, { kernel: 'lanczos3' })
		.webp({ quality, effort: 5 })
		.toFile(file);
}

if (run('products') || run('spin') || run('exploded')) {
	const { browser, page } = await openScene('main.js');
	if (run('products')) {
		for (const [id, spec] of Object.entries(renders)) {
			const onlyAngle = process.env.ANGLE;
			for (const [a, ang] of Object.entries(angles)) {
				if (onlyAngle && a !== onlyAngle) continue;
				const url = await page.evaluate((s) => window.shot(s), {
					...spec,
					...ang,
					width: 1200,
					height: 900
				});
				await save(url, path.join(out, 'renders', `${id}-${a}.webp`), 1200, 900);
			}
			log('product', id);
		}
	}
	if (run('spin')) {
		for (const [id, n] of Object.entries(spins)) {
			for (let i = 0; i < n; i++) {
				const url = await page.evaluate((s) => window.shot(s), {
					...renders[id],
					...angles.a,
					spin: (i * 360) / n,
					width: 800,
					height: 600
				});
				await save(
					url,
					path.join(out, 'spin', id, `${String(i).padStart(2, '0')}.webp`),
					800,
					600,
					76
				);
			}
			log('spin', id);
		}
	}
	if (run('exploded')) {
		const anchors = {};
		for (let i = 0; i < exploded.frames; i++) {
			const r = await page.evaluate((s) => window.exploded(s), {
				t: i / (exploded.frames - 1),
				width: 1280,
				height: 720
			});
			await save(r.url, path.join(seqDir, `${String(i).padStart(3, '0')}.webp`), 1280, 720, 72);
			if (exploded.callouts.some((c) => c.frame === i)) anchors[i] = r.anchors;
			if (i % 20 === 0) log('exploded', i);
		}
		const callouts = exploded.callouts.map((c) => ({
			...c,
			x: +anchors[c.frame][c.part].x.toFixed(1),
			y: +anchors[c.frame][c.part].y.toFixed(1)
		}));
		fs.writeFileSync(
			path.join(out, 'exploded-callouts.json'),
			JSON.stringify(callouts, null, '\t')
		);
		fs.copyFileSync(path.join(seqDir, '000.webp'), path.join(out, 'exploded-poster.webp'));
	}
	await browser.close();
}

if (run('city')) {
	const { browser, page } = await openScene('city.js');
	const shots = { hero: [2400, 1350], day: [1600, 1000], night: [1600, 1000], luma: [1600, 1000] };
	const meta = {};
	for (const [mode, [w, h]] of Object.entries(shots)) {
		const r = await page.evaluate((s) => window.city(s), { mode, width: w, height: h });
		const file = path.join(out, 'scenes', `city-${mode}.webp`);
		mkdir(path.dirname(file));
		await sharp(dataUrlToBuffer(r.url)).webp({ quality: 80, effort: 5 }).toFile(file);
		meta[mode] = r.detections;
		log('city', mode);
	}
	// Conventional night camera: monochrome, crushed, noisy — derived from the same night frame.
	const night = sharp(path.join(out, 'scenes', 'city-night.webp'));
	const { width, height } = await night.metadata();
	const noise = Buffer.alloc(width * height);
	for (let i = 0; i < noise.length; i++) noise[i] = 128 + (Math.random() - 0.5) * 120;
	const grain = await sharp(noise, { raw: { width, height, channels: 1 } })
		.blur(0.5)
		.png()
		.toBuffer();
	await sharp(await night.grayscale().linear(0.75, 6).blur(1.1).toBuffer())
		.composite([{ input: grain, blend: 'overlay' }])
		.webp({ quality: 78 })
		.toFile(path.join(out, 'scenes', 'city-conventional.webp'));
	fs.writeFileSync(
		path.join(out, 'scenes', 'city-detections.json'),
		JSON.stringify(meta, null, '\t')
	);
	await browser.close();
	log('city conventional');
}
log('done');
