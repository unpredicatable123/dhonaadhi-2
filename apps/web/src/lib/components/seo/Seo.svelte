<script lang="ts">
	import { page } from '$app/state';
	import { imageUrl, type ImageData } from '$lib/sanity/image';

	/**
	 * Per-page meta. Title pattern: "{title} · {companyName}" (home: companyName first).
	 * Falls back to the site-wide SEO defaults from siteSettings.
	 */
	type Props = {
		title?: string | null;
		description?: string | null;
		image?: ImageData;
		/** Absolute or site-relative URL of a generated OG image (overrides `image`). */
		ogImage?: string;
		noIndex?: boolean | null;
		jsonLd?: Record<string, unknown>[];
		type?: 'website' | 'product';
	};

	let {
		title,
		description,
		image,
		ogImage,
		noIndex = false,
		jsonLd = [],
		type = 'website'
	}: Props = $props();

	const settings = $derived(page.data.settings);
	const company = $derived(settings?.companyName ?? '');
	const site = $derived((settings?.siteUrl ?? page.url.origin).replace(/\/$/, ''));
	const fullTitle = $derived(
		title ? `${title} · ${company}` : `${company} · ${settings?.seo?.title ?? ''}`
	);
	const desc = $derived(description ?? settings?.seo?.description ?? '');
	const canonical = $derived(`${site}${page.url.pathname}`);
	const img = $derived(
		ogImage
			? new URL(ogImage, site).href
			: imageUrl(image ?? settings?.seo?.image ?? null, 1200, 630)
	);
	const ld = $derived(
		[
			{
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: company,
				alternateName: settings?.brandName,
				url: site,
				logo: `${site}/brand/logo-light.svg`,
				...(settings?.email && { email: settings.email })
			},
			...jsonLd
		]
			.map((o) => JSON.stringify(o).replace(/</g, '\\u003c'))
			.join(',')
	);
	// Split so the component's own <script> block is not closed early.
	const jsonLdTag = $derived('<script type="application/ld+json">[' + ld + ']<' + '/script>');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if desc}<meta name="description" content={desc} />{/if}
	<link rel="canonical" href={canonical} />
	{#if noIndex}<meta name="robots" content="noindex" />{/if}
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={company} />
	<meta property="og:title" content={fullTitle} />
	{#if desc}<meta property="og:description" content={desc} />{/if}
	<meta property="og:url" content={canonical} />
	{#if img}
		<meta property="og:image" content={img} />
		<meta name="twitter:image" content={img} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD is serialised with < escaped -->
	{@html jsonLdTag}
</svelte:head>
