type Filter = { attribute: string; ui: 'checkbox' | 'range' | 'toggle' };
const f = (attribute: string, ui: Filter['ui'] = 'checkbox'): Filter => ({ attribute, ui });

/** Filter sets per listing type (rendered in this order by the product selector). */
const cameraFilters = [
	f('series'),
	f('formFactor'),
	f('resolutionMp', 'range'),
	f('lensType'),
	f('lightType'),
	f('aiFunctions'),
	f('ipRating'),
	f('ikRating'),
	f('poe', 'toggle'),
	f('audio'),
	f('deterrence'),
	f('power')
];
const recorderFilters = [f('series'), f('channels', 'range'), f('poe', 'toggle')];
const deviceFilters = [f('audio'), f('ipRating'), f('poe', 'toggle'), f('power')];
const switchFilters = [f('channels', 'range'), f('poe', 'toggle')];

export const categories = [
	{
		slug: 'network-cameras',
		title: 'Network cameras',
		icon: 'camera-network',
		tagline: 'Fixed cameras from 2 to 12 MP',
		description:
			'Bullet, dome, turret, fisheye and box cameras that stay sharp and in colour from dusk to dawn, with detection running on the camera.',
		render: 'bullet-white-hybrid'
	},
	{
		slug: 'ptz-cameras',
		title: 'PTZ cameras',
		icon: 'camera-ptz',
		tagline: 'Pan, tilt and zoom up to 45×',
		description:
			'Speed domes that follow a subject across a car park or a port, with auto-tracking and up to 250 m of infrared.',
		render: 'ptz-white'
	},
	{
		slug: 'thermal',
		title: 'Thermal & bi-spectrum',
		icon: 'thermal',
		tagline: 'See heat, not light',
		description:
			'Thermal and visible sensors in one housing for perimeters in total darkness, fog and smoke, plus early fire detection.',
		render: 'thermal'
	},
	{
		slug: 'recorders',
		title: 'Recorders & storage',
		icon: 'recorder',
		tagline: 'VaultNVR recording, 8 to 64 channels',
		description:
			'Network video recorders that index every person and vehicle as they record, so a search takes seconds, not hours.',
		render: 'nvr-8'
	},
	{
		slug: 'access-control',
		title: 'Access control',
		icon: 'access',
		tagline: 'Faces, cards and QR codes',
		description:
			'Face-recognition terminals and readers that open the right doors for the right people, even with masks or gloves.',
		render: 'face-terminal'
	},
	{
		slug: 'video-intercom',
		title: 'Video intercom',
		icon: 'intercom',
		tagline: 'Answer the door from anywhere',
		description:
			'Door stations and indoor monitors for homes, offices and multi-tenant buildings, with a mobile app for remote unlock.',
		render: 'door-station'
	},
	{
		slug: 'networking',
		title: 'Networking',
		icon: 'network-switch',
		tagline: 'PoE switches and wireless bridges',
		description:
			'Switches that power cameras over one cable and point-to-point bridges for sites where trenching is not an option.',
		render: 'switch-24'
	}
] as const;

export const subcategories = [
	{
		slug: 'bullet-cameras',
		title: 'Bullet cameras',
		category: 'network-cameras',
		filters: cameraFilters,
		description: 'Long-range, visible deterrence for walls, poles and perimeters.'
	},
	{
		slug: 'dome-turret-cameras',
		title: 'Dome & turret cameras',
		category: 'network-cameras',
		filters: cameraFilters,
		description: 'Discreet ceiling and eave mounts for interiors and entrances.'
	},
	{
		slug: 'panoramic-cameras',
		title: 'Panoramic & fisheye',
		category: 'network-cameras',
		filters: cameraFilters,
		description: 'One camera where you would otherwise need three.'
	},
	{
		slug: 'box-cameras',
		title: 'Box cameras',
		category: 'network-cameras',
		filters: cameraFilters,
		description: 'Interchangeable lenses for specialist scenes.'
	},
	{
		slug: 'solar-4g-cameras',
		title: 'Solar & 4G cameras',
		category: 'network-cameras',
		filters: cameraFilters,
		description: 'SunLink cameras that need no power or network cable.'
	},
	{
		slug: 'speed-domes',
		title: 'IR speed domes',
		category: 'ptz-cameras',
		filters: cameraFilters,
		description: 'High-zoom domes with long-range infrared and auto-tracking.'
	},
	{
		slug: 'compact-ptz',
		title: 'Compact PTZ',
		category: 'ptz-cameras',
		filters: cameraFilters,
		description: 'Smaller pan-tilt-zoom for lobbies, retail and campuses.'
	},
	{
		slug: 'bi-spectrum',
		title: 'Bi-spectrum cameras',
		category: 'thermal',
		filters: cameraFilters,
		description: 'Thermal and visible channels, fused for detection.'
	},
	{
		slug: 'network-video-recorders',
		title: 'Network video recorders',
		category: 'recorders',
		filters: recorderFilters,
		description: 'VaultNVR recorders with AI search.'
	},
	{
		slug: 'poe-kits',
		title: 'PoE kits',
		category: 'recorders',
		filters: recorderFilters,
		description: 'A recorder and cameras, pre-paired in one box.'
	},
	{
		slug: 'face-terminals',
		title: 'Face-recognition terminals',
		category: 'access-control',
		filters: deviceFilters,
		description: 'Touch-free entry and time attendance.'
	},
	{
		slug: 'readers',
		title: 'Readers & keypads',
		category: 'access-control',
		filters: deviceFilters,
		description: 'Card, QR and PIN readers for every door.'
	},
	{
		slug: 'door-stations',
		title: 'Door stations',
		category: 'video-intercom',
		filters: deviceFilters,
		description: 'Outdoor units with camera, speaker and call button.'
	},
	{
		slug: 'indoor-stations',
		title: 'Indoor stations',
		category: 'video-intercom',
		filters: deviceFilters,
		description: 'Touchscreen monitors for answering and unlocking.'
	},
	{
		slug: 'poe-switches',
		title: 'PoE switches',
		category: 'networking',
		filters: switchFilters,
		description: 'Managed and unmanaged switches with PoE budgets for cameras.'
	},
	{
		slug: 'wireless-bridges',
		title: 'Wireless bridges',
		category: 'networking',
		filters: deviceFilters,
		description: 'Point-to-point links up to 5 km.'
	}
];

