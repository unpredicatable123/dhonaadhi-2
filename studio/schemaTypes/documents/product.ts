import { defineArrayMember, defineField, defineType } from 'sanity';
import { PackageIcon } from '@sanity/icons/Package';
import {
	audioOptions,
	deterrenceOptions,
	ikRatings,
	ipRatings,
	lensTypes,
	lightTypes,
	powerOptions
} from '../../lib/enums';

const optionList = (list: { title: string; value: string }[] | string[]) => ({ list });
const multi = (name: string, title: string, list: { title: string; value: string }[]) =>
	defineField({
		name,
		title,
		type: 'array',
		group: 'specs',
		of: [{ type: 'string' }],
		options: { list, layout: 'grid' },
		validation: (r) => r.unique()
	});

export const product = defineType({
	name: 'product',
	title: 'Product',
	type: 'document',
	icon: PackageIcon,
	groups: [
		{ name: 'main', title: 'Overview', default: true },
		{ name: 'media', title: 'Media' },
		{ name: 'specs', title: 'Key specs' },
		{ name: 'full', title: 'Full specs' },
		{ name: 'relations', title: 'Relations' },
		{ name: 'downloads', title: 'Downloads' },
		{ name: 'seo', title: 'SEO' }
	],
	fields: [
		defineField({
			name: 'modelNumber',
			type: 'string',
			group: 'main',
			description: 'e.g. NB-8M-B28L — shown in mono, used for search.',
			validation: (r) => r.required().regex(/^[A-Z0-9][A-Z0-9-]{3,23}$/, { name: 'model number' })
		}),
		defineField({
			name: 'name',
			type: 'string',
			group: 'main',
			validation: (r) => r.required().max(90)
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			group: 'main',
			options: { source: 'modelNumber', maxLength: 40 },
			validation: (r) => r.required()
		}),
		defineField({
			name: 'status',
			type: 'string',
			group: 'main',
			options: {
				list: ['new', 'active', 'discontinued'],
				layout: 'radio',
				direction: 'horizontal'
			},
			initialValue: 'active',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'releaseDate',
			type: 'date',
			group: 'main',
			description: 'Drives "newest" sorting.',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'category',
			type: 'reference',
			group: 'main',
			to: [{ type: 'productCategory' }],
			validation: (r) => r.required()
		}),
		defineField({
			name: 'subcategory',
			type: 'reference',
			group: 'main',
			to: [{ type: 'productSubcategory' }],
			options: {
				filter: ({ document }) => {
					const cat = (document as { category?: { _ref?: string } }).category?._ref;
					return cat ? { filter: 'category._ref == $cat', params: { cat } } : {};
				}
			},
			validation: (r) => r.required()
		}),
		defineField({
			name: 'series',
			type: 'reference',
			group: 'main',
			to: [{ type: 'productSeries' }]
		}),
		defineField({
			name: 'shortDescription',
			type: 'text',
			rows: 3,
			group: 'main',
			validation: (r) => r.required().max(220)
		}),
		defineField({
			name: 'highlights',
			type: 'array',
			group: 'main',
			of: [{ type: 'string' }],
			validation: (r) => r.min(3).max(8)
		}),
		defineField({
			name: 'cardSpecs',
			title: 'Card specs',
			group: 'main',
			description: 'Up to 3 chips on product cards. Leave empty to derive them from key specs.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'cardSpec',
					fields: [
						defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
						defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
						defineField({ name: 'unit', type: 'string' })
					],
					preview: { select: { title: 'label', subtitle: 'value' } }
				})
			],
			validation: (r) => r.max(3)
		}),

		defineField({
			name: 'heroImage',
			type: 'altImage',
			group: 'media',
			validation: (r) => r.required()
		}),
		defineField({ name: 'gallery', type: 'array', group: 'media', of: [{ type: 'altImage' }] }),
		defineField({
			name: 'spinFrames',
			title: '360° frames',
			group: 'media',
			description:
				'Optional image sequence (24–72 frames, in rotation order) for the drag-to-rotate viewer.',
			type: 'array',
			of: [{ type: 'image' }],
			validation: (r) =>
				r.custom((v) => (!v || v.length === 0 || v.length >= 12 ? true : 'Use at least 12 frames'))
		}),

		defineField({
			name: 'resolutionMp',
			title: 'Resolution (MP)',
			type: 'number',
			group: 'specs',
			validation: (r) => r.min(0.3).max(64)
		}),
		defineField({
			name: 'sensor',
			type: 'string',
			group: 'specs',
			description: 'e.g. 1/1.8″ progressive-scan CMOS'
		}),
		defineField({ name: 'lensMm', title: 'Lens min (mm)', type: 'number', group: 'specs' }),
		defineField({
			name: 'lensMmMax',
			title: 'Lens max (mm)',
			type: 'number',
			group: 'specs',
			description: 'Varifocal / zoom only.'
		}),
		defineField({
			name: 'lensType',
			type: 'string',
			group: 'specs',
			options: optionList(lensTypes)
		}),
		defineField({ name: 'opticalZoom', title: 'Optical zoom (×)', type: 'number', group: 'specs' }),
		defineField({
			name: 'lightType',
			title: 'Supplemental light',
			type: 'string',
			group: 'specs',
			options: optionList(lightTypes)
		}),
		defineField({ name: 'irDistanceM', title: 'Light range (m)', type: 'number', group: 'specs' }),
		defineField({
			name: 'ipRating',
			type: 'string',
			group: 'specs',
			options: optionList(ipRatings)
		}),
		defineField({
			name: 'ikRating',
			type: 'string',
			group: 'specs',
			options: optionList(ikRatings)
		}),
		defineField({
			name: 'poe',
			title: 'PoE powered',
			type: 'boolean',
			group: 'specs',
			initialValue: false
		}),
		multi('audio', 'Audio', audioOptions),
		multi('deterrence', 'Active deterrence', deterrenceOptions),
		multi('power', 'Power', powerOptions),
		defineField({
			name: 'channels',
			type: 'number',
			group: 'specs',
			description: 'Recorders, decoders, switches (ports).'
		}),
		defineField({
			name: 'storage',
			type: 'string',
			group: 'specs',
			description: 'e.g. microSD up to 512 GB / 4 SATA bays'
		}),
		defineField({
			name: 'operatingTemp',
			type: 'string',
			group: 'specs',
			description: 'e.g. −30 °C to 60 °C'
		}),
		defineField({ name: 'dori', type: 'dori', group: 'specs' }),

		defineField({ name: 'fullSpecs', type: 'array', group: 'full', of: [{ type: 'specGroup' }] }),

		defineField({
			name: 'formFactor',
			type: 'reference',
			group: 'relations',
			to: [{ type: 'formFactor' }]
		}),
		defineField({
			name: 'technologies',
			type: 'array',
			group: 'relations',
			of: [{ type: 'reference', to: [{ type: 'technology' }] }],
			validation: (r) => r.unique()
		}),
		defineField({
			name: 'aiFunctions',
			title: 'AI functions',
			type: 'array',
			group: 'relations',
			of: [{ type: 'reference', to: [{ type: 'aiFunction' }] }],
			validation: (r) => r.unique()
		}),
		defineField({ name: 'variants', type: 'array', group: 'relations', of: [{ type: 'variant' }] }),
		defineField({
			name: 'relatedProducts',
			type: 'array',
			group: 'relations',
			of: [{ type: 'reference', to: [{ type: 'product' }] }],
			validation: (r) => r.unique().max(8)
		}),
		defineField({
			name: 'comparedWith',
			title: 'Often compared with',
			type: 'array',
			group: 'relations',
			of: [{ type: 'reference', to: [{ type: 'product' }] }],
			validation: (r) => r.unique().max(6)
		}),
		defineField({
			name: 'relatedSolutions',
			type: 'array',
			group: 'relations',
			of: [{ type: 'reference', to: [{ type: 'solution' }] }]
		}),
		defineField({
			name: 'compatibleWith',
			title: 'Compatible with (accessories)',
			type: 'array',
			group: 'relations',
			of: [{ type: 'reference', to: [{ type: 'product' }] }]
		}),
		defineField({
			name: 'bundleItems',
			title: 'Kit contents',
			type: 'array',
			group: 'relations',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'bundleItem',
					fields: [
						defineField({
							name: 'product',
							type: 'reference',
							to: [{ type: 'product' }],
							validation: (r) => r.required()
						}),
						defineField({
							name: 'quantity',
							type: 'number',
							initialValue: 1,
							validation: (r) => r.min(1).integer()
						})
					],
					preview: {
						select: { title: 'product.modelNumber', q: 'quantity' },
						prepare: ({ title, q }) => ({ title: `${q}× ${title}` })
					}
				})
			]
		}),

		defineField({
			name: 'downloads',
			type: 'array',
			group: 'downloads',
			of: [{ type: 'download' }]
		}),
		defineField({ name: 'seo', type: 'seo', group: 'seo' })
	],
	orderings: [
		{ title: 'Newest', name: 'newest', by: [{ field: 'releaseDate', direction: 'desc' }] },
		{ title: 'Model number', name: 'model', by: [{ field: 'modelNumber', direction: 'asc' }] }
	],
	preview: {
		select: { title: 'modelNumber', subtitle: 'name', media: 'heroImage', status: 'status' },
		prepare: ({ title, subtitle, media, status }) => ({
			title: status === 'discontinued' ? `${title} (discontinued)` : title,
			subtitle,
			media
		})
	}
});
