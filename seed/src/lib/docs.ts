import crypto from 'node:crypto';

/** Deterministic `_key` so rebuilding the dataset produces identical documents. */
export function key(...parts: unknown[]): string {
	return crypto.createHash('sha1').update(JSON.stringify(parts)).digest('hex').slice(0, 12);
}

export const ref = (id: string) => ({ _type: 'reference', _ref: id });
export const keyedRef = (id: string, i: number) => ({
	_type: 'reference',
	_ref: id,
	_key: key(id, i)
});
export const slug = (current: string) => ({ _type: 'slug', current });
export const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

/** Document ids use dashes: ids containing "." are private in Sanity. */
export const ids = {
	category: (s: string) => `category-${s}`,
	subcategory: (s: string) => `subcategory-${s}`,
	series: (s: string) => `series-${s}`,
	product: (model: string) => `product-${slugify(model)}`,
	technology: (s: string) => `technology-${s}`,
	aiFunction: (s: string) => `ai-${s}`,
	formFactor: (s: string) => `formfactor-${s}`,
	industry: (s: string) => `industry-${s}`,
	solution: (s: string) => `solution-${s}`,
	comingSoon: (s: string) => `comingsoon-${s}`
};

/**
 * Link shorthand → `link` object.
 * '/path' → relative URL · 'section:x' → coming soon · 'category:slug' / 'product:MODEL' → reference.
 */
export function link(label: string, to: string, k = key(label, to)) {
	const base = { _type: 'link', _key: k, label };
	if (to.startsWith('/')) return { ...base, kind: 'external', href: to };
	const [type, value] = to.split(':');
	if (type === 'section') return { ...base, kind: 'internal', section: value };
	if (type === 'category')
		return { ...base, kind: 'internal', reference: ref(ids.category(value)) };
	if (type === 'product') return { ...base, kind: 'internal', reference: ref(ids.product(value)) };
	throw new Error(`Unknown link target ${to}`);
}
