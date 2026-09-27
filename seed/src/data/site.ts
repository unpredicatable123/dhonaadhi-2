/** Site-level copy. Company/brand names live here only (→ siteSettings), never in components. */
export const brand = {
	companyName: 'Dhonaadhi Hitec Innovations',
	brandName: 'Dhonaadhi',
	siteUrl: 'https://dhonaadhi.example',
	email: 'sales@dhonaadhi.example',
	seo: {
		title: 'Security cameras and AIoT systems that see in the dark',
		description:
			'Network cameras, recorders, access control and intercom that stay sharp and in colour from dusk to dawn, with detection running on the device.'
	}
};

export const comingSoon = [
	{
		section: 'solutions',
		title: 'Solutions by industry and scenario',
		eta: 'Q1 2027',
		lead: 'Retail, logistics, energy, education and more — with the products and system designs behind each. For now, browse products by what they detect.'
	},
	{
		section: 'technologies',
		title: 'Technology explainers',
		eta: 'Q1 2027',
		lead: 'Deep dives on LumaNight, SentinelAI, PanoSight and the rest. Each product page already lists the technologies it uses.'
	},
	{
		section: 'partners',
		title: 'Partners and where to buy',
		eta: 'Q1 2027',
		lead: 'A map of certified installers and distributors near you.'
	},
	{
		section: 'support',
		title: 'Support centre',
		eta: 'Q2 2027',
		lead: 'Firmware, manuals, tools and troubleshooting in one place. Datasheets and firmware notes are on every product page today.'
	},
	{
		section: 'downloads',
		title: 'Downloads centre',
		eta: 'Q2 2027',
		lead: 'Search every datasheet, manual and firmware file across the catalogue.'
	},
	{
		section: 'newsroom',
		title: 'Newsroom',
		eta: 'Q2 2027',
		lead: 'Product launches, case studies and events.'
	},
	{
		section: 'about',
		title: 'About us',
		eta: 'Q2 2027',
		lead: 'Our story, our labs and how we build secure devices.'
	},
	{
		section: 'contact',
		title: 'Talk to sales',
		eta: 'Q2 2027',
		lead: 'A contact form is on the way. Until then, email us and a specialist will reply within one working day.'
	},
	{
		section: 'legal',
		title: 'Legal information',
		eta: 'Q2 2027',
		lead: 'Privacy, terms of use and cookie policy.'
	}
] as const;

type Link = { label: string; to: string };
/** `to`: '/path' (internal route), 'section:x' (coming soon) or 'category:slug' / 'product:model'. */
export const navigation = {
	items: [
		{ label: 'Products', to: '/products', mega: 'catalogue', featured: 'NB-8M-B28L' },
		{
			label: 'Solutions',
			to: 'section:solutions',
			mega: 'columns',
			columns: [
				{
					heading: 'By industry',
					links: [
						'Retail',
						'Education',
						'Healthcare',
						'Logistics',
						'Energy & utilities',
						'Traffic'
					].map((label) => ({ label, to: 'section:solutions' }))
				},
				{
					heading: 'By need',
					links: [
						'Perimeter protection',
						'Access & entrance',
						'Time attendance',
						'People counting'
					].map((label) => ({ label, to: 'section:solutions' }))
				}
			]
		},
		{ label: 'Technologies', to: 'section:technologies', mega: 'none' },
		{ label: 'Support', to: 'section:support', mega: 'none' },
		{ label: 'Partners', to: 'section:partners', mega: 'none' }
	],
	utility: [
		{ label: 'Newsroom', to: 'section:newsroom' },
		{ label: 'About', to: 'section:about' }
	] satisfies Link[],
	cta: { label: 'Talk to sales', to: 'section:contact' }
};

