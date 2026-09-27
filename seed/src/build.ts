// Builds seed/data/dataset.ndjson (+ assets.json) from the authored seed content.
import fs from 'node:fs';
import path from 'node:path';
import { Assets, dataDir } from './lib/assets.js';
import { ids, key, keyedRef, link, ref, slug } from './lib/docs.js';
import { productDoc } from './lib/products.js';
import { cameras } from './data/products-cameras.js';
import { devices } from './data/products-devices.js';
import * as tax from './data/taxonomy.js';
import { brand, comingSoon, footer, home, navigation } from './data/site.js';
import photos from '../data/photos.json' with { type: 'json' };

const assets = new Assets();
const docs: Record<string, unknown>[] = [];
const push = (d: Record<string, unknown>) => docs.push(d);
const products = [...cameras, ...devices];
const img = (rel: string, alt: string, credit?: string) =>
	assets.image(rel, credit).then((id) => Assets.ref(id, alt));
const orderRank = (i: number) => `0|${String(100000 + i * 1000).padStart(6, '0')}:`;

// ── Integrity checks: fail fast on broken references in authored data ──
const models = new Set(products.map((p) => p.model));
if (models.size !== products.length) throw new Error('Duplicate model numbers');
for (const p of products) {
	if (!tax.subcategories.some((s) => s.slug === p.subcategory && s.category === p.category))
		throw new Error(`${p.model}: bad subcategory`);
	for (const b of p.bundle ?? [])
		if (!models.has(b.model)) throw new Error(`${p.model}: bundle ${b.model} missing`);
	if (!fs.existsSync(path.join(dataDir, `images/renders/${p.render}-a.webp`)))
		throw new Error(`${p.model}: render ${p.render} missing — run pnpm render`);
}

// ── Taxonomy ──
for (const t of tax.technologies)
	push({
		_id: ids.technology(t.slug),
		_type: 'technology',
		title: t.title,
		slug: slug(t.slug),
		icon: t.icon,
		summary: t.summary,
		proofPoint: t.proofPoint
	});
for (const a of tax.aiFunctions)
	push({
		_id: ids.aiFunction(a.slug),
		_type: 'aiFunction',
		title: a.title,
		slug: slug(a.slug),
		icon: a.icon,
		summary: a.summary
	});
for (const f of tax.formFactors)
	push({
		_id: ids.formFactor(f.slug),
		_type: 'formFactor',
		title: f.title,
		slug: slug(f.slug),
		icon: f.icon,
		summary: f.summary
	});
for (const [i, c] of tax.categories.entries()) {
	push({
		_id: ids.category(c.slug),
		_type: 'productCategory',
		orderRank: orderRank(i),
		title: c.title,
		slug: slug(c.slug),
		icon: c.icon,
		tagline: c.tagline,
		description: c.description,
		heroImage: await img(`images/renders/${c.render}-a.webp`, `${c.title}: product render`),
		seo: { _type: 'seo', description: c.description.slice(0, 158) }
	});
}
for (const [i, s] of tax.subcategories.entries()) {
	const cat = tax.categories.find((c) => c.slug === s.category)!;
	push({
		_id: ids.subcategory(s.slug),
		_type: 'productSubcategory',
		orderRank: orderRank(i),
		title: s.title,
		slug: slug(s.slug),
		category: ref(ids.category(s.category)),
		description: s.description,
		heroImage: await img(
			`images/renders/${products.find((p) => p.subcategory === s.slug)?.render ?? cat.render}-a.webp`,
			`${s.title}: product render`
		),
		filterConfig: s.filters.map((f, j) => ({
			_type: 'filter',
			_key: key(s.slug, f.attribute, j),
			attribute: f.attribute,
			ui: f.ui,
			collapsed: j > 5
		}))
	});
}
for (const s of tax.series) {
	push({
		_id: ids.series(s.slug),
		_type: 'productSeries',
		title: s.title,
		slug: slug(s.slug),
		tier: s.tier,
		tagline: s.tagline,
		subcategories: s.subcategories.map((x, i) => keyedRef(ids.subcategory(x), i))
	});
}
for (const ind of tax.industries) {
	const ph = photos[ind.photo as keyof typeof photos];
	push({
		_id: ids.industry(ind.slug),
		_type: 'industry',
		title: ind.title,
		slug: slug(ind.slug),
		summary: ind.summary,
		image: await img(
			`images/photos/${ind.photo}.webp`,
			ph.alt,
			`${ph.creator ?? ph.source} · ${ph.license.toUpperCase()} via Openverse`
		)
	});
}
for (const s of tax.solutions) {
	push({
		_id: ids.solution(s.slug),
		_type: 'solution',
		title: s.title,
		slug: slug(s.slug),
		axis: s.axis,
		summary: s.summary,
		industries: s.industries.map((x, i) => keyedRef(ids.industry(x), i))
	});
}

