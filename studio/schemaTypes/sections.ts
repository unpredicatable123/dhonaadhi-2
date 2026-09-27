import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity';
import { EyeOpenIcon } from '@sanity/icons/EyeOpen';
import { MoonIcon } from '@sanity/icons/Moon';
import { ThListIcon } from '@sanity/icons/ThList';
import { ExpandIcon } from '@sanity/icons/Expand';
import { BarChartIcon } from '@sanity/icons/BarChart';
import { DashboardIcon } from '@sanity/icons/Dashboard';
import { StarIcon } from '@sanity/icons/Star';
import { SearchIcon } from '@sanity/icons/Search';
import { CheckmarkCircleIcon } from '@sanity/icons/CheckmarkCircle';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';

const title = defineField({ name: 'title', type: 'string', validation: (r) => r.required() });
const lead = defineField({ name: 'lead', type: 'text', rows: 3 });
const anchor = defineField({
	name: 'anchor',
	type: 'string',
	description: 'Optional in-page id (letters, numbers, dashes).',
	validation: (r) => r.regex(/^[a-z0-9-]+$/)
});

const section = (
	name: string,
	sectionTitle: string,
	icon: typeof EyeOpenIcon,
	fields: FieldDefinition[]
) =>
	defineType({
		name,
		title: sectionTitle,
		type: 'object',
		icon,
		fields: [...fields, anchor],
		preview: {
			select: { t: 'title', h: 'headline' },
			prepare: ({ t, h }) => ({ title: sectionTitle, subtitle: h || t })
		}
	});

const detection = defineArrayMember({
	type: 'object',
	name: 'detection',
	fields: [
		defineField({
			name: 'label',
			type: 'string',
			options: { list: ['PERSON', 'VEHICLE', 'BICYCLE', 'PLATE', 'FACE'] },
			validation: (r) => r.required()
		}),
		defineField({
			name: 'confidence',
			type: 'number',
			validation: (r) => r.required().min(0).max(1)
		}),
		...['x', 'y', 'w', 'h'].map((n) =>
			defineField({
				name: n,
				type: 'number',
				description: '% of frame',
				validation: (r) => r.required().min(0).max(100)
			})
		)
	],
	preview: {
		select: { l: 'label', c: 'confidence' },
		prepare: ({ l, c }) => ({ title: `${l} ${c}` })
	}
});

export const heroAperture = section('heroAperture', 'Hero — Aperture', EyeOpenIcon, [
	defineField({ name: 'headline', type: 'string', validation: (r) => r.required().max(60) }),
	lead,
	defineField({ name: 'primaryCta', type: 'link' }),
	defineField({ name: 'secondaryCta', type: 'link' }),
	defineField({
		name: 'image',
		title: 'Night scene',
		type: 'altImage',
		validation: (r) => r.required()
	}),
	defineField({
		name: 'video',
		title: 'Night scene video (optional, muted loop)',
		type: 'file',
		options: { accept: 'video/mp4,video/webm' }
	}),
	defineField({ name: 'detections', type: 'array', of: [detection], validation: (r) => r.max(5) }),
	defineField({
		name: 'show3d',
		title: 'Show 3D camera (desktop)',
		type: 'boolean',
		initialValue: false
	})
]);

export const duskToNight = section('duskToNight', 'Dusk to Night', MoonIcon, [
	title,
	lead,
	defineField({ name: 'technology', type: 'reference', to: [{ type: 'technology' }] }),
	defineField({ name: 'dayImage', type: 'altImage', validation: (r) => r.required() }),
	defineField({
		name: 'conventionalImage',
		title: 'Night — conventional',
		type: 'altImage',
		validation: (r) => r.required()
	}),
	defineField({
		name: 'enhancedImage',
		title: 'Night — LumaNight',
		type: 'altImage',
		validation: (r) => r.required()
	}),
	defineField({
		name: 'conventionalLabel',
		type: 'string',
		initialValue: 'Conventional camera'
	}),
	defineField({ name: 'enhancedLabel', type: 'string', initialValue: 'LumaNight' })
]);

export const categoryRail = section('categoryRail', 'Category rail', ThListIcon, [
	title,
	lead,
	defineField({
		name: 'categories',
		description: 'Leave empty to show all categories in their CMS order.',
		type: 'array',
		of: [{ type: 'reference', to: [{ type: 'productCategory' }] }]
	})
]);

