import type { LayoutQueryResult, ListingNewestQueryResult } from '@dhonaadhi/sanity-types';

/** Convenience aliases over TypeGen output. */
export type Layout = LayoutQueryResult;
export type Settings = NonNullable<Layout['settings']>;
export type Navigation = NonNullable<Layout['navigation']>;
export type NavItem = NonNullable<Navigation['items']>[number];
export type FooterData = NonNullable<Layout['footer']>;
export type CategoryTree = Layout['categories'];
export type CategoryNode = CategoryTree[number];
/** The PRODUCT_CARD projection (identical in every query that uses it). */
export type ProductCardData = ListingNewestQueryResult['items'][number];
