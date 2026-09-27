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
