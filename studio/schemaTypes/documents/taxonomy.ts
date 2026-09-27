import { defineField, defineType } from 'sanity';
import { BulbOutlineIcon } from '@sanity/icons/BulbOutline';
import { SparklesIcon } from '@sanity/icons/Sparkles';
import { CubeIcon } from '@sanity/icons/Cube';
import { CaseIcon } from '@sanity/icons/Case';
import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe';

const base = [
	defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
	defineField({
		name: 'slug',
		type: 'slug',
		options: { source: 'title', maxLength: 64 },
		validation: (r) => r.required()
	})
];

const iconField = defineField({
	name: 'icon',
	type: 'string',
	description: 'Lucide icon name (kebab-case), e.g. "moon", "scan-face".',
	validation: (r) => r.required().regex(/^[a-z0-9-]+$/)
});

export const technology = defineType({
	name: 'technology',
	title: 'Technology',
	type: 'document',
	icon: BulbOutlineIcon,
	fields: [
		...base,
		iconField,
		defineField({
			name: 'summary',
			type: 'text',
			rows: 3,
			validation: (r) => r.required().max(200)
		}),
		defineField({
			name: 'proofPoint',
			type: 'string',
			description: 'One measurable claim, e.g. "Colour at 0.0005 lux".',
			validation: (r) => r.max(60)
		}),
		defineField({ name: 'image', type: 'altImage' })
	],
	preview: { select: { title: 'title', subtitle: 'proofPoint' } }
});

export const aiFunction = defineType({
	name: 'aiFunction',
	title: 'AI function',
	type: 'document',
	icon: SparklesIcon,
	fields: [
		...base,
		iconField,
		defineField({ name: 'summary', type: 'text', rows: 2, validation: (r) => r.max(160) })
	],
	preview: { select: { title: 'title', subtitle: 'summary' } }
});

export const formFactor = defineType({
	name: 'formFactor',
	title: 'Form factor',
	type: 'document',
	icon: CubeIcon,
	fields: [
		...base,
		iconField,
		defineField({ name: 'summary', type: 'text', rows: 2, validation: (r) => r.max(160) })
	],
	preview: { select: { title: 'title', subtitle: 'summary' } }
});

/** Stage 2 — minimal so products and the home mosaic can reference them now. */
export const solution = defineType({
	name: 'solution',
	title: 'Solution',
	type: 'document',
	icon: CaseIcon,
	fields: [
		...base,
		defineField({
			name: 'axis',
			type: 'string',
			options: {
				list: ['industry', 'function', 'scenario'],
				layout: 'radio',
				direction: 'horizontal'
			},
			validation: (r) => r.required()
		}),
		defineField({
			name: 'industries',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'industry' }] }]
		}),
		defineField({ name: 'summary', type: 'text', rows: 3, validation: (r) => r.max(220) }),
		defineField({ name: 'image', type: 'altImage' })
	],
	preview: { select: { title: 'title', subtitle: 'axis', media: 'image' } }
});

export const industry = defineType({
	name: 'industry',
	title: 'Industry',
	type: 'document',
	icon: EarthGlobeIcon,
	fields: [
		...base,
		defineField({ name: 'summary', type: 'text', rows: 3, validation: (r) => r.max(220) }),
		defineField({ name: 'image', type: 'altImage', validation: (r) => r.required() })
	],
	preview: { select: { title: 'title', subtitle: 'summary', media: 'image' } }
});
