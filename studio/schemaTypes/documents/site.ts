import { defineArrayMember, defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons/Cog';
import { MenuIcon } from '@sanity/icons/Menu';
import { BlockElementIcon } from '@sanity/icons/BlockElement';
import { HomeIcon } from '@sanity/icons/Home';
import { ClockIcon } from '@sanity/icons/Clock';
import { homeSectionTypes } from '../sections';
import { comingSoonSections } from '../../lib/enums';

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	icon: CogIcon,
	groups: [
		{ name: 'brand', title: 'Brand', default: true },
		{ name: 'seo', title: 'SEO' },
		{ name: 'contact', title: 'Contact & social' },
		{ name: 'motion', title: 'Motion' }
	],
	fields: [
		defineField({
			name: 'companyName',
			type: 'string',
			group: 'brand',
			description: 'Legal/full name — footer, meta titles, JSON-LD.',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'brandName',
			type: 'string',
			group: 'brand',
			description: 'Short name — header, UI copy.',
			validation: (r) => r.required()
		}),
		defineField({ name: 'logoDark', title: 'Logo (on dark)', type: 'image', group: 'brand' }),
		defineField({ name: 'logoLight', title: 'Logo (on light)', type: 'image', group: 'brand' }),
		defineField({ name: 'monogram', type: 'image', group: 'brand' }),
		defineField({ name: 'seo', title: 'Default SEO', type: 'seo', group: 'seo' }),
		defineField({ name: 'siteUrl', type: 'url', group: 'seo', validation: (r) => r.required() }),
		defineField({ name: 'email', type: 'string', group: 'contact', validation: (r) => r.email() }),
		defineField({ name: 'phone', type: 'string', group: 'contact' }),
		defineField({ name: 'address', type: 'text', rows: 3, group: 'contact' }),
		defineField({
			name: 'social',
			type: 'array',
			group: 'contact',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'socialLink',
					fields: [
						defineField({
							name: 'platform',
							type: 'string',
							options: { list: ['linkedin', 'youtube', 'x', 'instagram', 'facebook'] },
							validation: (r) => r.required()
						}),
						defineField({ name: 'url', type: 'url', validation: (r) => r.required() })
					],
					preview: { select: { title: 'platform', subtitle: 'url' } }
				})
			]
		}),
		defineField({
			name: 'motion',
			type: 'object',
			group: 'motion',
			fields: [
				defineField({ name: 'smoothScroll', type: 'boolean', initialValue: true }),
				defineField({ name: 'pageTransitions', type: 'boolean', initialValue: true }),
				defineField({
					name: 'grain',
					title: 'Film grain overlay',
					type: 'boolean',
					initialValue: true
				})
			]
		})
	],
	preview: { select: { title: 'companyName' } }
});

const megaColumn = defineArrayMember({
	type: 'object',
	name: 'megaColumn',
	fields: [
		defineField({ name: 'heading', type: 'string' }),
		defineField({ name: 'links', type: 'array', of: [{ type: 'link' }] })
	],
	preview: { select: { title: 'heading' } }
});

export const navigation = defineType({
	name: 'navigation',
	title: 'Navigation',
	type: 'document',
	icon: MenuIcon,
	fields: [
		defineField({
			name: 'items',
			title: 'Main menu',
			type: 'array',
			validation: (r) => r.max(6),
			of: [
				defineArrayMember({
					type: 'object',
					name: 'navItem',
					fields: [
						defineField({ name: 'link', type: 'link', validation: (r) => r.required() }),
						defineField({
							name: 'mega',
							title: 'Mega menu',
							type: 'string',
							description: '"catalogue" builds the panel from categories automatically.',
							options: {
								list: ['none', 'catalogue', 'columns'],
								layout: 'radio',
								direction: 'horizontal'
							},
							initialValue: 'none'
						}),
						defineField({
							name: 'columns',
							type: 'array',
							of: [megaColumn],
							hidden: ({ parent }) => parent?.mega !== 'columns'
						}),
						defineField({
							name: 'featured',
							title: 'Featured product',
							type: 'reference',
							to: [{ type: 'product' }],
							hidden: ({ parent }) => parent?.mega === 'none'
						})
					],
					preview: { select: { title: 'link.label', subtitle: 'mega' } }
				})
			]
		}),
		defineField({ name: 'utility', title: 'Utility links', type: 'array', of: [{ type: 'link' }] }),
		defineField({ name: 'cta', title: 'Header CTA', type: 'link' })
	],
	preview: { prepare: () => ({ title: 'Navigation' }) }
});

export const footer = defineType({
	name: 'footer',
	title: 'Footer',
	type: 'document',
	icon: BlockElementIcon,
	fields: [
		defineField({ name: 'statement', type: 'string', description: 'One line beside the logo.' }),
		defineField({ name: 'columns', type: 'array', of: [megaColumn], validation: (r) => r.max(5) }),
		defineField({ name: 'legal', title: 'Legal links', type: 'array', of: [{ type: 'link' }] }),
		defineField({ name: 'newsletterText', type: 'string' })
	],
	preview: { prepare: () => ({ title: 'Footer' }) }
});

export const homePage = defineType({
	name: 'homePage',
	title: 'Home',
	type: 'document',
	icon: HomeIcon,
	fields: [
		defineField({ name: 'title', type: 'string', initialValue: 'Home', readOnly: true }),
		defineField({
			name: 'sections',
			type: 'array',
			description: 'Drag to reorder. Each scene has a text equivalent for reduced motion.',
			of: homeSectionTypes.map((type) => ({ type }))
		}),
		defineField({ name: 'seo', type: 'seo' })
	],
	preview: { prepare: () => ({ title: 'Home page' }) }
});

export const comingSoonPage = defineType({
	name: 'comingSoonPage',
	title: 'Coming soon',
	type: 'document',
	icon: ClockIcon,
	fields: [
		defineField({
			name: 'section',
			type: 'string',
			description: 'URL key: /coming-soon/{section}',
			options: {
				list: comingSoonSections
			},
			validation: (r) => r.required()
		}),
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'lead', type: 'text', rows: 3 }),
		defineField({ name: 'eta', title: 'Expected', type: 'string', description: 'e.g. "Q1 2027"' }),
		defineField({
			name: 'links',
			title: 'Meanwhile, try',
			type: 'array',
			of: [{ type: 'link' }],
			validation: (r) => r.max(3)
		})
	],
	preview: { select: { title: 'title', subtitle: 'section' } }
});
