import fs from 'node:fs';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import sharp from 'sharp';

const INK = rgb(0.027, 0.035, 0.051);
const MIST = rgb(0.91, 0.93, 0.957);
const STEEL = rgb(0.34, 0.38, 0.45);
const OPTIC = rgb(0.04, 0.48, 0.41);
const LINE = rgb(0.85, 0.87, 0.9);

const clashPath = path.resolve(
	import.meta.dirname,
	'../../../apps/web/src/lib/server/og/fonts/clash-display-600.ttf'
);

/** Standard PDF fonts are WinAnsi-only; map the few typographic characters we use. */
const ansi = (s: string) =>
	s
		.replace(/″/g, '"')
		.replace(/−/g, '-')
		.replace(/[–—]/g, '-')
		.replace(/[‘’]/g, "'")
		.replace(/[“”]/g, '"')
		.replace(/[^\x20-\x7E°×µ·é]/g, '');

type Spec = { group: string; rows: { key: string; value: string }[] };

type Fonts = { display: PDFFont; body: PDFFont; bold: PDFFont };

async function setup() {
	const doc = await PDFDocument.create();
	doc.registerFontkit(fontkit);
	const fonts: Fonts = {
		display: await doc.embedFont(fs.readFileSync(clashPath), { subset: true }),
		body: await doc.embedFont(StandardFonts.Helvetica),
		bold: await doc.embedFont(StandardFonts.HelveticaBold)
	};
	return { doc, fonts };
}

function header(page: PDFPage, fonts: Fonts, brand: string, label: string) {
	const { width, height } = page.getSize();
	page.drawRectangle({ x: 0, y: height - 64, width, height: 64, color: INK });
	page.drawText(brand, { x: 40, y: height - 40, size: 18, font: fonts.display, color: MIST });
	const lw = fonts.body.widthOfTextAtSize(label, 9);
	page.drawText(label, {
		x: width - 40 - lw,
		y: height - 38,
		size: 9,
		font: fonts.body,
		color: MIST
	});
}

function footer(page: PDFPage, fonts: Fonts, text: string) {
	page.drawLine({
		start: { x: 40, y: 44 },
		end: { x: page.getWidth() - 40, y: 44 },
		thickness: 0.5,
		color: LINE
	});
	page.drawText(ansi(text), { x: 40, y: 30, size: 7.5, font: fonts.body, color: STEEL });
}

function wrap(text: string, font: PDFFont, size: number, max: number): string[] {
	const words = ansi(text).split(' ');
	const lines: string[] = [];
	let line = '';
	for (const w of words) {
		const next = line ? `${line} ${w}` : w;
		if (font.widthOfTextAtSize(next, size) > max && line) {
			lines.push(line);
			line = w;
		} else line = next;
	}
	if (line) lines.push(line);
	return lines;
}

export type DatasheetInput = {
	brand: string;
	company: string;
	model: string;
	name: string;
	summary: string;
	highlights: string[];
	specs: Spec[];
	image: string;
	date: string;
};

/** One-page A4 datasheet: identity, image, highlights, two-column spec table. */
export async function datasheet(p: DatasheetInput): Promise<Uint8Array> {
	const { doc, fonts } = await setup();
	const page = doc.addPage([595.28, 841.89]);
	header(page, fonts, p.brand, 'PRODUCT DATASHEET');
	let y = 841.89 - 110;
	page.drawText(p.model, { x: 40, y, size: 28, font: fonts.display, color: INK });
	y -= 22;
	page.drawText(ansi(p.name), { x: 40, y, size: 12, font: fonts.bold, color: STEEL });
	y -= 24;
	for (const l of wrap(p.summary, fonts.body, 10, 280)) {
		page.drawText(l, { x: 40, y, size: 10, font: fonts.body, color: INK });
		y -= 14;
	}
	y -= 8;
	for (const h of p.highlights) {
		page.drawRectangle({ x: 40, y: y + 2, width: 4, height: 4, color: OPTIC });
		page.drawText(ansi(h), { x: 52, y, size: 9.5, font: fonts.body, color: INK });
		y -= 15;
	}
	const jpg = await sharp(p.image).resize(460, 345).jpeg({ quality: 72 }).toBuffer();
	const img = await doc.embedJpg(jpg);
	page.drawImage(img, { x: 340, y: 841.89 - 110 - 170, width: 215, height: 161 });

	y = Math.min(y, 841.89 - 300) - 16;
	page.drawText('Specifications', { x: 40, y, size: 13, font: fonts.display, color: INK });
	y -= 18;
	const colW = 250;
	let col = 0;
	const top = y;
	for (const g of p.specs) {
		const needed = 16 + g.rows.length * 18;
		if (y - needed < 70) {
			if (col === 1) break;
			col = 1;
			y = top;
		}
		const x = 40 + col * (colW + 15);
		page.drawText(ansi(g.group).toUpperCase(), { x, y, size: 7.5, font: fonts.bold, color: OPTIC });
		y -= 12;
		for (const r of g.rows) {
			page.drawText(ansi(r.key), { x, y, size: 8, font: fonts.body, color: STEEL });
			const lines = wrap(r.value, fonts.body, 8, colW - 105).slice(0, 2);
			lines.forEach((l, i) =>
				page.drawText(l, { x: x + 105, y: y - i * 10, size: 8, font: fonts.body, color: INK })
			);
			const h = 13 + (lines.length - 1) * 10;
			page.drawLine({
				start: { x, y: y - h + 9 },
				end: { x: x + colW, y: y - h + 9 },
				thickness: 0.3,
				color: LINE
			});
			y -= h;
		}
		y -= 6;
	}
	footer(
		page,
		fonts,
		`${p.company} · ${p.model} datasheet · ${p.date} · Specifications may change without notice. Images are renders.`
	);
	return doc.save();
}

/** Short text document (quick-start guide, firmware release notes). */
export async function textDoc(p: {
	brand: string;
	company: string;
	label: string;
	title: string;
	subtitle: string;
	sections: { heading: string; items: string[] }[];
	date: string;
}): Promise<Uint8Array> {
	const { doc, fonts } = await setup();
	const page = doc.addPage([595.28, 841.89]);
	header(page, fonts, p.brand, p.label);
	let y = 841.89 - 110;
	page.drawText(ansi(p.title), { x: 40, y, size: 24, font: fonts.display, color: INK });
	y -= 20;
	page.drawText(ansi(p.subtitle), { x: 40, y, size: 11, font: fonts.body, color: STEEL });
	y -= 34;
	for (const s of p.sections) {
		page.drawText(ansi(s.heading), { x: 40, y, size: 12, font: fonts.bold, color: INK });
		y -= 18;
		s.items.forEach((item, i) => {
			for (const [j, l] of wrap(item, fonts.body, 10, 490).entries()) {
				page.drawText(j === 0 ? `${i + 1}.  ${l}` : `     ${l}`, {
					x: 44,
					y,
					size: 10,
					font: fonts.body,
					color: INK
				});
				y -= 14;
			}
			y -= 3;
		});
		y -= 12;
	}
	footer(page, fonts, `${p.company} · ${p.date}`);
	return doc.save();
}
