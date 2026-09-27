import { describe, expect, it } from 'vitest';
import {
	activeChips,
	cleared,
	parseSelection,
	queryParams,
	serializeSelection,
	without
} from './selector';

const parse = (s: string) => parseSelection(new URLSearchParams(s));

describe('product selector URL state', () => {
	it('round-trips a complex selection', () => {
		const url =
			'?formFactor=bullet,dome&mp=4-12&lightType=white&poe=1&audio=two-way&q=colour&sort=resolution&page=2';
		expect(serializeSelection(parse(url))).toBe(url);
	});

	it('drops unknown enum values and bad params instead of failing', () => {
		const sel = parse('lightType=laser,ir&sort=random&page=-4&mp=abc-8');
		expect(sel.values.lightType).toEqual(['ir']);
		expect(sel.sort).toBe('newest');
		expect(sel.page).toBe(1);
		expect(sel.ranges.resolutionMp).toEqual([null, 8]);
	});

	it('maps to GROQ params with every key present', () => {
		const p = queryParams(parse('mp=4-&ipRating=IP67&q=NB-8M'), {
			category: 'network-cameras',
			subcategory: null
		});
		expect(p.mpMin).toBe(4);
		expect(p.mpMax).toBeNull();
		expect(p.ipRating).toEqual(['IP67']);
		expect(p.series).toEqual([]);
		expect(p.poe).toBeNull();
		expect(p.q).toBe('NB-8M*');
		expect([p.start, p.end]).toEqual([0, 12]);
	});

	it('loads all pages up to the current one for infinite scroll', () => {
		const p = queryParams(parse('page=3'), { category: 'x', subcategory: 'y' }, 3);
		expect([p.start, p.end]).toEqual([0, 36]);
	});

	it('produces removable chips and resets paging on removal', () => {
		const sel = parse('series=pro,ultra&poe=1&page=3');
		const chips = activeChips(sel, { series: { pro: 'Pro series', ultra: 'Ultra series' } });
		expect(chips.map((c) => c.label)).toEqual(['Pro series', 'Ultra series', 'PoE powered']);
		const next = without(sel, chips[0]);
		expect(next.values.series).toEqual(['ultra']);
		expect(next.page).toBe(1);
		expect(serializeSelection(cleared(sel))).toBe('');
	});
});
