import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { CogIcon } from '@sanity/icons/Cog';
import { MenuIcon } from '@sanity/icons/Menu';
import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { HomeIcon } from '@sanity/icons/Home';
import { ClockIcon } from '@sanity/icons/Clock';
import { FolderIcon } from '@sanity/icons/Folder';
import { ComponentIcon } from '@sanity/icons/Component';
import { TagsIcon } from '@sanity/icons/Tags';
import { PackageIcon } from '@sanity/icons/Package';
import { BulbOutlineIcon } from '@sanity/icons/BulbOutline';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { CubeIcon } from '@sanity/icons/Cube';
import { CaseIcon } from '@sanity/icons/Case';
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';

/** Singletons open straight into their editor (fixed document ids). */
const singleton = (
	S: Parameters<StructureResolver>[0],
	type: string,
	title: string,
	icon: typeof CogIcon
) =>
	S.listItem()
		.title(title)
		.icon(icon)
		.id(type)
		.child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S, context) =>
	S.list()
		.title('Dhonaadhi')
		.items([
			S.listItem()
				.title('Site')
				.icon(CogIcon)
				.child(
					S.list()
						.title('Site')
						.items([
							singleton(S, 'siteSettings', 'Settings', CogIcon),
							singleton(S, 'navigation', 'Navigation', MenuIcon),
							singleton(S, 'footer', 'Footer', BlockElementIcon)
						])
				),
			S.listItem()
				.title('Pages')
				.icon(HomeIcon)
				.child(
					S.list()
						.title('Pages')
						.items([
							singleton(S, 'homePage', 'Home', HomeIcon),
							S.documentTypeListItem('comingSoonPage').title('Coming soon').icon(ClockIcon)
						])
				),
			S.divider(),
			S.listItem()
				.title('Catalogue')
				.icon(PackageIcon)
				.child(
					S.list()
						.title('Catalogue')
						.items([
							orderableDocumentListDeskItem({
								type: 'productCategory',
								title: 'Categories',
								icon: FolderIcon,
								S,
								context
							}),
							// Categories → subcategories → products, nested for browsing.
							S.listItem()
								.title('Browse by category')
								.icon(FolderIcon)
								.child(
									S.documentTypeList('productCategory')
										.title('Category')
										.child((catId) =>
											S.documentTypeList('productSubcategory')
												.title('Subcategories')
												.filter('_type == "productSubcategory" && category._ref == $catId')
												.params({ catId })
												.initialValueTemplates([
													S.initialValueTemplateItem('subcategory-in-category', { catId })
												])
												.child((subId) =>
													S.documentTypeList('product')
														.title('Products')
														.filter('_type == "product" && subcategory._ref == $subId')
														.params({ subId })
												)
										)
								),
							orderableDocumentListDeskItem({
								type: 'productSubcategory',
								title: 'Subcategories',
								icon: ComponentIcon,
								S,
								context
							}),
							S.documentTypeListItem('productSeries').title('Series').icon(TagsIcon),
							S.documentTypeListItem('product').title('All products').icon(PackageIcon)
						])
				),
			S.listItem()
				.title('Taxonomy')
				.icon(TagsIcon)
				.child(
					S.list()
						.title('Taxonomy')
						.items([
							S.documentTypeListItem('technology').title('Technologies').icon(BulbOutlineIcon),
							S.documentTypeListItem('aiFunction').title('AI functions').icon(SparklesIcon),
							S.documentTypeListItem('formFactor').title('Form factors').icon(CubeIcon)
						])
				),
			S.divider(),
			S.listItem()
				.title('Stage 2 (placeholders)')
				.icon(CaseIcon)
				.child(
					S.list()
						.title('Stage 2')
						.items([
							S.documentTypeListItem('solution').title('Solutions').icon(CaseIcon),
							S.documentTypeListItem('industry').title('Industries').icon(EarthGlobeIcon)
						])
				)
		]);
