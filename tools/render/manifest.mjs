/**
 * Every product image the catalogue can use. Seed products reference these ids;
 * `pnpm render` writes seed/data/images/renders/{id}-{angle}.webp.
 */
export const renders = {
	'bullet-white-ir': { kind: 'bullet', options: { light: 'ir' } },
	'bullet-white-hybrid': { kind: 'bullet', options: { light: 'hybrid' } },
	'bullet-graphite-white': { kind: 'bullet', options: { light: 'white', color: 'graphite' } },
	'bullet-solar': { kind: 'bullet', options: { solar: true, light: 'hybrid' } },
	'dome-white': { kind: 'dome', options: {} },
	'dome-graphite': { kind: 'dome', options: { color: 'graphite', light: 'white' } },
	'turret-white': { kind: 'turret', options: {} },
	'turret-graphite': { kind: 'turret', options: { color: 'graphite', light: 'white' } },
	'ptz-white': { kind: 'ptz', options: {} },
	'ptz-graphite': { kind: 'ptz', options: { color: 'graphite', ir: false } },
	'fisheye-white': { kind: 'fisheye', options: {} },
	box: { kind: 'box', options: {} },
	thermal: { kind: 'thermal', options: {} },
	'nvr-4': { kind: 'nvr', options: { bays: 4 } },
	'nvr-8': { kind: 'nvr', options: { bays: 8 } },
	'switch-8': { kind: 'switch', options: { ports: 8 } },
	'switch-24': { kind: 'switch', options: { ports: 24 } },
	'face-terminal': { kind: 'faceTerminal', options: {} },
	reader: { kind: 'reader', options: {} },
	'door-station': { kind: 'doorStation', options: {} },
	'indoor-station': { kind: 'indoorStation', options: {} },
	bridge: { kind: 'bridge', options: {} }
};

/** Three product-photography angles; products pick one as hero, the rest become gallery. */
export const angles = {
	a: { azimuth: -35, elevation: 14 },
	b: { azimuth: 32, elevation: 10 },
	c: { azimuth: -18, elevation: 30 }
};

/** Products with a 360° viewer. */
export const spins = { 'bullet-white-hybrid': 36, 'turret-white': 36 };

export const exploded = {
	frames: 120,
	/** Callouts: part → frame at which it's fully separated and labelled. */
	callouts: [
		{
			part: 'sunshield',
			frame: 58,
			title: 'Sunshield & IK10 shell',
			body: 'Die-cast aluminium, IP67 sealed.'
		},
		{
			part: 'front',
			frame: 70,
			title: 'Anti-glare front glass',
			body: 'Hydrophobic coating sheds rain.'
		},
		{
			part: 'lens',
			frame: 82,
			title: 'F1.0 LumaNight optics',
			body: 'Four times the light of an F2.0 lens.'
		},
		{
			part: 'sensor',
			frame: 96,
			title: '1/1.8″ BSI sensor + SentinelAI',
			body: 'Detection runs on the camera, not the server.'
		}
	]
};
