import { defineArrayMember, defineField, defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons/Link';
import { ImageIcon } from '@sanity/icons/Image';
import { DownloadIcon } from '@sanity/icons/Download';
import { comingSoonSections } from '../../lib/enums';

/** Documents that can be linked internally. Stage 2/3 types resolve to /coming-soon until built. */
export const linkableTypes = [
	'homePage',
	'productCategory',
	'productSubcategory',
	'productSeries',
	'product',
	'technology',
	'solution',
	'industry',
	'comingSoonPage'
].map((type) => ({ type }));

export const altImage = defineType({
	name: 'altImage',
	title: 'Image',
	type: 'image',
	icon: ImageIcon,
	options: { hotspot: true, metadata: ['lqip', 'palette'] },
	fields: [
		defineField({
			name: 'alt',
			title: 'Alternative text',
			type: 'string',
			description:
				'Describe what the image shows. Use an empty value only for purely decorative images.',
			validation: (r) =>
				r.custom((alt, ctx) => {
					const parent = ctx.parent as { asset?: unknown; decorative?: boolean } | undefined;
					if (!parent?.asset || parent.decorative) return true;
					return alt && alt.trim().length > 2 ? true : 'Alt text is required';
				})
		}),
		defineField({
			name: 'decorative',
			title: 'Decorative only',
			type: 'boolean',
			initialValue: false,
			description: 'Hidden from assistive technology (e.g. ambient backgrounds).'
		}),
		defineField({ name: 'credit', title: 'Credit', type: 'string' })
	]
});

export const seo = defineType({
	name: 'seo',
	title: 'SEO',
	type: 'object',
	options: { collapsible: true, collapsed: true },
	fields: [
		defineField({
			name: 'title',
			type: 'string',
			description: 'Page title before " · {companyName}". Defaults to the document title.',
			validation: (r) => r.max(60).warning('Keep under 60 characters')
		}),
		defineField({
			name: 'description',
			type: 'text',
			rows: 3,
			validation: (r) => r.max(160).warning('Keep under 160 characters')
		}),
		defineField({ name: 'image', title: 'Share image', type: 'altImage' }),
		defineField({ name: 'noIndex', type: 'boolean', initialValue: false })
	]
});

export const link = defineType({
	name: 'link',
	title: 'Link',
	type: 'object',
	icon: LinkIcon,
	fields: [
		defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'kind',
			type: 'string',
			options: { list: ['internal', 'external'], layout: 'radio', direction: 'horizontal' },
			initialValue: 'internal'
		}),
		defineField({
			name: 'reference',
			type: 'reference',
			to: linkableTypes,
			hidden: ({ parent }) => parent?.kind !== 'internal'
		}),
		defineField({
			name: 'href',
			title: 'URL',
			type: 'url',
			validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }),
			hidden: ({ parent }) => parent?.kind !== 'external'
		}),
		defineField({
			name: 'section',
			title: 'Stage 2/3 section',
			type: 'string',
			description:
				'For sections not built yet (Solutions, Support…). Resolves to a "Coming soon" page.',
			options: {
				list: comingSoonSections
			},
			hidden: ({ parent }) => parent?.kind !== 'internal'
		})
	],
	preview: { select: { title: 'label', subtitle: 'href' } }
});

export const specGroup = defineType({
	name: 'specGroup',
	title: 'Spec group',
	type: 'object',
	fields: [
		defineField({
			name: 'group',
			type: 'string',
			options: {
				list: [
					'Camera',
					'Lens',
					'Pixel density (DORI)',
					'Illuminator',
					'Video',
					'Audio',
					'Network',
					'Image',
					'Interface',
					'Event',
					'Deep-learning function',
					'General',
					'Approval'
				]
			},
			validation: (r) => r.required()
		}),
		defineField({
			name: 'rows',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'specRow',
					fields: [
						defineField({ name: 'key', type: 'string', validation: (r) => r.required() }),
						defineField({ name: 'value', type: 'string', validation: (r) => r.required() })
					],
					preview: { select: { title: 'key', subtitle: 'value' } }
				})
			],
			validation: (r) => r.min(1)
		})
	],
	preview: {
		select: { title: 'group', rows: 'rows' },
		prepare: ({ title, rows }) => ({
			title,
			subtitle: `${(rows as unknown[] | undefined)?.length ?? 0} rows`
		})
	}
});

export const download = defineType({
	name: 'download',
	title: 'Download',
	type: 'object',
	icon: DownloadIcon,
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'kind',
			type: 'string',
			options: { list: ['datasheet', 'manual', 'firmware', 'cad', 'certificate'] },
			validation: (r) => r.required()
		}),
		defineField({ name: 'file', type: 'file' }),
		defineField({
			name: 'externalUrl',
			type: 'url',
			description: 'Use when the file is hosted elsewhere (e.g. firmware CDN).'
		}),
		defineField({ name: 'version', type: 'string' }),
		defineField({ name: 'date', type: 'date' }),
		defineField({
			name: 'sizeBytes',
			title: 'Size (bytes)',
			type: 'number',
			description: 'Filled automatically for uploaded files.'
		}),
		defineField({ name: 'language', type: 'string', initialValue: 'EN' })
	],
	validation: (r) =>
		r.custom((v: { file?: unknown; externalUrl?: string } | undefined) =>
			v?.file || v?.externalUrl ? true : 'Upload a file or provide a URL'
		),
	preview: { select: { title: 'title', subtitle: 'kind' } }
});

export const variant = defineType({
	name: 'variant',
	title: 'Orderable variant',
	type: 'object',
	fields: [
		defineField({
			name: 'suffix',
			title: 'Full model',
			type: 'string',
			validation: (r) => r.required()
		}),
		defineField({ name: 'lensMm', title: 'Lens (mm)', type: 'number' }),
		defineField({
			name: 'status',
			type: 'string',
			options: { list: ['new', 'active', 'discontinued'] },
			initialValue: 'active'
		})
	],
	preview: { select: { title: 'suffix', subtitle: 'status' } }
});

export const dori = defineType({
	name: 'dori',
	title: 'DORI distances (m)',
	type: 'object',
	description: 'Detect / Observe / Recognise / Identify at the widest lens.',
	options: { columns: 4 },
	fields: ['detect', 'observe', 'recognize', 'identify'].map((name) =>
		defineField({ name, type: 'number', validation: (r) => r.min(0) })
	)
});

export const sharedObjects = [altImage, seo, link, specGroup, download, variant, dori];
