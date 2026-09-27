import type { ProductDef } from '../data/types.js';

/** Sensor widths (mm) for common optical formats. */
const SENSOR_WIDTH: Record<string, number> = {
	'1/1.2″': 10.7,
	'1/1.8″': 7.2,
	'1/2.4″': 5.9,
	'1/2.7″': 5.4,
	'1/2.8″': 5.6,
	'1/3″': 4.8
};

/** IEC 62676-4 pixel densities (px/m) for Detect / Observe / Recognise / Identify. */
const DORI_DENSITY = { detect: 25, observe: 63, recognize: 125, identify: 250 } as const;

/** Standard sensor resolutions per megapixel class; other values fall back to 16:9 maths. */
const RESOLUTIONS: Record<number, [number, number]> = {
	2: [1920, 1080],
	4: [2560, 1440],
	5: [2592, 1944],
	6: [3200, 1800],
	8: [3840, 2160],
	12: [4000, 3000],
	16: [5120, 3200]
};

export function resolution(mp: number): [number, number] {
	if (RESOLUTIONS[mp]) return RESOLUTIONS[mp];
	const w = Math.round(Math.sqrt((mp * 1e6 * 16) / 9));
	return [w, Math.round((w * 9) / 16)];
}

export function horizontalPixels(mp: number): number {
	return resolution(mp)[0];
}

/**
 * Distance (m) at which the scene still has `density` px/m horizontally:
 * d = pixels × focal / (density × sensorWidth). Uses the widest (shortest) focal length.
 */
export function dori(mp: number, lensMm: number, sensor: string) {
	const w = horizontalPixels(mp);
	const sw = SENSOR_WIDTH[sensor] ?? 5.4;
	const at = (density: number) => Math.round((w * lensMm) / (density * sw));
	return {
		detect: at(DORI_DENSITY.detect),
		observe: at(DORI_DENSITY.observe),
		recognize: at(DORI_DENSITY.recognize),
		identify: at(DORI_DENSITY.identify)
	};
}

export function horizontalFov(lensMm: number, sensor: string): number {
	const sw = SENSOR_WIDTH[sensor] ?? 5.4;
	return Math.round((2 * Math.atan(sw / (2 * lensMm)) * 180) / Math.PI);
}

type Row = { key: string; value: string };
type Group = { group: string; rows: Row[] };

const lightLabel = {
	ir: 'Infrared (850 nm)',
	white: 'Warm white LED',
	hybrid: 'Smart hybrid (IR + white)',
	none: 'None'
} as const;
const lensLabel = {
	fixed: 'Fixed focal',
	'manual-varifocal': 'Manual varifocal',
	'motorized-varifocal': 'Motorised varifocal',
	'multi-lens': 'Multi-lens'
} as const;

