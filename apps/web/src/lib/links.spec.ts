import { describe, expect, it } from 'vitest';
import { resolveLink } from './links';

describe('resolveLink', () => {
	it('builds catalogue URLs from references', () => {
		expect(
			resolveLink({ kind: 'internal', ref: { _type: 'productCategory', slug: 'thermal' } })
		).toBe('/products/thermal');
		expect(
			resolveLink({
				kind: 'internal',
				ref: {
					_type: 'product',
					slug: 'nb-8m-b28l',
					category: 'network-cameras',
					subcategory: 'bullet-cameras'
				}
			})
		).toBe('/products/network-cameras/bullet-cameras/nb-8m-b28l');
	});

	it('sends Stage 2/3 destinations to coming-soon pages', () => {
		expect(resolveLink({ kind: 'internal', section: 'support' })).toBe('/coming-soon/support');
		expect(resolveLink({ kind: 'internal', ref: { _type: 'solution', slug: 'retail' } })).toBe(
			'/coming-soon/solutions'
		);
	});

	it('passes relative and absolute URLs through', () => {
		expect(resolveLink({ kind: 'external', href: '/products' })).toBe('/products');
		expect(resolveLink({ kind: 'external', href: 'https://example.com' })).toBe(
			'https://example.com'
		);
	});
});
