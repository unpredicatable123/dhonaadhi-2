import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
// Bundled (not read from disk) so the serverless function carries them.
import clash from './fonts/clash-display-600.ttf?base64';
import geist from './fonts/geist-latin-500-normal.woff?base64';
import mono from './fonts/jetbrains-mono-latin-500-normal.woff?base64';

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
	type,
	props: { style: { display: 'flex', ...style }, children }
});

let fonts: { name: string; data: Buffer; weight: 500 | 600; style: 'normal' }[] | undefined;
function loadFonts() {
	fonts ??= [
		{
			name: 'Clash',
			data: Buffer.from(clash, 'base64'),
			weight: 600,
			style: 'normal'
		},
		{
			name: 'Geist',
			data: Buffer.from(geist, 'base64'),
			weight: 500,
			style: 'normal'
		},
		{
			name: 'Mono',
			data: Buffer.from(mono, 'base64'),
			weight: 500,
			style: 'normal'
		}
	];
	return fonts;
}

/** Fetches any image (WebP/AVIF from Sanity or fixtures) and returns a PNG data URI satori can embed. */
async function toDataUri(url: string, fetcher: typeof fetch): Promise<string | undefined> {
	try {
		const res = await fetcher(url);
		if (!res.ok) return undefined;
		const png = await sharp(Buffer.from(await res.arrayBuffer()))
			.png()
			.toBuffer();
		return `data:image/png;base64,${png.toString('base64')}`;
	} catch {
		return undefined;
	}
}

/** 1200×630 share card: dark frame, product render, model number in mono, three specs. */
export async function renderOg(p: {
	brand: string;
	model: string;
	name: string;
	specs: string[];
	image?: string;
	fetcher: typeof fetch;
}): Promise<Buffer> {
	const img = p.image ? await toDataUri(p.image, p.fetcher) : undefined;
	const tree = h(
		'div',
		{
			width: 1200,
			height: 630,
			background: '#fafaf8',
			color: '#141413',
			fontFamily: 'Geist',
			position: 'relative'
		},
		[
			h(
				'div',
				{
					position: 'absolute',
					right: 0,
					top: 0,
					width: 700,
					height: 630,
					alignItems: 'center',
					justifyContent: 'center'
				},
				[
					img
						? {
								type: 'img',
								props: { src: img, width: 700, height: 525, style: { objectFit: 'cover' } }
							}
						: h('div', {})
				]
			),
			h('div', {
				position: 'absolute',
				left: 0,
				top: 0,
				width: 700,
				height: 630,
				background: 'linear-gradient(90deg, #fafaf8 55%, rgba(250,250,248,0))'
			}),
			h(
				'div',
				{
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: 64,
					width: 640,
					height: 630
				},
				[
					h('div', { fontFamily: 'Clash', fontSize: 34, letterSpacing: -1 }, p.brand),
					h('div', { flexDirection: 'column', gap: 16 }, [
						h('div', { fontFamily: 'Mono', fontSize: 30, color: '#0b6b4f' }, p.model),
						h(
							'div',
							{ fontFamily: 'Clash', fontSize: 58, lineHeight: 1.05, letterSpacing: -1.5 },
							p.name
						),
						h(
							'div',
							{ gap: 12, marginTop: 12, alignItems: 'flex-start' },
							p.specs.slice(0, 3).map((s) =>
								h(
									'div',
									{
										border: '1px solid #e5e4df',
										borderRadius: 6,
										padding: '8px 14px',
										fontFamily: 'Mono',
										fontSize: 20,
										color: '#5f5e59'
									},
									s
								)
							)
						)
					]),
					h('div', { width: 120, height: 3, background: '#0b6b4f' })
				]
			)
		]
	);
	const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
		width: 1200,
		height: 630,
		fonts: loadFonts()
	});
	return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