export const series = [
	{
		slug: 'value',
		title: 'Value series',
		tier: 'value',
		tagline: 'Dependable essentials for small sites',
		subcategories: [
			'bullet-cameras',
			'dome-turret-cameras',
			'speed-domes',
			'bi-spectrum',
			'network-video-recorders'
		]
	},
	{
		slug: 'pro',
		title: 'Pro series',
		tagline: 'Colour at night and fewer false alarms',
		tier: 'pro',
		subcategories: [
			'bullet-cameras',
			'dome-turret-cameras',
			'speed-domes',
			'compact-ptz',
			'box-cameras',
			'network-video-recorders'
		]
	},
	{
		slug: 'ultra',
		title: 'Ultra series',
		tagline: 'Maximum detail for critical sites',
		tier: 'ultra',
		subcategories: [
			'bullet-cameras',
			'dome-turret-cameras',
			'speed-domes',
			'bi-spectrum',
			'network-video-recorders'
		]
	},
	{
		slug: 'sentinel',
		title: 'Sentinel series',
		tagline: 'Deep-learning analytics on every camera',
		tier: 'ai',
		subcategories: ['bullet-cameras', 'dome-turret-cameras', 'speed-domes']
	},
	{
		slug: 'panosight',
		title: 'PanoSight series',
		tagline: '180° and 360° views without blind spots',
		tier: 'panoramic',
		subcategories: ['panoramic-cameras']
	},
	{
		slug: 'rugged',
		title: 'Rugged series',
		tagline: 'Solar, 4G and harsh-environment builds',
		tier: 'special',
		subcategories: ['solar-4g-cameras', 'box-cameras']
	}
];

export const technologies = [
	{
		slug: 'lumanight',
		title: 'LumaNight',
		icon: 'moon',
		proofPoint: 'Colour at 0.0005 lux',
		summary:
			'An F1.0 aperture and a back-illuminated sensor keep night footage in full colour, so a red car is still red at 2 a.m.'
	},
	{
		slug: 'sentinelai',
		title: 'SentinelAI',
		icon: 'scan-eye',
		proofPoint: '95% fewer false alarms',
		summary:
			'Deep-learning models tell people and vehicles apart from rain, leaves and animals, so alerts mean something.'
	},
	{
		slug: 'clearedge',
		title: 'ClearEdge',
		icon: 'cpu',
		proofPoint: 'Analytics on the camera',
		summary:
			'Counting, heat maps and line crossing run on the camera itself, which keeps bandwidth and server load low.'
	},
	{
		slug: 'panosight',
		title: 'PanoSight',
		icon: 'panorama',
		proofPoint: '180° with no fisheye curve',
		summary:
			'Multiple sensors stitched in real time give one seamless wide image instead of three overlapping views.'
	},
	{
		slug: 'sunlink',
		title: 'SunLink',
		icon: 'sun',
		proofPoint: '7 days on battery',
		summary:
			'A solar panel, battery and 4G modem let a camera run where there is no power and no network cable.'
	},
	{
		slug: 'vaultnvr',
		title: 'VaultNVR',
		icon: 'hard-drive',
		proofPoint: 'Search 30 days in seconds',
		summary:
			'Recorders tag every person and vehicle as they record, so you can search by description instead of scrubbing video.'
	}
];

