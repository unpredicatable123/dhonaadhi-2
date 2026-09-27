import type { RequestEvent } from '@sveltejs/kit';
import type { FacetSourceQueryResult, ListingNewestQueryResult } from '@dhonaadhi/sanity-types';
import { sanityFetch } from './sanity';
import {
	facetSourceQuery,
	listingNameQuery,
	listingNewestQuery,
	listingResolutionQuery
} from '$lib/sanity/queries';
import { PAGE_SIZE, activeChips, parseSelection, queryParams } from '$lib/catalogue/selector';
import { buildFacets, facetLabels } from '$lib/catalogue/facets';

export type FilterConfig = {
	attribute: string | null;
	ui: string | null;
	label: string | null;
	collapsed: boolean | null;
};

const QUERY = {
	newest: listingNewestQuery,
	resolution: listingResolutionQuery,
	name: listingNameQuery
} as const;

/** Merge filter configs (category scope = union of its subcategories), first occurrence wins. */
export function mergeConfigs(
	configs: ((FilterConfig | null)[] | null | undefined)[]
): FilterConfig[] {
	const seen = new Set<string>();
	const out: FilterConfig[] = [];
	for (const list of configs) {
		for (const c of list ?? []) {
			if (!c?.attribute || seen.has(c.attribute)) continue;
			seen.add(c.attribute);
			out.push(c);
		}
	}
	return out;
}

/**
 * Server-side product selector: URL → selection → GROQ params. All pages up to the
 * current one are returned (cumulative "Load more"), so every state is a shareable,
 * crawlable URL and back/forward restores it exactly.
 */
export async function loadListing(
	event: Pick<RequestEvent, 'locals' | 'url'>,
	scope: { category: string | null; subcategory: string | null },
	filterConfig: FilterConfig[]
) {
	const selection = parseSelection(event.url.searchParams);
	const params = queryParams(selection, scope, selection.page);
	const [results, rows] = await Promise.all([
		sanityFetch<ListingNewestQueryResult>(event, QUERY[selection.sort], params),
		sanityFetch<FacetSourceQueryResult>(event, facetSourceQuery, scope, { stega: false })
	]);
	const facets = buildFacets(filterConfig, rows);
	const labels = facetLabels(facets);
	return {
		selection,
		facets,
		chips: activeChips(selection, labels),
		total: results.total,
		items: results.items,
		scopeTotal: rows.length,
		pageSize: PAGE_SIZE
	};
}

export type Listing = Awaited<ReturnType<typeof loadListing>>;
