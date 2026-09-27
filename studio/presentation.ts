import {
	defineDocuments,
	defineLocations,
	type PresentationPluginOptions
} from 'sanity/presentation';

/**
 * Maps documents ↔ frontend routes for the Presentation tool.
 * Product URL: /products/{category}/{subcategory}/{slug}
 */
export const resolve: PresentationPluginOptions['resolve'] = {
	mainDocuments: defineDocuments([
		{ route: '/', filter: `_type == "homePage"` },
		{
			route: '/products/:category',
			filter: `_type == "productCategory" && slug.current == $category`
		},
		{
			route: '/products/:category/:subcategory',
			filter: `_type == "productSubcategory" && slug.current == $subcategory`
		},
		{
			route: '/products/:category/:subcategory/:slug',
			filter: `_type == "product" && slug.current == $slug`
		},
		{ route: '/coming-soon/:section', filter: `_type == "comingSoonPage" && section == $section` }
	]),
	locations: {
		homePage: defineLocations({
			message: 'The home page',
			locations: [{ title: 'Home', href: '/' }]
		}),
		productCategory: defineLocations({
			select: { title: 'title', slug: 'slug.current' },
			resolve: (doc) => ({
				locations: [
					{ title: doc?.title ?? 'Category', href: `/products/${doc?.slug}` },
					{ title: 'Products hub', href: '/products' }
				]
			})
		}),
		productSubcategory: defineLocations({
			select: { title: 'title', slug: 'slug.current', category: 'category.slug.current' },
			resolve: (doc) => ({
				locations: [
					{ title: doc?.title ?? 'Listing', href: `/products/${doc?.category}/${doc?.slug}` }
				]
			})
		}),
		product: defineLocations({
			select: {
				title: 'modelNumber',
				slug: 'slug.current',
				category: 'category.slug.current',
				subcategory: 'subcategory.slug.current'
			},
			resolve: (doc) => ({
				locations: [
					{
						title: doc?.title ?? 'Product',
						href: `/products/${doc?.category}/${doc?.subcategory}/${doc?.slug}`
					},
					{ title: 'Listing', href: `/products/${doc?.category}/${doc?.subcategory}` }
				]
			})
		}),
		comingSoonPage: defineLocations({
			select: { title: 'title', section: 'section' },
			resolve: (doc) => ({
				locations: [{ title: doc?.title ?? 'Coming soon', href: `/coming-soon/${doc?.section}` }]
			})
		}),
		siteSettings: defineLocations({ message: 'Used on every page', tone: 'caution' }),
		navigation: defineLocations({ message: 'Used on every page', tone: 'caution' }),
		footer: defineLocations({ message: 'Used on every page', tone: 'caution' })
	}
};
