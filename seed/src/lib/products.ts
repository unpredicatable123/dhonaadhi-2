import fs from 'node:fs';
import path from 'node:path';
import type { ProductDef } from '../data/types.js';
import { aiFunctions, technologies } from '../data/taxonomy.js';
import { brand } from '../data/site.js';
import { Assets, dataDir } from './assets.js';
import { ids, key, keyedRef, ref, slug, slugify } from './docs.js';
import { dori, fullSpecs } from './specs.js';
import { datasheet, textDoc } from './pdf.js';

const angleAlt = {
	a: 'three-quarter front view',
	b: 'three-quarter view from the right',
	c: 'high three-quarter view'
} as const;
const AI_TO_SOLUTION: Record<string, string> = {
	'perimeter-protection': 'perimeter-protection',
	'people-counting': 'people-counting',
	'face-recognition': 'access-entrance',
	'queue-management': 'people-counting'
};

function cardSpecs(p: ProductDef) {
	if (p.cardSpecs) return p.cardSpecs;
	const out: { label: string; value: string; unit?: string }[] = [];
	if (p.mp) out.push({ label: 'Resolution', value: String(p.mp), unit: 'MP' });
	if (p.zoom) out.push({ label: 'Zoom', value: String(p.zoom), unit: '×' });
	else if (p.lens)
		out.push({
			label: 'Lens',
			value: p.lens[1] ? `${p.lens[0]}–${p.lens[1]}` : String(p.lens[0]),
			unit: 'mm'
		});
	if (p.light && p.light !== 'none')
		out.push({ label: 'Light', value: String(p.lightRange ?? 30), unit: 'm' });
	else if (p.ip) out.push({ label: 'Rating', value: p.ip });
	return out.slice(0, 3);
}

async function downloads(p: ProductDef, s: string, assets: Assets, hero: string) {
	const dir = path.join(dataDir, 'files', s);
	fs.mkdirSync(dir, { recursive: true });
	const titles = new Map(technologies.map((t) => [t.slug, t.title]));
	const ai = new Map(aiFunctions.map((a) => [a.slug, a.title]));
	const specs = fullSpecs(
		p,
		(p.tech ?? []).map((t) => titles.get(t) ?? t),
		(p.ai ?? []).map((a) => ai.get(a) ?? a)
	);
	const date = p.release;
	const version = p.status === 'discontinued' ? 'V5.4.2' : p.status === 'new' ? 'V6.0.1' : 'V5.8.3';
	const out: Record<string, unknown>[] = [];

	const ds = path.join(dir, `${s}-datasheet.pdf`);
	fs.writeFileSync(
		ds,
		await datasheet({
			brand: brand.brandName,
			company: brand.companyName,
			model: p.model,
			name: p.name,
			summary: p.summary,
			highlights: p.highlights,
			specs,
			image: hero,
			date
		})
	);
	const qs = path.join(dir, `${s}-quick-start.pdf`);
	fs.writeFileSync(
		qs,
		await textDoc({
			brand: brand.brandName,
			company: brand.companyName,
			label: 'QUICK START GUIDE',
			title: `${p.model} quick start`,
			subtitle: p.name,
			date,
			sections: [
				{
					heading: 'In the box',
					items: [
						'Device',
						'Mounting template and screws',
						'Waterproof connector kit (outdoor models)',
						'Regulatory information'
					]
				},
				{
					heading: 'Install',
					items: [
						'Check the mounting surface can hold three times the device weight.',
						'Drill using the template, route the cable, and fix the base.',
						p.poe
							? 'Connect a PoE switch or recorder port; the status LED turns solid when ready.'
							: 'Connect the supplied power adapter; the status LED turns solid when ready.',
						'Open the Dhonaadhi app, scan the QR code on the label and set a strong admin password.'
					]
				},
				{
					heading: 'Next steps',
					items: [
						'Update to the latest firmware from the product page.',
						'Configure detection zones and schedules in the web interface.'
					]
				}
			]
		})
	);
	out.push(
		{
			_key: key(s, 'ds'),
			_type: 'download',
			title: `${p.model} datasheet`,
			kind: 'datasheet',
			file: { _type: 'file', asset: ref(assets.file(path.relative(dataDir, ds))) },
			version: 'Rev. B',
			date,
			language: 'EN'
		},
		{
			_key: key(s, 'qs'),
			_type: 'download',
			title: 'Quick start guide',
			kind: 'manual',
			file: { _type: 'file', asset: ref(assets.file(path.relative(dataDir, qs))) },
			version: 'Rev. A',
			date,
			language: 'EN'
		}
	);
	if (p.kind !== 'switch' && p.kind !== 'kit') {
		const fw = path.join(dir, `${s}-firmware-notes.pdf`);
		fs.writeFileSync(
			fw,
			await textDoc({
				brand: brand.brandName,
				company: brand.companyName,
				label: 'FIRMWARE RELEASE NOTES',
				title: `Firmware ${version}`,
				subtitle: `${p.model} · ${p.name}`,
				date,
				sections: [
					{
						heading: 'Improvements',
						items: [
							'Faster boot and reconnection after power loss.',
							'Improved detection accuracy in rain and snow.',
							'TLS 1.3 by default for all web and API traffic.'
						]
					},
					{
						heading: 'Fixes',
						items: [
							'Resolved time drift when NTP is unreachable.',
							'Fixed an issue where schedules were not applied after a restore.'
						]
					},
					{
						heading: 'Before you upgrade',
						items: [
							'Export the configuration.',
							'Do not remove power during the upgrade (about 3 minutes).'
						]
					}
				]
			})
		);
		out.push({
			_key: key(s, 'fw'),
			_type: 'download',
			title: `Firmware ${version} release notes`,
			kind: 'firmware',
			file: { _type: 'file', asset: ref(assets.file(path.relative(dataDir, fw))) },
			version,
			date,
			language: 'EN'
		});
	}
	for (const d of out) {
		const id = (d.file as { asset: { _ref: string } }).asset._ref;
		d.sizeBytes = assets.size(id);
	}
	return { downloads: out, specs };
}

