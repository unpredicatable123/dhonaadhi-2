import path from 'node:path';
import { evaluate, parse } from 'groq-js';
// Bundled into the server build so deployments work without the seed folder on disk.
// During development Vite re-evaluates this module when `pnpm seed` rewrites the file.
import raw from '$fixtures/dataset.ndjson?raw';

/**
 * Fixture data source: the seed dataset evaluated locally with groq-js, Sanity's
 * reference GROQ implementation. Used when no Sanity project id is configured
 * (local development without an account, CI, e2e tests, preview deployments).
 */
export const fixturesDir = path.resolve(process.cwd(), '../../seed/data');

let dataset: unknown[] | undefined;

function load(): unknown[] {
	dataset ??= raw
		.trim()
		.split('\n')
		.map((line) => JSON.parse(line) as unknown);
	return dataset;
}

export async function fixtureFetch<T>(
	query: string,
	params: Record<string, unknown> = {}
): Promise<T> {
	// Not cached: groq-js binds some params (e.g. slice bounds) at parse time.
	const tree = parse(query, { params });
	const result = await evaluate(tree, { dataset: load(), params });
	return (await result.get()) as T;
}