export const explodedView = section('explodedView', 'Exploded view', ExpandIcon, [
	title,
	lead,
	defineField({
		name: 'frames',
		description: 'Image sequence in order (≈120 WebP). Or use a base URL below.',
		type: 'array',
		of: [{ type: 'image' }]
	}),
	defineField({
		name: 'framesBaseUrl',
		type: 'string',
		description: 'e.g. /sequences/exploded/ — frames named 000.webp … {count-1}.webp'
	}),
	defineField({ name: 'frameCount', type: 'number', initialValue: 120 }),
	defineField({ name: 'poster', type: 'altImage', validation: (r) => r.required() }),
	defineField({
		name: 'callouts',
		type: 'array',
		of: [
			defineArrayMember({
				type: 'object',
				name: 'callout',
				fields: [
					defineField({ name: 'frame', type: 'number', validation: (r) => r.required().min(0) }),
					defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
					defineField({ name: 'body', type: 'string' }),
					defineField({
						name: 'x',
						type: 'number',
						description: '% from left',
						validation: (r) => r.min(0).max(100)
					}),
					defineField({
						name: 'y',
						type: 'number',
						description: '% from top',
						validation: (r) => r.min(0).max(100)
					})
				],
				preview: {
					select: { title: 'title', f: 'frame' },
					prepare: ({ title, f }) => ({ title, subtitle: `frame ${f}` })
				}
			})
		]
	})
]);

export const statsBand = section('statsBand', 'Stats band', BarChartIcon, [
	title,
	lead,
	defineField({
		name: 'stats',
		type: 'array',
		validation: (r) => r.min(2).max(4),
		of: [
			defineArrayMember({
				type: 'object',
				name: 'stat',
				fields: [
					defineField({ name: 'value', type: 'number', validation: (r) => r.required() }),
					defineField({ name: 'suffix', type: 'string' }),
					defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
					defineField({ name: 'trend', type: 'array', of: [{ type: 'number' }] })
				],
				preview: { select: { title: 'value', subtitle: 'label' } }
			})
		]
	})
]);

export const industriesMosaic = section('industriesMosaic', 'Industries mosaic', DashboardIcon, [
	title,
	lead,
	defineField({
		name: 'industries',
		type: 'array',
		of: [{ type: 'reference', to: [{ type: 'industry' }] }],
		validation: (r) => r.min(4).max(8)
	})
]);

export const featuredProducts = section('featuredProducts', 'Featured products', StarIcon, [
	title,
	lead,
	defineField({
		name: 'products',
		description: 'Leave empty to show the newest products.',
		type: 'array',
		of: [{ type: 'reference', to: [{ type: 'product' }] }],
		validation: (r) => r.max(12)
	})
]);

export const ctaSearch = section('ctaSearch', 'Find your product', SearchIcon, [
	title,
	lead,
	defineField({
		name: 'placeholder',
		type: 'string',
		initialValue: 'Model number, feature or use case'
	}),
	defineField({
		name: 'suggestions',
		type: 'array',
		of: [{ type: 'string' }],
		validation: (r) => r.max(6)
	})
]);

export const logoCloud = section('logoCloud', 'Trust band', CheckmarkCircleIcon, [
	title,
	defineField({
		name: 'items',
		type: 'array',
		of: [
			defineArrayMember({
				type: 'object',
				name: 'trustItem',
				fields: [
					defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
					defineField({
						name: 'detail',
						type: 'string',
						description: 'e.g. "Information security"'
					}),
					defineField({
						name: 'logo',
						type: 'altImage',
						description: 'Optional; text is shown when empty.'
					})
				],
				preview: { select: { title: 'name', subtitle: 'detail', media: 'logo' } }
			})
		]
	})
]);

export const richTextSection = section('richTextSection', 'Rich text', DocumentTextIcon, [
	title,
	defineField({
		name: 'body',
		type: 'array',
		of: [
			defineArrayMember({
				type: 'block',
				styles: [
					{ title: 'Normal', value: 'normal' },
					{ title: 'Heading', value: 'h3' },
					{ title: 'Quote', value: 'blockquote' }
				],
				marks: {
					annotations: [{ name: 'link', type: 'link' }]
				}
			})
		]
	})
]);

export const sectionTypes = [
	heroAperture,
	duskToNight,
	categoryRail,
	explodedView,
	statsBand,
	industriesMosaic,
	featuredProducts,
	ctaSearch,
	logoCloud,
	richTextSection
];

export const homeSectionTypes = sectionTypes.map((t) => t.name);
