import { sharedObjects } from './objects/shared';
import { sectionTypes } from './sections';
import { productCategory, productSubcategory, productSeries } from './documents/catalogue';
import { product } from './documents/product';
import { technology, aiFunction, formFactor, solution, industry } from './documents/taxonomy';
import { siteSettings, navigation, footer, homePage, comingSoonPage } from './documents/site';

export const singletonTypes = new Set(['siteSettings', 'navigation', 'footer', 'homePage']);

export const schemaTypes = [
	...sharedObjects,
	...sectionTypes,
	siteSettings,
	navigation,
	footer,
	homePage,
	comingSoonPage,
	productCategory,
	productSubcategory,
	productSeries,
	product,
	technology,
	aiFunction,
	formFactor,
	solution,
	industry
];
