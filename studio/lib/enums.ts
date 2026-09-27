/**
 * Enumerations shared by schema + frontend filters. The web app mirrors these in
 * apps/web/src/lib/catalogue/attributes.ts (kept in sync by a unit test).
 */
export const categoryIcons = [
	'camera-network',
	'camera-ptz',
	'recorder',
	'thermal',
	'access',
	'intercom',
	'alarm',
	'display',
	'network-switch',
	'traffic',
	'software'
];

export const filterAttributes = [
	{ title: 'Series', value: 'series' },
	{ title: 'Form factor', value: 'formFactor' },
	{ title: 'Resolution (MP)', value: 'resolutionMp' },
	{ title: 'Lens type', value: 'lensType' },
	{ title: 'Supplemental light', value: 'lightType' },
	{ title: 'AI functions', value: 'aiFunctions' },
	{ title: 'Ingress (IP)', value: 'ipRating' },
	{ title: 'Vandal (IK)', value: 'ikRating' },
	{ title: 'PoE', value: 'poe' },
	{ title: 'Audio', value: 'audio' },
	{ title: 'Active deterrence', value: 'deterrence' },
	{ title: 'Power', value: 'power' },
	{ title: 'Channels', value: 'channels' }
];

export const lensTypes = [
	{ title: 'Fixed', value: 'fixed' },
	{ title: 'Manual varifocal', value: 'manual-varifocal' },
	{ title: 'Motorised varifocal', value: 'motorized-varifocal' },
	{ title: 'Multi-lens', value: 'multi-lens' }
];

export const lightTypes = [
	{ title: 'Infrared', value: 'ir' },
	{ title: 'White light', value: 'white' },
	{ title: 'Hybrid (IR + white)', value: 'hybrid' },
	{ title: 'None', value: 'none' }
];

export const ipRatings = ['IP54', 'IP66', 'IP67', 'IP68'];
export const ikRatings = ['IK08', 'IK10'];

export const audioOptions = [
	{ title: 'Built-in microphone', value: 'mic' },
	{ title: 'Dual-microphone array', value: 'dual-mic' },
	{ title: 'Built-in speaker', value: 'speaker' },
	{ title: 'Two-way audio', value: 'two-way' }
];

export const deterrenceOptions = [
	{ title: 'Audio alarm', value: 'audio-alarm' },
	{ title: 'White strobe', value: 'white-strobe' },
	{ title: 'Red/blue strobe', value: 'red-blue-strobe' }
];

export const powerOptions = [
	{ title: 'PoE', value: 'poe' },
	{ title: '12 V DC', value: 'dc12' },
	{ title: '24 V AC', value: 'ac24' },
	{ title: 'Solar (SunLink)', value: 'solar' },
	{ title: '4G / cable-free', value: 'cellular' }
];

/** Stage 2/3 sections that resolve to /coming-soon/{section} until they are built. */
export const comingSoonSections = [
	'solutions',
	'technologies',
	'partners',
	'support',
	'newsroom',
	'about',
	'contact',
	'downloads',
	'legal'
];
