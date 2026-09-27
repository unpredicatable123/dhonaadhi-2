/**
 * Filterable attributes (mirrors studio/lib/enums.ts; attributes.spec.ts keeps them in sync).
 * `param` is the URL key, `kind` how the value is stored on the product.
 */
export type AttributeKind = 'ref' | 'enum' | 'multi' | 'bool' | 'range';

export type Attribute = {
	key: string;
	param: string;
	label: string;
	kind: AttributeKind;
	unit?: string;
	options?: Record<string, string>;
};

export const lensTypes = {
	fixed: 'Fixed',
	'manual-varifocal': 'Manual varifocal',
	'motorized-varifocal': 'Motorised varifocal',
	'multi-lens': 'Multi-lens'
};
export const lightTypes = { ir: 'Infrared', white: 'White light', hybrid: 'Hybrid', none: 'None' };
export const audioOptions = {
	mic: 'Built-in mic',
	'dual-mic': 'Dual-mic array',
	speaker: 'Speaker',
	'two-way': 'Two-way audio'
};
export const deterrenceOptions = {
	'audio-alarm': 'Audio alarm',
	'white-strobe': 'White strobe',
	'red-blue-strobe': 'Red/blue strobe'
};
export const powerOptions = {
	poe: 'PoE',
	dc12: '12 V DC',
	ac24: '24 V AC',
	solar: 'Solar',
	cellular: '4G'
};
export const ipRatings = { IP54: 'IP54', IP66: 'IP66', IP67: 'IP67', IP68: 'IP68' };
export const ikRatings = { IK08: 'IK08', IK10: 'IK10' };

export const attributes: Attribute[] = [
	{ key: 'series', param: 'series', label: 'Series', kind: 'ref' },
	{ key: 'formFactor', param: 'formFactor', label: 'Form factor', kind: 'ref' },
	{ key: 'resolutionMp', param: 'mp', label: 'Resolution', kind: 'range', unit: 'MP' },
	{ key: 'lensType', param: 'lensType', label: 'Lens', kind: 'enum', options: lensTypes },
	{
		key: 'lightType',
		param: 'lightType',
		label: 'Supplemental light',
		kind: 'enum',
		options: lightTypes
	},
	{ key: 'aiFunctions', param: 'aiFunctions', label: 'AI functions', kind: 'ref' },
	{ key: 'ipRating', param: 'ipRating', label: 'Ingress', kind: 'enum', options: ipRatings },
	{
		key: 'ikRating',
		param: 'ikRating',
		label: 'Vandal resistance',
		kind: 'enum',
		options: ikRatings
	},
	{ key: 'poe', param: 'poe', label: 'PoE powered', kind: 'bool' },
	{ key: 'audio', param: 'audio', label: 'Audio', kind: 'multi', options: audioOptions },
	{
		key: 'deterrence',
		param: 'deterrence',
		label: 'Active deterrence',
		kind: 'multi',
		options: deterrenceOptions
	},
	{ key: 'power', param: 'power', label: 'Power', kind: 'multi', options: powerOptions },
	{ key: 'channels', param: 'ch', label: 'Channels / ports', kind: 'range' }
];

export const attributeByKey = Object.fromEntries(attributes.map((a) => [a.key, a])) as Record<
	string,
	Attribute
>;
