import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { schemaTypes, singletonTypes } from './schemaTypes';
import { structure } from './structure';
import { resolve } from './presentation';
import { apiVersion, dataset, previewOrigin, projectId } from './env';

export default defineConfig({
	name: 'dhonaadhi',
	title: 'Dhonaadhi',
	projectId,
	dataset,
	plugins: [
		structureTool({ structure }),
		presentationTool({
			resolve,
			previewUrl: {
				initial: previewOrigin,
				previewMode: { enable: '/api/preview/enable' }
			}
		}),
		visionTool({ defaultApiVersion: apiVersion })
	],
	schema: {
		types: schemaTypes,
		templates: (prev) => [
			...prev.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
			{
				id: 'subcategory-in-category',
				title: 'Subcategory in category',
				schemaType: 'productSubcategory',
				parameters: [{ name: 'catId', type: 'string' }],
				value: ({ catId }: { catId: string }) => ({ category: { _type: 'reference', _ref: catId } })
			}
		]
	},
	document: {
		// Singletons can't be duplicated or deleted.
		actions: (prev, { schemaType }) =>
			singletonTypes.has(schemaType)
				? prev.filter(
						({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)
					)
				: prev
	}
});
