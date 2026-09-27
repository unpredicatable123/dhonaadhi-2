import type { Page } from '@playwright/test';

export const routes = {
	home: '/',
	hub: '/products',
	category: '/products/network-cameras',
	listing: '/products/network-cameras/bullet-cameras',
	pdp: '/products/network-cameras/bullet-cameras/nb-4m-b28l',
	compare: '/products/compare?ids=nb-4m-b28l,nb-8m-b28l',
	comingSoon: '/coming-soon/support',
	notFound: '/this-page-does-not-exist'
} as const;

/** Collects console errors and uncaught exceptions for the lifetime of the page. */
export function watchErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('console', (m) => {
		if (m.type() === 'error' && !/status of 404/.test(m.text())) errors.push(m.text());
	});
	page.on('pageerror', (e) => errors.push(e.message));
	return errors;
}
