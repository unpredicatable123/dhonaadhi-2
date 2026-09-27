/**
 * The single place internal URLs are built. Stage 2/3 destinations resolve to
 * /coming-soon/{section}; when a Stage 2 route ships, change one line here.
 */
export type LinkData = {
	label?: string | null;
	kind?: string | null;
	href?: string | null;
	section?: string | null;
	ref?: {
		_type: string;
		slug?: string | null;
		category?: string | null;
		subcategory?: string | null;
		section?: string | null;
	} | null;
} | null;

export const paths = {
	home: () => '/',
	products: () => '/products',
	category: (category: string) => `/products/${category}`,
	subcategory: (category: string, subcategory: string) => `/products/${category}/${subcategory}`,
	product: (p: { category?: string | null; subcategory?: string | null; slug?: string | null }) =>
		`/products/${p.category}/${p.subcategory}/${p.slug}`,
	compare: (slugs: string[] = []) =>
		slugs.length ? `/products/compare?ids=${slugs.join(',')}` : '/products/compare',
	comingSoon: (section: string) => `/coming-soon/${section}`
};

/** Stage 2 content types: linkable now, pages built later. */
const STAGE2: Record<string, string> = {
	solution: 'solutions',
	industry: 'solutions',
	technology: 'technologies'
};

export function resolveLink(link: LinkData): string {
	if (!link) return '/';
	if (link.kind === 'external' && link.href) return link.href;
	const r = link.ref;
	if (r) {
		switch (r._type) {
			case 'homePage':
				return paths.home();
			case 'productCategory':
				return paths.category(r.slug ?? '');
			case 'productSubcategory':
				return paths.subcategory(r.category ?? '', r.slug ?? '');
			case 'product':
				return paths.product(r);
			case 'comingSoonPage':
				return paths.comingSoon(r.section ?? '');
			default:
				if (STAGE2[r._type]) return paths.comingSoon(STAGE2[r._type]);
		}
	}
	if (link.section) return paths.comingSoon(link.section);
	return link.href ?? '/';
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);