export async function productDoc(p: ProductDef, all: ProductDef[], assets: Assets) {
	const s = slugify(p.model);
	const angle = p.angle ?? 'a';
	const others = (['a', 'b', 'c'] as const).filter((a) => a !== angle);
	const heroRel = `images/renders/${p.render}-${angle}.webp`;
	const heroId = await assets.image(heroRel);
	const gallery = [];
	for (const a of others) {
		gallery.push({
			...Assets.ref(
				await assets.image(`images/renders/${p.render}-${a}.webp`),
				`${p.model} ${p.name}, ${angleAlt[a]}`
			),
			_key: key(s, a)
		});
	}
	const spinFrames = [];
	if (p.spin) {
		const dir = path.join(dataDir, 'images/spin', p.spin);
		for (const f of fs.readdirSync(dir).sort()) {
			spinFrames.push({
				_type: 'image',
				_key: key(s, f),
				asset: ref(await assets.image(`images/spin/${p.spin}/${f}`))
			});
		}
	}
	const { downloads: dl, specs } = await downloads(p, s, assets, path.join(dataDir, heroRel));
	const sameSub = all.filter(
		(o) => o.subcategory === p.subcategory && o.model !== p.model && o.status !== 'discontinued'
	);
	const byDistance = [...sameSub].sort(
		(a, b) => Math.abs((a.mp ?? 0) - (p.mp ?? 0)) - Math.abs((b.mp ?? 0) - (p.mp ?? 0))
	);
	const related = all
		.filter(
			(o) =>
				o.category === p.category && o.subcategory !== p.subcategory && o.status !== 'discontinued'
		)
		.slice(0, 2);
	const solutions = [...new Set((p.ai ?? []).map((a) => AI_TO_SOLUTION[a]).filter(Boolean))];

	return {
		_id: ids.product(p.model),
		_type: 'product',
		modelNumber: p.model,
		name: p.name,
		slug: slug(s),
		status: p.status ?? 'active',
		releaseDate: p.release,
		category: ref(ids.category(p.category)),
		subcategory: ref(ids.subcategory(p.subcategory)),
		...(p.series && { series: ref(ids.series(p.series)) }),
		shortDescription: p.summary,
		highlights: p.highlights,
		cardSpecs: cardSpecs(p).map((c, i) => ({ _type: 'cardSpec', _key: key(s, 'card', i), ...c })),
		heroImage: Assets.ref(heroId, `${p.model} ${p.name}, ${angleAlt[angle]}`),
		gallery,
		...(spinFrames.length && { spinFrames }),
		...(p.mp && { resolutionMp: p.mp }),
		...(p.sensor && { sensor: `${p.sensor} progressive-scan CMOS` }),
		...(p.lens && { lensMm: p.lens[0] }),
		...(p.lens?.[1] && { lensMmMax: p.lens[1] }),
		...(p.lensType && { lensType: p.lensType }),
		...(p.zoom && { opticalZoom: p.zoom }),
		...(p.light && { lightType: p.light }),
		...(p.light && p.light !== 'none' && { irDistanceM: p.lightRange ?? 30 }),
		...(p.ip && { ipRating: p.ip }),
		...(p.ik && { ikRating: p.ik }),
		poe: p.poe ?? false,
		audio: p.audio ?? [],
		deterrence: p.deterrence ?? [],
		power: p.power ?? [],
		...(p.channels && { channels: p.channels }),
		...(p.storage && { storage: p.storage }),
		operatingTemp: p.temp ?? '−30 °C to 60 °C',
		...(p.mp &&
			p.lens &&
			p.sensor && { dori: { _type: 'dori', ...dori(p.mp, p.lens[1] ?? p.lens[0], p.sensor) } }),
		fullSpecs: specs.map((g, i) => ({
			_type: 'specGroup',
			_key: key(s, g.group, i),
			group: g.group,
			rows: g.rows.map((r, j) => ({ _type: 'specRow', _key: key(s, g.group, j), ...r }))
		})),
		...(p.form && { formFactor: ref(ids.formFactor(p.form)) }),
		technologies: (p.tech ?? []).map((t, i) => keyedRef(ids.technology(t), i)),
		aiFunctions: (p.ai ?? []).map((a, i) => keyedRef(ids.aiFunction(a), i)),
		variants: (p.variants ?? []).map((v, i) => ({
			_type: 'variant',
			_key: key(s, 'v', i),
			status: 'active',
			...v
		})),
		relatedProducts: [...byDistance.slice(3, 5), ...related].map((o, i) =>
			keyedRef(ids.product(o.model), i)
		),
		comparedWith: byDistance.slice(0, 3).map((o, i) => keyedRef(ids.product(o.model), i)),
		relatedSolutions: solutions.map((x, i) => keyedRef(ids.solution(x), i)),
		...(p.bundle && {
			bundleItems: p.bundle.map((b, i) => ({
				_type: 'bundleItem',
				_key: key(s, 'b', i),
				product: ref(ids.product(b.model)),
				quantity: b.quantity
			}))
		}),
		downloads: dl,
		seo: { _type: 'seo', title: `${p.model} ${p.name}`, description: p.summary.slice(0, 158) }
	};
}