export const aiFunctions = [
	{
		slug: 'perimeter-protection',
		title: 'Perimeter protection',
		icon: 'fence',
		summary: 'Line crossing and intrusion alerts filtered to people and vehicles.'
	},
	{
		slug: 'face-capture',
		title: 'Face capture',
		icon: 'scan-face',
		summary: 'Captures the best face image of each passer-by.'
	},
	{
		slug: 'face-recognition',
		title: 'Face recognition',
		icon: 'user-check',
		summary: 'Matches faces against an access or watch list.'
	},
	{
		slug: 'anpr',
		title: 'Number plate recognition',
		icon: 'rectangle-horizontal',
		summary: 'Reads plates for car parks and gates.'
	},
	{
		slug: 'people-counting',
		title: 'People counting',
		icon: 'users',
		summary: 'Counts entries and exits for occupancy and footfall.'
	},
	{
		slug: 'heat-map',
		title: 'Heat map',
		icon: 'flame',
		summary: 'Shows where people linger over time.'
	},
	{
		slug: 'queue-management',
		title: 'Queue management',
		icon: 'list-ordered',
		summary: 'Measures queue length and waiting time.'
	},
	{
		slug: 'hardhat-detection',
		title: 'Hard-hat detection',
		icon: 'hard-hat',
		summary: 'Flags people without head protection on site.'
	},
	{
		slug: 'fire-detection',
		title: 'Fire & smoke detection',
		icon: 'siren',
		summary: 'Thermal detection of hot spots and open flame.'
	}
];

export const formFactors = [
	{
		slug: 'bullet',
		title: 'Bullet',
		icon: 'cctv',
		summary: 'Visible, long-range, wall or pole mount.'
	},
	{ slug: 'dome', title: 'Dome', icon: 'circle-dot', summary: 'Vandal-resistant ceiling mount.' },
	{ slug: 'turret', title: 'Turret', icon: 'eye', summary: 'Eyeball style, no dome glare.' },
	{ slug: 'box', title: 'Box', icon: 'box', summary: 'Interchangeable lens body.' },
	{
		slug: 'fisheye',
		title: 'Fisheye',
		icon: 'aperture',
		summary: '360° overview from one ceiling point.'
	},
	{
		slug: 'panoramic',
		title: 'Panoramic',
		icon: 'panorama',
		summary: 'Multi-sensor stitched 180°.'
	},
	{
		slug: 'ptz-dome',
		title: 'PTZ dome',
		icon: 'rotate-3d',
		summary: 'Pan, tilt and optical zoom.'
	},
	{
		slug: 'bi-spectrum',
		title: 'Bi-spectrum',
		icon: 'thermometer',
		summary: 'Thermal + visible channels.'
	}
];

/** Industry photos: CC0 / public domain via Openverse (see seed/data/photos.json for credits). */
export const industries = [
	{
		slug: 'retail',
		title: 'Retail',
		photo: 'retail',
		summary: 'Loss prevention, footfall and queue insight across every store.'
	},
	{
		slug: 'education',
		title: 'Education',
		photo: 'education',
		summary: 'Safer campuses with visitor management and lockdown-ready access.'
	},
	{
		slug: 'healthcare',
		title: 'Healthcare',
		photo: 'healthcare',
		summary: 'Protected wards, pharmacies and entrances, around the clock.'
	},
	{
		slug: 'logistics',
		title: 'Logistics',
		photo: 'logistics',
		summary: 'Dock, yard and parcel visibility from gate to shelf.'
	},
	{
		slug: 'energy',
		title: 'Energy & utilities',
		photo: 'energy',
		summary: 'Remote perimeters for solar farms and substations.'
	},
	{
		slug: 'traffic',
		title: 'Traffic',
		photo: 'traffic',
		summary: 'Flow monitoring, incident detection and plate recognition.'
	},
	{
		slug: 'public-transport',
		title: 'Public transport',
		photo: 'transport',
		summary: 'Crowded platforms and stations, managed calmly.'
	},
	{
		slug: 'manufacturing',
		title: 'Manufacturing',
		photo: 'manufacturing',
		summary: 'Safety compliance and process visibility on the line.'
	}
];

export const solutions = [
	{
		slug: 'perimeter-protection',
		title: 'Perimeter protection',
		axis: 'function',
		industries: ['energy', 'logistics'],
		summary: 'Detect, verify and deter intrusions before they reach the fence.'
	},
	{
		slug: 'access-entrance',
		title: 'Access & entrance management',
		axis: 'function',
		industries: ['education', 'healthcare'],
		summary: 'One credential for doors, gates and turnstiles.'
	},
	{
		slug: 'time-attendance',
		title: 'Time attendance',
		axis: 'function',
		industries: ['manufacturing'],
		summary: 'Touch-free clock-in that payroll can trust.'
	},
	{
		slug: 'people-counting',
		title: 'People counting',
		axis: 'function',
		industries: ['retail', 'public-transport'],
		summary: 'Occupancy and conversion, live.'
	},
	{
		slug: 'warehouses',
		title: 'Warehouses',
		axis: 'scenario',
		industries: ['logistics'],
		summary: 'Docks, aisles and yards under one view.'
	},
	{
		slug: 'solar-farms',
		title: 'Solar farms',
		axis: 'scenario',
		industries: ['energy'],
		summary: 'Kilometres of fence with no cable runs.'
	}
];
