import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { error } from '@sveltejs/kit';
import { env } from '$lib/server/env';
import { fixturesDir } from '$lib/server/fixtures';
import { WIDTHS } from '$lib/sanity/image';
import type { RequestHandler } from './$types';

const TYPES: Record<string, string> = {
	'.webp': 'image/webp',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf'
};

/** Resized variants, kept in memory for the life of the dev/preview process. */
const cache = new Map<string, Buffer>();

/**
 * Serves seed images/files in fixture mode, with `?w=` resizing so srcset behaves like
 * the Sanity image CDN locally. Disabled when a Sanity project is configured.
 */
export const GET: RequestHandler = async ({ params, url, setHeaders }) => {
	if (env.dataSource !== 'fixtures') error(404, 'Not found');
	const file = path.resolve(fixturesDir, params.path);
	if (
		!file.startsWith(path.resolve(fixturesDir, 'images')) &&
		!file.startsWith(path.resolve(fixturesDir, 'files'))
	)
		error(404, 'Not found');
	if (!fs.existsSync(file)) error(404, 'Not found');
	setHeaders({ 'cache-control': 'public, max-age=31536000, immutable' });

	const ext = path.extname(file);
	const w = Number(url.searchParams.get('w'));
	if (ext !== '.svg' && TYPES[ext]?.startsWith('image/') && WIDTHS.includes(w)) {
		const key = `${file}@${w}`;
		let body = cache.get(key);
		if (!body) {
			body = await sharp(file)
				.resize({ width: w, withoutEnlargement: true })
				.webp({ quality: 72 })
				.toBuffer();
			cache.set(key, body);
		}
		setHeaders({ 'content-type': 'image/webp' });
		return new Response(new Uint8Array(body));
	}
	setHeaders({ 'content-type': TYPES[ext] ?? 'application/octet-stream' });
	return new Response(new Uint8Array(fs.readFileSync(file)));
};