export const footer = {
	statement: 'Security and AIoT systems that see clearly when others can’t.',
	newsletterText: 'Product launches and firmware notices, once a month.',
	columns: [
		{ heading: 'Products', links: 'categories' as const },
		{
			heading: 'Solutions',
			links: [
				{ label: 'By industry', to: 'section:solutions' },
				{ label: 'Perimeter protection', to: 'section:solutions' },
				{ label: 'Access & entrance', to: 'section:solutions' }
			]
		},
		{
			heading: 'Support',
			links: [
				{ label: 'Downloads', to: 'section:downloads' },
				{ label: 'Firmware', to: 'section:support' },
				{ label: 'Compare products', to: '/products/compare' }
			]
		},
		{
			heading: 'Company',
			links: [
				{ label: 'About', to: 'section:about' },
				{ label: 'Newsroom', to: 'section:newsroom' },
				{ label: 'Partners', to: 'section:partners' },
				{ label: 'Contact', to: 'section:contact' }
			]
		}
	],
	legal: [
		{ label: 'Privacy', to: 'section:legal' },
		{ label: 'Terms of use', to: 'section:legal' },
		{ label: 'Cookies', to: 'section:legal' }
	] satisfies Link[]
};

export const home = {
	hero: {
		headline: 'Every detail, day and night.',
		lead: 'Cameras, recorders and access systems that stay sharp and alert from dusk to dawn — with detection running on the device, not in the cloud.',
		primary: { label: 'Explore products', to: '/products' },
		secondary: { label: 'Talk to sales', to: 'section:contact' },
		alt: 'A sunlit street corner: two pedestrians wait to cross while a van drives towards them',
		confidences: { PERSON: 0.98, VEHICLE: 0.95 }
	},
	trust: {
		title: 'Built and tested to recognised standards',
		items: [
			{ name: 'ISO 9001', detail: 'Quality management' },
			{ name: 'ISO/IEC 27001', detail: 'Information security' },
			{ name: 'IEC 62676', detail: 'Video surveillance systems' },
			{ name: 'UL 62368-1', detail: 'Product safety' },
			{ name: 'CE · FCC', detail: 'EMC and radio' },
			{ name: 'IP67 · IK10', detail: 'Ingress and impact' }
		]
	},
	rail: {
		title: 'Seven product families, one platform',
		lead: 'Every device pairs with the same recorders, apps and management software.'
	},
	dusk: {
		title: 'Dusk to night, still in colour',
		lead: 'Most cameras switch to grainy black and white when the light goes. LumaNight keeps colour — the difference between “a car” and “a yellow taxi”.',
		dayAlt: 'A city street at dusk: taxis and cars heading in under the first streetlights',
		convAlt:
			'The same street at night through a conventional camera: grainy black and white, the taxis hard to tell apart',
		lumaAlt:
			'The same street at night through a LumaNight camera: the yellow taxis and tail-lights clearly visible in colour'
	},
	exploded: {
		title: 'Engineered from the glass in',
		lead: 'Scroll to take apart an NB-8M-B28L: each layer is designed for one job — keep water out, let light in, decide what matters.'
	},
	stats: {
		title: 'Numbers that matter',
		lead: 'A decade of building cameras that installers trust.',
		items: [
			{
				value: 68,
				suffix: '',
				label: 'countries with certified installers',
				trend: [8, 14, 21, 29, 38, 47, 55, 61, 68]
			},
			{
				value: 1240,
				suffix: '',
				label: 'granted patents in imaging and AI',
				trend: [120, 260, 410, 580, 760, 910, 1050, 1160, 1240]
			},
			{
				value: 2840,
				suffix: '',
				label: 'R&D engineers across four labs',
				trend: [300, 520, 800, 1150, 1500, 1900, 2250, 2600, 2840]
			},
			{
				value: 47,
				suffix: '',
				label: 'product models on one platform',
				trend: [9, 14, 19, 24, 29, 33, 38, 43, 47]
			}
		]
	},
	industries: {
		title: 'Made for where you work',
		lead: 'Industry solutions are coming soon. Each will show the products and system design behind it.'
	},
	featured: {
		title: 'New this season',
		lead: 'The latest models across the range.',
		models: [
			'NB-8M-B28L',
			'NB-4M-B28L',
			'NT-8M-T40A',
			'NP-4M-P45X',
			'TH-B640-25',
			'NS-4M-S4G',
			'VR-32C-4H',
			'AC-FT8P'
		]
	},
	cta: {
		title: 'Find your product',
		lead: 'Search by model number, feature or the problem you need to solve.',
		placeholder: 'Model number, feature or use case',
		suggestions: ['Colour at night', 'Plate recognition', 'Solar 4G', 'Face terminal', 'NB-8M-B28L']
	}
};