// ── Products ──
for (const p of products) push(await productDoc(p, products, assets));

// ── Site ──
const brandDir = path.join(dataDir, 'images/brand');
fs.mkdirSync(brandDir, { recursive: true });
for (const f of ['logo-dark.svg', 'logo-light.svg', 'monogram-dark.svg'])
	fs.copyFileSync(path.resolve(dataDir, '../../apps/web/static/brand', f), path.join(brandDir, f));
const plain = async (rel: string) => ({ _type: 'image', asset: ref(await assets.image(rel)) });
push({
	_id: 'siteSettings',
	_type: 'siteSettings',
	companyName: brand.companyName,
	brandName: brand.brandName,
	siteUrl: brand.siteUrl,
	email: brand.email,
	logoDark: await plain('images/brand/logo-dark.svg'),
	logoLight: await plain('images/brand/logo-light.svg'),
	monogram: await plain('images/brand/monogram-dark.svg'),
	seo: {
		_type: 'seo',
		...brand.seo,
		image: await img('images/scenes/city-hero.webp', home.hero.alt)
	},
	motion: { smoothScroll: true, pageTransitions: true, grain: true }
});
push({
	_id: 'navigation',
	_type: 'navigation',
	items: navigation.items.map((n, i) => ({
		_type: 'navItem',
		_key: key('nav', i),
		link: link(n.label, n.to),
		mega: n.mega,
		...(n.columns && {
			columns: n.columns.map((c, j) => ({
				_type: 'megaColumn',
				_key: key('col', i, j),
				heading: c.heading,
				links: c.links.map((l, k) => link(l.label, l.to, key(i, j, k)))
			}))
		}),
		...(n.featured && { featured: ref(ids.product(n.featured)) })
	})),
	utility: navigation.utility.map((l) => link(l.label, l.to)),
	cta: link(navigation.cta.label, navigation.cta.to)
});
push({
	_id: 'footer',
	_type: 'footer',
	statement: footer.statement,
	newsletterText: footer.newsletterText,
	columns: footer.columns.map((c, i) => ({
		_type: 'megaColumn',
		_key: key('fcol', i),
		heading: c.heading,
		links:
			c.links === 'categories'
				? tax.categories.map((cat) => link(cat.title, `category:${cat.slug}`))
				: c.links.map((l) => link(l.label, l.to))
	})),
	legal: footer.legal.map((l) => link(l.label, l.to))
});
for (const c of comingSoon) {
	push({
		_id: ids.comingSoon(c.section),
		_type: 'comingSoonPage',
		section: c.section,
		title: c.title,
		lead: c.lead,
		eta: c.eta,
		links: [
			link('Browse products', '/products', key(c.section, 1)),
			link('Compare products', '/products/compare', key(c.section, 2))
		]
	});
}

// ── Home page ──
// Hand-placed on the hero photo (percent of the full frame).
const detections: { label: 'PERSON' | 'VEHICLE'; x: number; y: number; w: number; h: number }[] = [
	{ label: 'PERSON', x: 59.4, y: 52, w: 12.9, h: 47 },
	{ label: 'PERSON', x: 81.6, y: 57.6, w: 15, h: 41.4 },
	{ label: 'VEHICLE', x: 47.6, y: 52, w: 4.6, h: 5.6 }
];
const credit = (key: keyof typeof photos) =>
	`${photos[key].creator ?? photos[key].source} · ${photos[key].license.toUpperCase()} via Openverse`;