/** Builds the grouped spec sheet shown on the product page, in datasheet order. */
export function fullSpecs(p: ProductDef, technologies: string[], aiFunctions: string[]): Group[] {
	const g: Group[] = [];
	const isCamera = p.mp !== undefined;
	if (isCamera && p.mp && p.lens && p.sensor) {
		const [w, h] = resolution(p.mp);
		g.push({
			group: 'Camera',
			rows: [
				{ key: 'Image sensor', value: `${p.sensor} progressive-scan CMOS` },
				{ key: 'Max. resolution', value: `${w} × ${h}` },
				{
					key: 'Min. illumination',
					value: technologies.includes('LumaNight')
						? 'Colour: 0.0005 lux @ F1.0'
						: 'Colour: 0.005 lux @ F1.6, B/W: 0 lux with IR'
				},
				{ key: 'Shutter', value: '1/3 s to 1/100,000 s' },
				{ key: 'WDR', value: p.series === 'ultra' || p.series === 'sentinel' ? '140 dB' : '120 dB' }
			]
		});
		const [min, max] = p.lens;
		const lensRows: Row[] = [
			{ key: 'Lens type', value: lensLabel[p.lensType ?? 'fixed'] },
			{ key: 'Focal length', value: max ? `${min}–${max} mm` : `${min} mm` },
			{
				key: 'Horizontal FOV',
				value: max
					? `${horizontalFov(max, p.sensor)}°–${horizontalFov(min, p.sensor)}°`
					: `${horizontalFov(min, p.sensor)}°`
			},
			{ key: 'Aperture', value: technologies.includes('LumaNight') ? 'F1.0' : 'F1.6' }
		];
		if (p.zoom) lensRows.push({ key: 'Optical zoom', value: `${p.zoom}×` });
		g.push({ group: 'Lens', rows: lensRows });
		const d = dori(p.mp, max ?? min, p.sensor);
		g.push({
			group: 'Pixel density (DORI)',
			rows: [
				{ key: 'Detect', value: `${d.detect} m` },
				{ key: 'Observe', value: `${d.observe} m` },
				{ key: 'Recognise', value: `${d.recognize} m` },
				{ key: 'Identify', value: `${d.identify} m` }
			]
		});
		if (p.light && p.light !== 'none') {
			g.push({
				group: 'Illuminator',
				rows: [
					{ key: 'Supplemental light', value: lightLabel[p.light] },
					{ key: 'Range', value: `Up to ${p.lightRange ?? 30} m` },
					{ key: 'Smart light control', value: 'Yes, anti-overexposure' }
				]
			});
		}
		g.push({
			group: 'Video',
			rows: [
				{ key: 'Compression', value: 'H.265, H.265+, H.264, MJPEG (sub-stream)' },
				{ key: 'Main stream', value: `${p.mp >= 8 ? '20' : '25'} fps @ ${w} × ${h}` },
				{ key: 'Bit rate', value: '32 Kbps to 16 Mbps' }
			]
		});
	}
	if (p.audio?.length) {
		g.push({
			group: 'Audio',
			rows: [
				{
					key: 'Audio',
					value: p.audio
						.map(
							(a) =>
								({
									mic: 'Built-in mic',
									'dual-mic': 'Dual-mic array',
									speaker: 'Built-in speaker',
									'two-way': 'Two-way audio'
								})[a]
						)
						.join(', ')
				}
			]
		});
	}
	g.push({
		group: 'Network',
		rows: [
			{ key: 'Protocols', value: 'TCP/IP, HTTPS, RTSP, NTP, 802.1X, IPv6, SNMP, TLS 1.3' },
			{ key: 'API', value: 'Open video interface (Profiles S, G, T), Dhonaadhi SDK' },
			{ key: 'Security', value: 'Signed firmware, secure boot, encrypted storage, audit log' }
		]
	});
	if (p.channels) {
		g.push({
			group: 'Interface',
			rows: [
				{ key: p.kind === 'switch' ? 'Ports' : 'Channels', value: String(p.channels) },
				...(p.storage ? [{ key: 'Storage', value: p.storage }] : [])
			]
		});
	} else if (p.storage) {
		g.push({ group: 'Interface', rows: [{ key: 'On-board storage', value: p.storage }] });
	}
	if (p.deterrence?.length) {
		g.push({
			group: 'Event',
			rows: [
				{
					key: 'Active deterrence',
					value: p.deterrence
						.map(
							(d) =>
								({
									'audio-alarm': 'Audio alarm',
									'white-strobe': 'White strobe',
									'red-blue-strobe': 'Red/blue strobe'
								})[d]
						)
						.join(', ')
				}
			]
		});
	}
	if (aiFunctions.length) {
		g.push({
			group: 'Deep-learning function',
			rows: aiFunctions.map((a) => ({ key: a, value: 'Yes' }))
		});
	}
	g.push({
		group: 'General',
		rows: [
			{
				key: 'Power',
				value:
					(p.power ?? [])
						.map(
							(x) =>
								({
									poe: 'PoE (802.3af)',
									dc12: '12 V DC',
									ac24: '24 V AC',
									solar: 'Solar + battery',
									cellular: '4G LTE'
								})[x]
						)
						.join(', ') || '100–240 V AC'
			},
			{ key: 'Operating temperature', value: p.temp ?? '−30 °C to 60 °C' },
			...(p.ip ? [{ key: 'Protection', value: [p.ip, p.ik].filter(Boolean).join(', ') }] : [])
		]
	});
	g.push({
		group: 'Approval',
		rows: [
			{ key: 'Certifications', value: 'CE, FCC, UL 62368-1, RoHS, EN 50131 (where applicable)' }
		]
	});
	return g;
}
