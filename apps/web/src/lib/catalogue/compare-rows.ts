import type { CompareQueryResult } from '@dhonaadhi/sanity-types';
import { audioOptions, deterrenceOptions, lensTypes, lightTypes, powerOptions } from './attributes';

type P = CompareQueryResult[number];
export type Row = { label: string; values: string[]; differs: boolean };
export type Group = { title: string; rows: Row[] };

const dash = '—';
const list = (v: string[] | null | undefined, map?: Record<string, string>) =>
	v?.length ? v.map((x) => map?.[x] ?? x).join(', ') : dash;
const num = (v: number | null | undefined, unit = '') =>
	v === null || v === undefined ? dash : `${v}${unit}`;

function lens(p: P) {
	if (!p.lensMm) return dash;
	return p.lensMmMax ? `${p.lensMm}–${p.lensMmMax} mm` : `${p.lensMm} mm`;
}

const spec: [string, string, (p: P) => string][] = [
	['Key specs', 'Resolution', (p) => num(p.resolutionMp, ' MP')],
	['Key specs', 'Sensor', (p) => p.sensor ?? dash],
	['Key specs', 'Lens', lens],
	[
		'Key specs',
		'Lens type',
		(p) => (p.lensType ? (lensTypes[p.lensType as keyof typeof lensTypes] ?? p.lensType) : dash)
	],
	['Key specs', 'Optical zoom', (p) => num(p.opticalZoom, '×')],
	[
		'Key specs',
		'Supplemental light',
		(p) =>
			p.lightType ? (lightTypes[p.lightType as keyof typeof lightTypes] ?? p.lightType) : dash
	],
	['Key specs', 'Light range', (p) => num(p.irDistanceM, ' m')],
	['Key specs', 'Channels / ports', (p) => num(p.channels)],
	['Key specs', 'Storage', (p) => p.storage ?? dash],
	['Distances (DORI)', 'Detect', (p) => num(p.dori?.detect, ' m')],
	['Distances (DORI)', 'Observe', (p) => num(p.dori?.observe, ' m')],
	['Distances (DORI)', 'Recognise', (p) => num(p.dori?.recognize, ' m')],
	['Distances (DORI)', 'Identify', (p) => num(p.dori?.identify, ' m')],
	['Build', 'Ingress', (p) => p.ipRating ?? dash],
	['Build', 'Vandal', (p) => p.ikRating ?? dash],
	['Build', 'Operating temp.', (p) => p.operatingTemp ?? dash],
	['Power & I/O', 'PoE', (p) => (p.poe ? 'Yes' : 'No')],
	['Power & I/O', 'Power', (p) => list(p.power, powerOptions)],
	['Power & I/O', 'Audio', (p) => list(p.audio, audioOptions)],
	['Power & I/O', 'Deterrence', (p) => list(p.deterrence, deterrenceOptions)],
	['Intelligence', 'Series', (p) => p.series ?? dash],
	['Intelligence', 'Form factor', (p) => p.formFactor ?? dash],
	['Intelligence', 'Technologies', (p) => list(p.technologies?.filter((t): t is string => !!t))],
	['Intelligence', 'AI functions', (p) => list(p.aiFunctions?.filter((t): t is string => !!t))]
];

/**
 * Builds grouped comparison rows. Rows where every product is "—" are dropped
 * (e.g. DORI for recorders); `differs` flags rows whose values are not all equal.
 */
export function compareRows(products: P[]): Group[] {
	const groups: Group[] = [];
	for (const [group, label, get] of spec) {
		const values = products.map(get);
		if (values.every((v) => v === dash)) continue;
		const row = { label, values, differs: new Set(values).size > 1 };
		const g = groups.find((x) => x.title === group);
		if (g) g.rows.push(row);
		else groups.push({ title: group, rows: [row] });
	}
	return groups;
}
