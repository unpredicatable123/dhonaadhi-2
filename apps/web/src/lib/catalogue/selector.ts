import { attributes, attributeByKey } from './attributes';

export const SORTS = ['newest', 'resolution', 'name'] as const;
export type Sort = (typeof SORTS)[number];
export const PAGE_SIZE = 12;

export type Selection = {
	values: Record<string, string[]>;
	ranges: Record<string, [number | null, number | null]>;
	bools: Record<string, boolean | null>;
	q: string | null;
	sort: Sort;
	page: number;
};

const list = (v: string | null) =>
	v
		? v
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean)
		: [];
const num = (v: string | undefined) => (v === undefined || v === '' || isNaN(+v) ? null : +v);

/** URL → selection. Unknown params are ignored, so old links never break. */
export function parseSelection(sp: URLSearchParams): Selection {
	const sel: Selection = { values: {}, ranges: {}, bools: {}, q: null, sort: 'newest', page: 1 };
	for (const a of attributes) {
		const raw = sp.get(a.param);
		if (a.kind === 'range') {
			const [lo, hi] = (raw ?? '').split('-');
			sel.ranges[a.key] = [num(lo), num(hi)];
		} else if (a.kind === 'bool') {
			sel.bools[a.key] = raw === '1' ? true : raw === '0' ? false : null;
		} else {
			sel.values[a.key] = list(raw).filter((v) => !a.options || v in a.options);
		}
	}
	const q = sp.get('q')?.trim();
	sel.q = q ? q.slice(0, 60) : null;
	const sort = sp.get('sort');
	sel.sort = (SORTS as readonly string[]).includes(sort ?? '') ? (sort as Sort) : 'newest';
	sel.page = Math.max(1, Math.min(50, Math.floor(num(sp.get('page') ?? undefined) ?? 1)));
	return sel;
}

/** Selection → URL search string (stable key order, defaults omitted). */
export function serializeSelection(sel: Selection): string {
	const sp = new URLSearchParams();
	for (const a of attributes) {
		if (a.kind === 'range') {
			const [lo, hi] = sel.ranges[a.key] ?? [null, null];
			if (lo !== null || hi !== null) sp.set(a.param, `${lo ?? ''}-${hi ?? ''}`);
		} else if (a.kind === 'bool') {
			const b = sel.bools[a.key];
			if (b !== null && b !== undefined) sp.set(a.param, b ? '1' : '0');
		} else if (sel.values[a.key]?.length) {
			sp.set(a.param, sel.values[a.key].join(','));
		}
	}
	if (sel.q) sp.set('q', sel.q);
	if (sel.sort !== 'newest') sp.set('sort', sel.sort);
	if (sel.page > 1) sp.set('page', String(sel.page));
	const s = sp.toString().replace(/%2C/g, ',');
	return s ? `?${s}` : '';
}

/**
 * Selection → GROQ params for the listing queries. Every param is always present
 * (empty array / null disables that condition in the static query).
 */
export function queryParams(
	sel: Selection,
	scope: { category: string | null; subcategory: string | null },
	pages = 1
) {
	const start = (sel.page - pages) * PAGE_SIZE;
	return {
		...scope,
		series: sel.values.series ?? [],
		formFactor: sel.values.formFactor ?? [],
		mpMin: sel.ranges.resolutionMp?.[0] ?? null,
		mpMax: sel.ranges.resolutionMp?.[1] ?? null,
		lensType: sel.values.lensType ?? [],
		lightType: sel.values.lightType ?? [],
		aiFunctions: sel.values.aiFunctions ?? [],
		ipRating: sel.values.ipRating ?? [],
		ikRating: sel.values.ikRating ?? [],
		poe: sel.bools.poe ?? null,
		audio: sel.values.audio ?? [],
		deterrence: sel.values.deterrence ?? [],
		power: sel.values.power ?? [],
		chMin: sel.ranges.channels?.[0] ?? null,
		chMax: sel.ranges.channels?.[1] ?? null,
		q: sel.q ? `${sel.q.replace(/[^\p{L}\p{N}\s-]/gu, '')}*` : null,
		start: Math.max(0, start),
		end: sel.page * PAGE_SIZE
	};
}

export type Chip = { key: string; value?: string; label: string };

/** Active filters as removable chips. `labels` resolves ref values (series/ai titles). */
export function activeChips(
	sel: Selection,
	labels: Record<string, Record<string, string>>
): Chip[] {
	const chips: Chip[] = [];
	for (const a of attributes) {
		if (a.kind === 'range') {
			const [lo, hi] = sel.ranges[a.key] ?? [null, null];
			if (lo !== null || hi !== null)
				chips.push({
					key: a.key,
					label: `${a.label}: ${lo ?? '…'}–${hi ?? '…'}${a.unit ? ` ${a.unit}` : ''}`
				});
		} else if (a.kind === 'bool') {
			if (sel.bools[a.key] !== null && sel.bools[a.key] !== undefined)
				chips.push({
					key: a.key,
					label: sel.bools[a.key] ? a.label : `No ${a.label.toLowerCase()}`
				});
		} else {
			for (const v of sel.values[a.key] ?? [])
				chips.push({ key: a.key, value: v, label: a.options?.[v] ?? labels[a.key]?.[v] ?? v });
		}
	}
	if (sel.q) chips.push({ key: 'q', label: `“${sel.q}”` });
	return chips;
}

/** Returns a new selection with one chip removed (page reset). */
export function without(sel: Selection, chip: Chip): Selection {
	const next: Selection = structuredClone(sel);
	next.page = 1;
	if (chip.key === 'q') next.q = null;
	else if (attributeByKey[chip.key]?.kind === 'range') next.ranges[chip.key] = [null, null];
	else if (attributeByKey[chip.key]?.kind === 'bool') next.bools[chip.key] = null;
	else next.values[chip.key] = (next.values[chip.key] ?? []).filter((v) => v !== chip.value);
	return next;
}

export function cleared(sel: Selection): Selection {
	return { values: {}, ranges: {}, bools: {}, q: null, sort: sel.sort, page: 1 };
}

export const activeCount = (sel: Selection) => activeChips(sel, {}).length;
