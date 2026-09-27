import type { ProductDef } from './types.js';

const nvr = (p: Omit<ProductDef, 'kind' | 'category' | 'subcategory'>): ProductDef => ({
	kind: 'recorder',
	category: 'recorders',
	subcategory: 'network-video-recorders',
	power: ['dc12'],
	temp: '−10 °C to 55 °C',
	tech: ['vaultnvr'],
	...p
});

export const devices: ProductDef[] = [
	// ── Recorders ───────────────────────────────────────────────────────
	nvr({
		model: 'VR-8C-1H',
		name: '8-channel PoE VaultNVR',
		series: 'value',
		release: '2025-03-03',
		render: 'nvr-4',
		angle: 'a',
		channels: 8,
		poe: true,
		storage: '1 SATA bay, up to 16 TB',
		ai: ['perimeter-protection'],
		cardSpecs: [
			{ label: 'Channels', value: '8' },
			{ label: 'PoE', value: '8', unit: 'ports' },
			{ label: 'Storage', value: '1', unit: 'bay' }
		],
		summary: 'Plug in up to eight cameras; they power up and pair automatically over PoE.',
		highlights: [
			'8 PoE ports built in',
			'Plug-and-play pairing',
			'Up to 4K recording',
			'Human/vehicle search'
		]
	}),
	nvr({
		model: 'VR-16C-2H',
		name: '16-channel PoE VaultNVR',
		series: 'pro',
		release: '2025-08-12',
		render: 'nvr-4',
		angle: 'b',
		channels: 16,
		poe: true,
		storage: '2 SATA bays, up to 32 TB',
		ai: ['perimeter-protection', 'face-recognition'],
		cardSpecs: [
			{ label: 'Channels', value: '16' },
			{ label: 'PoE', value: '16', unit: 'ports' },
			{ label: 'Storage', value: '2', unit: 'bays' }
		],
		summary:
			'Search sixteen cameras by description — "red car", "person with backpack" — in seconds.',
		highlights: [
			'16 PoE ports',
			'Text search across all cameras',
			'Face-library matching',
			'Dual HDMI outputs'
		]
	}),
	nvr({
		model: 'VR-32C-4H',
		name: '32-channel VaultNVR',
		series: 'ultra',
		release: '2026-02-02',
		status: 'new',
		render: 'nvr-8',
		angle: 'a',
		channels: 32,
		poe: false,
		storage: '4 SATA bays, RAID 0/1/5/10, up to 80 TB',
		ai: ['perimeter-protection', 'face-recognition', 'anpr'],
		cardSpecs: [
			{ label: 'Channels', value: '32' },
			{ label: 'Bandwidth', value: '400', unit: 'Mbps' },
			{ label: 'Storage', value: '4', unit: 'bays' }
		],
		summary:
			'Mid-size sites: RAID storage, plate and face databases, and 400 Mbps incoming bandwidth.',
		highlights: [
			'RAID 0/1/5/10',
			'400 Mbps incoming',
			'Plate and face databases',
			'Dual network ports'
		]
	}),
	nvr({
		model: 'VR-64C-8H',
		name: '64-channel VaultNVR server',
		series: 'ultra',
		release: '2025-12-15',
		render: 'nvr-8',
		angle: 'c',
		channels: 64,
		poe: false,
		storage: '8 SATA bays, RAID 5/6/10, up to 160 TB',
		ai: ['perimeter-protection', 'face-recognition', 'anpr', 'people-counting'],
		power: ['ac24'],
		cardSpecs: [
			{ label: 'Channels', value: '64' },
			{ label: 'Bandwidth', value: '768', unit: 'Mbps' },
			{ label: 'Storage', value: '8', unit: 'bays' }
		],
		summary: 'Enterprise recorder with redundant power and hot-swap bays for campuses and cities.',
		highlights: ['Hot-swap drive bays', 'Redundant power', '768 Mbps incoming', 'N+1 failover']
	}),
	{
		model: 'KT-4B-8C',
		name: '4-camera LumaNight PoE kit',
		kind: 'kit',
		category: 'recorders',
		subcategory: 'poe-kits',
		series: 'pro',
		release: '2026-03-18',
		status: 'new',
		render: 'nvr-4',
		angle: 'c',
		channels: 8,
		poe: true,
		storage: '2 TB drive included',
		tech: ['vaultnvr', 'lumanight'],
		ai: ['perimeter-protection'],
		bundle: [
			{ model: 'VR-8C-1H', quantity: 1 },
			{ model: 'NB-4M-B28L', quantity: 4 }
		],
		cardSpecs: [
			{ label: 'Cameras', value: '4' },
			{ label: 'Channels', value: '8' },
			{ label: 'Drive', value: '2', unit: 'TB' }
		],
		summary:
			'Everything for a small site in one box: an 8-channel recorder, four colour-at-night cameras and a 2 TB drive.',
		highlights: [
			'Pre-paired out of the box',
			'4 × NB-4M-B28L cameras',
			'8-channel recorder',
			'2 TB drive installed'
		]
	},

	// ── Access control ─────────────────────────────────────────────────
	{
		model: 'AC-FT7',
		name: '7″ face-recognition terminal',
		kind: 'access',
		category: 'access-control',
		subcategory: 'face-terminals',
		release: '2025-05-06',
		render: 'face-terminal',
		angle: 'a',
		ip: 'IP54',
		poe: true,
		power: ['poe', 'dc12'],
		audio: ['mic', 'speaker'],
		ai: ['face-recognition'],
		tech: ['sentinelai'],
		cardSpecs: [
			{ label: 'Faces', value: '10k' },
			{ label: 'Speed', value: '0.2', unit: 's' },
			{ label: 'Screen', value: '7', unit: '″' }
		],
		summary: 'Recognises 10,000 enrolled faces in 0.2 seconds, with masks, glasses or hats.',
		highlights: [
			'10,000 face library',
			'0.2 s recognition',
			'Anti-spoofing liveness',
			'Card and PIN fallback',
			'Time attendance'
		]
	},
	{
		model: 'AC-FT8P',
		name: '8″ face + palm terminal',
		kind: 'access',
		category: 'access-control',
		subcategory: 'face-terminals',
		release: '2026-04-15',
		status: 'new',
		render: 'face-terminal',
		angle: 'b',
		ip: 'IP66',
		ik: 'IK08',
		poe: true,
		power: ['poe', 'dc12'],
		audio: ['mic', 'speaker', 'two-way'],
		ai: ['face-recognition'],
		tech: ['sentinelai'],
		cardSpecs: [
			{ label: 'Faces', value: '50k' },
			{ label: 'Palm', value: 'Yes' },
			{ label: 'Screen', value: '8', unit: '″' }
		],
		summary:
			'Outdoor-rated terminal that combines face and palm-vein recognition for high-security doors.',
		highlights: ['Face + palm vein', '50,000 users', 'IP66 / IK08 outdoor', 'Two-way intercom']
	},
	{
		model: 'AC-RD-Q',
		name: 'Card & QR reader',
		kind: 'access',
		category: 'access-control',
		subcategory: 'readers',
		release: '2025-01-13',
		render: 'reader',
		angle: 'a',
		ip: 'IP66',
		poe: false,
		power: ['dc12'],
		cardSpecs: [
			{ label: 'Cards', value: 'Mifare/DESFire' },
			{ label: 'QR', value: 'Yes' },
			{ label: 'Rating', value: 'IP66' }
		],
		summary: 'Reads encrypted cards, phones and QR visitor passes at the same door.',
		highlights: [
			'DESFire EV3 encrypted cards',
			'QR visitor passes',
			'Mobile credentials',
			'OSDP secure channel'
		]
	},
	{
		model: 'AC-RD-K',
		name: 'Card reader with keypad',
		kind: 'access',
		category: 'access-control',
		subcategory: 'readers',
		release: '2024-09-09',
		render: 'reader',
		angle: 'b',
		ip: 'IP66',
		ik: 'IK08',
		poe: false,
		power: ['dc12'],
		cardSpecs: [
			{ label: 'Cards', value: 'Mifare' },
			{ label: 'PIN', value: 'Yes' },
			{ label: 'Rating', value: 'IK08' }
		],
		summary: 'Card plus PIN for two-factor doors such as server rooms and pharmacies.',
		highlights: ['Card + PIN two-factor', 'Backlit keypad', 'IK08 / IP66', 'Wiegand and OSDP']
	},

	// ── Video intercom ─────────────────────────────────────────────────
	{
		model: 'IC-DS1',
		name: 'Villa door station',
		kind: 'intercom',
		category: 'video-intercom',
		subcategory: 'door-stations',
		release: '2025-06-10',
		render: 'door-station',
		angle: 'a',
		ip: 'IP66',
		poe: true,
		power: ['poe', 'dc12'],
		audio: ['mic', 'speaker', 'two-way'],
		ai: ['face-capture'],
		cardSpecs: [
			{ label: 'Camera', value: '2', unit: 'MP' },
			{ label: 'View', value: '180', unit: '°' },
			{ label: 'Buttons', value: '1' }
		],
		summary:
			'A single-button aluminium door station with a 180° camera that sees parcels on the doorstep.',
		highlights: ['2 MP 180° camera', 'App answer and unlock', 'Aluminium housing', 'Parcel view']
	},
	{
		model: 'IC-DS4M',
		name: 'Multi-tenant door station',
		kind: 'intercom',
		category: 'video-intercom',
		subcategory: 'door-stations',
		release: '2026-01-07',
		status: 'new',
		render: 'door-station',
		angle: 'b',
		ip: 'IP66',
		ik: 'IK08',
		poe: true,
		power: ['poe', 'dc12'],
		audio: ['mic', 'speaker', 'two-way'],
		ai: ['face-recognition'],
		tech: ['sentinelai'],
		cardSpecs: [
			{ label: 'Camera', value: '4', unit: 'MP' },
			{ label: 'Tenants', value: '500' },
			{ label: 'Unlock', value: 'Face' }
		],
		summary: 'Directory, face unlock and card reader for apartment buildings up to 500 units.',
		highlights: [
			'Face unlock for residents',
			'Up to 500 tenants',
			'Built-in card reader',
			'IK08 / IP66'
		]
	},
	{
		model: 'IC-IS7',
		name: '7″ indoor station',
		kind: 'intercom',
		category: 'video-intercom',
		subcategory: 'indoor-stations',
		release: '2025-02-18',
		render: 'indoor-station',
		angle: 'a',
		poe: true,
		power: ['poe', 'dc12'],
		audio: ['mic', 'speaker', 'two-way'],
		cardSpecs: [
			{ label: 'Screen', value: '7', unit: '″' },
			{ label: 'Cameras', value: '8' },
			{ label: 'Wi-Fi', value: 'Yes' }
		],
		summary: 'Answer the door, unlock the gate and view up to eight cameras from one touchscreen.',
		highlights: ['7″ touchscreen', 'View 8 cameras', 'Wi-Fi or PoE', 'Do-not-disturb schedule']
	},
	{
		model: 'IC-IS10',
		name: '10″ indoor station',
		kind: 'intercom',
		category: 'video-intercom',
		subcategory: 'indoor-stations',
		release: '2026-05-12',
		status: 'new',
		render: 'indoor-station',
		angle: 'b',
		poe: true,
		power: ['poe', 'dc12'],
		audio: ['dual-mic', 'speaker', 'two-way'],
		cardSpecs: [
			{ label: 'Screen', value: '10.1', unit: '″' },
			{ label: 'Cameras', value: '16' },
			{ label: 'Alarm', value: '8', unit: 'zones' }
		],
		summary: 'A larger monitor with alarm-panel functions for villas and offices.',
		highlights: [
			'10.1″ IPS touchscreen',
			'View 16 cameras',
			'8 alarm zones',
			'Dual-mic echo cancellation'
		]
	},

	// ── Networking ─────────────────────────────────────────────────────
	{
		model: 'SW-8P-G',
		name: '8-port Gigabit PoE switch',
		kind: 'switch',
		category: 'networking',
		subcategory: 'poe-switches',
		release: '2025-01-27',
		render: 'switch-8',
		angle: 'a',
		channels: 8,
		poe: true,
		power: ['ac24'],
		cardSpecs: [
			{ label: 'PoE ports', value: '8' },
			{ label: 'Budget', value: '120', unit: 'W' },
			{ label: 'Uplink', value: '2', unit: 'SFP' }
		],
		summary: 'Powers eight cameras with 120 W of PoE and extends cable runs to 250 m.',
		highlights: ['120 W PoE budget', '250 m extend mode', '2 × SFP uplink', 'Fanless']
	},
	{
		model: 'SW-24P-G',
		name: '24-port managed PoE switch',
		kind: 'switch',
		category: 'networking',
		subcategory: 'poe-switches',
		release: '2025-09-02',
		render: 'switch-24',
		angle: 'a',
		channels: 24,
		poe: true,
		power: ['ac24'],
		cardSpecs: [
			{ label: 'PoE ports', value: '24' },
			{ label: 'Budget', value: '370', unit: 'W' },
			{ label: 'Uplink', value: '4', unit: 'SFP+' }
		],
		summary: 'A managed switch that shows which camera is on which port and reboots it remotely.',
		highlights: ['370 W PoE budget', 'Camera topology view', 'Remote PoE reboot', '4 × 10G SFP+']
	},
	{
		model: 'WB-5K',
		name: '5 km wireless bridge kit',
		kind: 'bridge',
		category: 'networking',
		subcategory: 'wireless-bridges',
		release: '2025-07-21',
		render: 'bridge',
		angle: 'a',
		ip: 'IP66',
		poe: true,
		power: ['poe'],
		cardSpecs: [
			{ label: 'Range', value: '5', unit: 'km' },
			{ label: 'Throughput', value: '867', unit: 'Mbps' },
			{ label: 'Band', value: '5', unit: 'GHz' }
		],
		summary:
			'A pre-paired pair of radios that link a gatehouse or a remote pole to the main building.',
		highlights: ['Up to 5 km', 'Pre-paired pair', '867 Mbps', 'IP66']
	},
	{
		model: 'WB-1K',
		name: '1 km wireless bridge kit',
		kind: 'bridge',
		category: 'networking',
		subcategory: 'wireless-bridges',
		release: '2024-11-11',
		render: 'bridge',
		angle: 'b',
		ip: 'IP66',
		poe: true,
		power: ['poe'],
		cardSpecs: [
			{ label: 'Range', value: '1', unit: 'km' },
			{ label: 'Throughput', value: '300', unit: 'Mbps' },
			{ label: 'Band', value: '5', unit: 'GHz' }
		],
		summary: 'Short-range bridge for car parks and lift shafts.',
		highlights: ['Up to 1 km', 'Plug-and-play pairing', 'PoE powered', 'IP66']
	}
];
