import { defineArrayMember, defineField, defineType } from 'sanity';
import { FolderIcon } from '@sanity/icons/Folder';
import { ComponentIcon } from '@sanity/icons/Component';
import { TagsIcon } from '@sanity/icons/Tags';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { categoryIcons, filterAttributes } from '../../lib/enums';

const slug = (source = 'title') =>
	defineField({
		name: 'slug',
		type: 'slug',
		options: { source, maxLength: 64 },
		validation: (r) => r.required()
	});

export const productCategory = defineType({
	name: 'productCategory',
	title: 'Category',
	type: 'document',
	icon: FolderIcon,
	orderings: [orderRankOrdering],
	fields: [
		orderRankField({ type: 'productCategory' }),
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		slug(),
		defineField({
			name: 'icon',
			type: 'string',
			description: 'Line icon from the Dhonaadhi category set.',
			options: { list: categoryIcons },
			validation: (r) => r.required()
		}),
		defineField({ name: 'tagline', type: 'string', validation: (r) => r.max(80) }),
		defineField({
			name: 'description',
			type: 'text',
			rows: 3,
			validation: (r) => r.required().max(240)
		}),
		defineField({ name: 'heroImage', type: 'altImage', validation: (r) => r.required() }),
		defineField({ name: 'seo', type: 'seo' })
	],
	preview: { select: { title: 'title', subtitle: 'tagline', media: 'heroImage' } }
});

export const productSubcategory = defineType({
	name: 'productSubcategory',
	title: 'Subcategory',
	type: 'document',
	icon: ComponentIcon,
	orderings: [orderRankOrdering],
	fields: [
		orderRankField({ type: 'productSubcategory' }),
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		slug(),
		defineField({
			name: 'category',
			type: 'reference',
			to: [{ type: 'productCategory' }],
			validation: (r) => r.required()
		}),
		defineField({ name: 'description', type: 'text', rows: 3 }),
		defineField({ name: 'heroImage', type: 'altImage' }),
		defineField({
			name: 'filterConfig',
			title: 'Product selector filters',
			description: 'Which attributes can be filtered on this listing, in display order.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'filter',
					fields: [
						defineField({
							name: 'attribute',
							type: 'string',
							options: { list: filterAttributes.map((a) => ({ title: a.title, value: a.value })) },
							validation: (r) => r.required()
						}),
						defineField({
							name: 'ui',
							title: 'Control',
							type: 'string',
							options: {
								list: ['checkbox', 'range', 'toggle'],
								layout: 'radio',
								direction: 'horizontal'
							},
							initialValue: 'checkbox'
						}),
						defineField({
							name: 'label',
							type: 'string',
							description: 'Override the default label.'
						}),
						defineField({ name: 'collapsed', type: 'boolean', initialValue: false })
					],
					preview: {
						select: { title: 'attribute', subtitle: 'ui', label: 'label' },
						prepare: ({ title, subtitle, label }) => ({ title: label || title, subtitle })
					}
				})
			],
			validation: (r) => r.unique()
		}),
		defineField({ name: 'seo', type: 'seo' })
	],
	preview: { select: { title: 'title', subtitle: 'category.title', media: 'heroImage' } }
});

export const productSeries = defineType({
	name: 'productSeries',
	title: 'Series',
	type: 'document',
	icon: TagsIcon,
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		slug(),
		defineField({
			name: 'tier',
			type: 'string',
			options: {
				list: [
					{ title: 'Value', value: 'value' },
					{ title: 'Pro', value: 'pro' },
					{ title: 'Ultra', value: 'ultra' },
					{ title: 'Deep-learning (AI)', value: 'ai' },
					{ title: 'Panoramic', value: 'panoramic' },
					{ title: 'Special / explosion-proof', value: 'special' }
				]
			},
			validation: (r) => r.required()
		}),
		defineField({
			name: 'subcategories',
			description: 'Series can span subcategories (e.g. Pro exists for fixed and PTZ cameras).',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'productSubcategory' }] }]
		}),
		defineField({ name: 'tagline', type: 'string', validation: (r) => r.max(90) })
	],
	preview: { select: { title: 'title', subtitle: 'tier' } }
});
