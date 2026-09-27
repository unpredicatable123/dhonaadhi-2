import fs from 'node:fs';
import path from 'node:path';
import { error } from '@sveltejs/kit';
import { env } from '$lib/server/env';
import { fixturesDir } from '$lib/server/fixtures';
import type { RequestHandler } from './$types';

const TYPES: Record<string, string> = {
	'.webp': 'image/webp',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf'
};

/** Serves seed images/files in fixture mode. Disabled when a Sanity project is configured. */
export const GET: RequestHandler = ({ params, setHeaders }) => {
	if (env.dataSource !== 'fixtures') error(404, 'Not found');
	const file = path.resolve(fixturesDir, params.path);
	if (
		!file.startsWith(path.resolve(fixturesDir, 'images')) &&
		!file.startsWith(path.resolve(fixturesDir, 'files'))
	)
		error(404, 'Not found');
	if (!fs.existsSync(file)) error(404, 'Not found');
	setHeaders({
		'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
		'cache-control': 'public, max-age=31536000, immutable'
	});
	return new Response(fs.readFileSync(file));
};
