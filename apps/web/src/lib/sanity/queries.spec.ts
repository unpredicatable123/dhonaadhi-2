import { describe, expect, it } from 'vitest';
import type {
	CategoryQueryResult,
	CompareQueryResult,
	HomeQueryResult,
	LayoutQueryResult,
	ListingNewestQueryResult,
	ListingResolutionQueryResult,
	ProductQueryResult,
	SearchQueryResult
} from '@dhonaadhi/sanity-types';
import { fixtureFetch } from '$lib/server/fixtures';
import { parseSelection, queryParams } from '$lib/catalogue/selector';
import * as q from './queries';

const listing = (search: string, subcategory: string | null = 'bullet-cameras') =>
	queryParams(parseSelection(new URLSearchParams(search)), {
		category: 'network-cameras',
		subcategory
	});

describe('GROQ queries against the seed dataset', () => {
	it('layout: settings, navigation and category tree', async () => {
		const r = await fixtureFetch<LayoutQueryResult>(q.layoutQuery);
		expect(r.settings?.companyName).toBe('Dhonaadhi Hitec Innovations');
		expect(r.settings?.brandName).toBe('Dhonaadhi');
		expect(r.categories.length).toBeGreaterThanOrEqual(6);
		expect(r.categories.reduce((n, c) => n + (c.count ?? 0), 0)).toBeGreaterThanOrEqual(40);
		expect(r.navigation?.items?.[0]?.featured?.modelNumber).toBe('NB-8M-B28L');
	});

	it('home: every section resolves its references', async () => {
		const r = await fixtureFetch<HomeQueryResult>(q.homeQuery);
		const types = r?.sections?.map((s) => s._type);
		expect(types).toContain('heroAperture');
		const hero = r?.sections?.find((s) => s._type === 'heroAperture');
		expect(hero && 'image' in hero && hero.image?.asset?.url).toMatch(/hero-street/);
		const rail = r?.sections?.find((s) => s._type === 'categoryRail');
		expect(rail && 'categories' in rail && rail.categories?.length).toBe(7);
	});

	it('listing: filters narrow results and total matches items', async () => {
		const all = await fixtureFetch<ListingNewestQueryResult>(q.listingNewestQuery, listing(''));
		expect(all.total).toBe(8);
		const colour = await fixtureFetch<ListingNewestQueryResult>(
			q.listingNewestQuery,
			listing('lightType=white,hybrid')
		);
		expect(colour.total).toBeGreaterThan(0);
		expect(colour.total).toBeLessThan(all.total);
		const hi = await fixtureFetch<ListingResolutionQueryResult>(
			q.listingResolutionQuery,
			listing('mp=8-')
		);
		expect(hi.items.every((p) => (p.resolutionMp ?? 0) >= 8)).toBe(true);
		expect(hi.items[0].resolutionMp).toBe(12);
	});

	it('listing: AI functions combine with AND', async () => {
		const one = await fixtureFetch<ListingNewestQueryResult>(
			q.listingNewestQuery,
			listing('aiFunctions=perimeter-protection')
		);
		const two = await fixtureFetch<ListingNewestQueryResult>(
			q.listingNewestQuery,
			listing('aiFunctions=perimeter-protection,anpr')
		);
		expect(two.total).toBeLessThan(one.total);
		expect(two.items.map((p) => p.modelNumber)).toEqual(['NB-8M-V2812A']);
	});

	it('listing: category-wide scope and text search', async () => {
		const r = await fixtureFetch<ListingNewestQueryResult>(
			q.listingNewestQuery,
			listing('q=fisheye', null)
		);
		expect(r.items.map((p) => p.modelNumber).sort()).toEqual(['NF-12M-F16', 'NF-6M-F12']);
	});

	it('category and product detail', async () => {
		const c = await fixtureFetch<CategoryQueryResult>(q.categoryQuery, {
			category: 'network-cameras'
		});
		expect(c?.subcategories.length).toBe(5);
		const p = await fixtureFetch<ProductQueryResult>(q.productQuery, {
			slug: 'nb-8m-b28l',
			category: 'network-cameras',
			subcategory: 'bullet-cameras'
		});
		expect(p?.modelNumber).toBe('NB-8M-B28L');
		expect(p?.downloads?.find((d) => d.kind === 'datasheet')?.url).toMatch(/\.pdf$/);
		expect(p?.fullSpecs?.[0]?.group).toBe('Camera');
		expect(p?.technologies?.map((t) => t.title)).toContain('LumaNight');
	});

	it('compare and search', async () => {
		const c = await fixtureFetch<CompareQueryResult>(q.compareQuery, {
			slugs: ['nb-8m-b28l', 'nt-8m-t40a']
		});
		expect(c).toHaveLength(2);
		const s = await fixtureFetch<SearchQueryResult>(q.searchQuery, { q: 'NB-8M*' });
		expect(s.map((p) => p.modelNumber)).toContain('NB-8M-B28L');
	});
});
