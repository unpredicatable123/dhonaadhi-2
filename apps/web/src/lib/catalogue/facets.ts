import { attributeByKey, type Attribute } from './attributes';

type RefValue = { value: string | null; title: string | null } | null;
export type FacetRow = {
	series: RefValue;
	formFactor: RefValue;
	resolutionMp: number | null;
	lensType: string | null;
	lightType: string | null;
	ipRating: string | null;
	ikRating: string | null;
	poe: boolean | null;
	audio: string[] | null;
	deterrence: string[] | null;
	power: string[] | null;
	channels: number | null;
	aiFunctions: RefValue[] | null;
};

export type FacetOption = { value: string; label: string; count: number };
export type Facet =
	| {
			key: string;
			label: string;
			ui: 'checkbox';
			param: string;
			options: FacetOption[];
			collapsed: boolean;
	  }
	| {
			key: string;
			label: string;
			ui: 'range';
			param: string;
			min: number;
			max: number;
			unit?: string;
			collapsed: boolean;
	  }
	| { key: string; label: string; ui: 'toggle'; param: string; count: number; collapsed: boolean };

type Config = {
	attribute: string | null;
	ui: string | null;
	label: string | null;
	collapsed: boolean | null;
};

function values(row: FacetRow, a: Attribute): { value: string; label: string }[] {
	const v = row[a.key as keyof FacetRow];
	if (v === null || v === undefined) return [];
	if (a.kind === 'ref') {
		const arr = (Array.isArray(v) ? v : [v]) as RefValue[];
		return arr
			.filter((r): r is { value: string; title: string } => !!r?.value)
			.map((r) => ({ value: r.value, label: r.title ?? r.value }));
	}
	const arr = (Array.isArray(v) ? v : [v]) as string[];
	return arr.map((x) => ({ value: x, label: a.options?.[x] ?? x }));
}

/**
 * Builds the filter panel from the subcategory's filterConfig and the products in scope.
 * Facets with fewer than two distinct values are hidden — a filter that can't narrow
 * the list is noise.
 */
export function buildFacets(config: Config[], rows: FacetRow[]): Facet[] {
	const out: Facet[] = [];
	for (const c of config) {
		const a = c.attribute ? attributeByKey[c.attribute] : undefined;
		if (!a) continue;
		const label = c.label ?? a.label;
		const collapsed = c.collapsed ?? false;
		if (a.kind === 'range') {
			const nums = rows
				.map((r) => r[a.key as keyof FacetRow])
				.filter((n): n is number => typeof n === 'number');
			if (new Set(nums).size < 2) continue;
			out.push({
				key: a.key,
				label,
				ui: 'range',
				param: a.param,
				min: Math.min(...nums),
				max: Math.max(...nums),
				unit: a.unit,
				collapsed
			});
		} else if (a.kind === 'bool') {
			const count = rows.filter((r) => r[a.key as keyof FacetRow] === true).length;
			if (count === 0 || count === rows.length) continue;
			out.push({ key: a.key, label, ui: 'toggle', param: a.param, count, collapsed });
		} else {
			const counts = new Map<string, FacetOption>();
			for (const r of rows) {
				for (const v of values(r, a)) {
					const o = counts.get(v.value) ?? { ...v, count: 0 };
					o.count += 1;
					counts.set(v.value, o);
				}
			}
			const options = [...counts.values()].sort((x, y) => {
				const order = a.options ? Object.keys(a.options) : null;
				return order
					? order.indexOf(x.value) - order.indexOf(y.value)
					: y.count - x.count || x.label.localeCompare(y.label);
			});
			if (options.length < 2) continue;
			out.push({ key: a.key, label, ui: 'checkbox', param: a.param, options, collapsed });
		}
	}
	return out;
}

/** value → label lookups for chips (series and AI function titles come from content). */
export function facetLabels(facets: Facet[]): Record<string, Record<string, string>> {
	return Object.fromEntries(
		facets
			.filter((f) => f.ui === 'checkbox')
			.map((f) => [f.key, Object.fromEntries(f.options.map((o) => [o.value, o.label]))])
	);
}
