import { describe, expect, it } from 'vitest';
import type { CompareQueryResult } from '@dhonaadhi/sanity-types';
import { fixtureFetch } from '$lib/server/fixtures';
import { compareQuery } from '$lib/sanity/queries';
import { compareRows } from './compare-rows';

describe('compareRows', () => {
	it('flags differing rows and drops rows empty for every product', async () => {
		const products = await fixtureFetch<CompareQueryResult>(compareQuery, {
			slugs: ['nb-4m-b28l', 'nb-8m-b28l']
		});
		const groups = compareRows(products);
		const rows = groups.flatMap((g) => g.rows);
		expect(rows.find((r) => r.label === 'Resolution')).toMatchObject({
			differs: true,
			values: expect.arrayContaining(['4 MP', '8 MP'])
		});
		expect(rows.find((r) => r.label === 'Lens')?.differs).toBe(false);
		expect(rows.find((r) => r.label === 'Channels / ports')).toBeUndefined();
	});
});