const callouts = JSON.parse(
	fs.readFileSync(path.join(dataDir, 'images/exploded-callouts.json'), 'utf8')
) as { frame: number; title: string; body: string; x: number; y: number }[];
const r1 = (n: number) => Math.round(n * 10) / 10;
const sections = [
	{
		_type: 'heroAperture',
		headline: home.hero.headline,
		lead: home.hero.lead,
		primaryCta: link(home.hero.primary.label, home.hero.primary.to),
		secondaryCta: link(home.hero.secondary.label, home.hero.secondary.to),
		image: await img('images/photos/hero-street.webp', home.hero.alt, credit('hero-street')),
		detections: detections.map((d, i) => ({
			_type: 'detection',
			_key: key('det', i),
			label: d.label,
			confidence: home.hero.confidences[d.label],
			x: r1(d.x),
			y: r1(d.y),
			w: r1(d.w),
			h: r1(d.h)
		})),
		show3d: false
	},
	{
		_type: 'logoCloud',
		title: home.trust.title,
		items: home.trust.items.map((t, i) => ({ _type: 'trustItem', _key: key('trust', i), ...t }))
	},
	{ _type: 'categoryRail', title: home.rail.title, lead: home.rail.lead, categories: [] },
	{
		_type: 'duskToNight',
		title: home.dusk.title,
		lead: home.dusk.lead,
		technology: ref(ids.technology('lumanight')),
		dayImage: await img('images/scenes/street-dusk.webp', home.dusk.dayAlt, credit('night-street')),
		conventionalImage: await img(
			'images/scenes/street-conventional.webp',
			home.dusk.convAlt,
			credit('night-street')
		),
		enhancedImage: await img(
			'images/scenes/street-luma.webp',
			home.dusk.lumaAlt,
			credit('night-street')
		),
		conventionalLabel: 'Conventional camera',
		enhancedLabel: 'LumaNight'
	},
	{
		_type: 'explodedView',
		title: home.exploded.title,
		lead: home.exploded.lead,
		framesBaseUrl: '/sequences/exploded/',
		frameCount: 120,
		poster: await img(
			'images/exploded-poster.webp',
			'An NB-8M-B28L bullet camera, fully assembled'
		),
		callouts: callouts.map((c, i) => ({
			_type: 'callout',
			_key: key('callout', i),
			frame: c.frame,
			title: c.title,
			body: c.body,
			x: c.x,
			y: c.y
		}))
	},
	{
		_type: 'statsBand',
		title: home.stats.title,
		lead: home.stats.lead,
		stats: home.stats.items.map((s, i) => ({ _type: 'stat', _key: key('stat', i), ...s }))
	},
	{
		_type: 'featuredProducts',
		title: home.featured.title,
		lead: home.featured.lead,
		products: home.featured.models.map((m, i) => keyedRef(ids.product(m), i))
	},
	{
		_type: 'industriesMosaic',
		title: home.industries.title,
		lead: home.industries.lead,
		industries: tax.industries.map((x, i) => keyedRef(ids.industry(x.slug), i))
	},
	{
		_type: 'ctaSearch',
		title: home.cta.title,
		lead: home.cta.lead,
		placeholder: home.cta.placeholder,
		suggestions: home.cta.suggestions
	}
];
push({
	_id: 'homePage',
	_type: 'homePage',
	title: 'Home',
	sections: sections.map((s, i) => ({ ...s, _key: key('section', s._type, i) })),
	seo: { _type: 'seo', title: brand.seo.title, description: brand.seo.description }
});

// ── Write ──
const assetDocs = [...assets.images.values(), ...assets.files.values()];
const lines = [...docs, ...assetDocs.map(({ localPath: _l, ...a }) => a)].map((d) =>
	JSON.stringify(d)
);
fs.writeFileSync(path.join(dataDir, 'dataset.ndjson'), lines.join('\n') + '\n');
fs.writeFileSync(
	path.join(dataDir, 'assets.json'),
	JSON.stringify(
		assetDocs.map((a) => ({
			_id: a._id,
			_type: a._type,
			file: path.relative(dataDir, a.localPath).replace(/\\/g, '/'),
			creditLine: 'creditLine' in a ? a.creditLine : undefined
		})),
		null,
		'\t'
	)
);
const count = (t: string) => docs.filter((d) => d._type === t).length;
console.log(
	`dataset: ${docs.length} documents (${count('product')} products, ${count('productCategory')} categories, ${count('productSubcategory')} subcategories), ${assets.images.size} images, ${assets.files.size} files`
);
