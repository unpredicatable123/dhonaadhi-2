import type { Crumb } from '$lib/components/ui/Breadcrumbs.svelte';

export function breadcrumbList(items: Crumb[], site: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.label,
			item: new URL(c.href, site).href
		}))
	};
}
