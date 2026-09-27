import fs from 'node:fs';
import path from 'node:path';
import { evaluate, parse } from 'groq-js';

/**
 * Fixture data source: the seed dataset evaluated locally with groq-js, Sanity's
 * reference GROQ implementation. Used when no Sanity project id is configured
 * (local development without an account, CI, e2e tests).
 */
export const fixturesDir = path.resolve(process.cwd(), '../../seed/data');

let dataset: unknown[] | undefined;
let mtime = 0;

function load(): unknown[] {
	const file = path.join(fixturesDir, 'dataset.ndjson');
	const stat = fs.statSync(file, { throwIfNoEntry: false });
	if (!stat)
		throw new Error(`Fixture dataset missing at ${file}. Run \`pnpm --filter seed build\`.`);
	// Reload when `pnpm seed` rebuilds the dataset during development.
	if (!dataset || stat.mtimeMs !== mtime) {
		dataset = fs
			.readFileSync(file, 'utf8')
			.trim()
			.split('\n')
			.map((line) => JSON.parse(line) as unknown);
		mtime = stat.mtimeMs;
	}
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
