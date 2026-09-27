// Downloads the curated CC0/public-domain industry photos (seed/data/photos.json) once.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import photos from '../data/photos.json' with { type: 'json' };

const dir = path.resolve(import.meta.dirname, '../data/images/photos');
fs.mkdirSync(dir, { recursive: true });

for (const [key, p] of Object.entries(photos)) {
	const file = path.join(dir, `${key}.webp`);
	if (fs.existsSync(file)) continue;
	const headers = { 'User-Agent': 'dhonaadhi-seed/1.0 (royalty-free asset fetch)' };
	let res = await fetch(p.url, { headers });
	// Some hosts refuse direct downloads; Openverse serves the same image through its own proxy.
	if (!res.ok)
		res = await fetch(
			`https://api.openverse.org/v1/images/${p.openverseId}/thumb/?full_size=true`,
			{ headers }
		);
	if (!res.ok) throw new Error(`${key}: HTTP ${res.status} for ${p.url}`);
	const buf = Buffer.from(await res.arrayBuffer());
	await sharp(buf)
		.resize({ width: 1600, withoutEnlargement: true })
		.webp({ quality: 80 })
		.toFile(file);
	console.log('photo', key, `(${p.license}, ${p.source})`);
}

// The dusk-to-night scene is one real night photo, graded three ways so every state is the same street:
// dusk (ambient lifted, warm), LumaNight (clean colour) and a conventional camera (mono, crushed, grainy).
const scenes = path.resolve(import.meta.dirname, '../data/images/scenes');
const night = path.join(dir, 'night-street.webp');
// The source is graded teal; pull blue down and lift red slightly for a neutral, warm night.
const warm: [[number, number, number], [number, number, number], [number, number, number]] = [
	[1.08, 0.04, 0],
	[0, 1, 0],
	[0, 0.06, 0.74]
];
const src = sharp(night);
const { width = 0, height = 0 } = await src.metadata();
await sharp(night)
	.recomb(warm)
	.linear(0.88, 62)
	.modulate({ brightness: 1.08, saturation: 0.85 })
	.composite([
		{
			input: Buffer.from(
				`<svg width="${width}" height="${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c98b" stop-opacity=".45"/><stop offset=".6" stop-color="#e9b77a" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`
			),
			blend: 'soft-light'
		}
	])
	.webp({ quality: 82 })
	.toFile(path.join(scenes, 'street-dusk.webp'));
await sharp(night)
	.recomb(warm)
	.linear(1.12, 4)
	.modulate({ saturation: 1.12 })
	.webp({ quality: 82 })
	.toFile(path.join(scenes, 'street-luma.webp'));
const noise = Buffer.alloc(width * height);
for (let i = 0; i < noise.length; i++) noise[i] = 128 + (Math.random() - 0.5) * 120;
const grain = await sharp(noise, { raw: { width, height, channels: 1 } })
	.blur(0.5)
	.png()
	.toBuffer();
await sharp(await sharp(night).grayscale().linear(0.55, -4).blur(1.2).toBuffer())
	.composite([{ input: grain, blend: 'overlay' }])
	.webp({ quality: 78 })
	.toFile(path.join(scenes, 'street-conventional.webp'));
console.log('scene grades written');
