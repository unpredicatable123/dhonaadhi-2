import { describe, expect, it } from 'vitest';
import * as studio from '../../../../../studio/lib/enums';
import * as web from './attributes';

const values = (list: { value: string }[] | string[]) =>
	list.map((x) => (typeof x === 'string' ? x : x.value));

describe('frontend attribute labels stay in sync with the Studio schema', () => {
	it.each([
		['lensTypes', studio.lensTypes, web.lensTypes],
		['lightTypes', studio.lightTypes, web.lightTypes],
		['audioOptions', studio.audioOptions, web.audioOptions],
		['deterrenceOptions', studio.deterrenceOptions, web.deterrenceOptions],
		['powerOptions', studio.powerOptions, web.powerOptions],
		['ipRatings', studio.ipRatings, web.ipRatings],
		['ikRatings', studio.ikRatings, web.ikRatings]
	] as const)('%s', (_name, s, w) => {
		expect(Object.keys(w).sort()).toEqual(values(s as { value: string }[] | string[]).sort());
	});

	it('every filterable attribute in the Studio has a frontend definition', () => {
		expect(studio.filterAttributes.map((a) => a.value).sort()).toEqual(
			web.attributes.map((a) => a.key).sort()
		);
	});
});
