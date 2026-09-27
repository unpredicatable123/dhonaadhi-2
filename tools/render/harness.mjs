import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const here = import.meta.dirname;
const threeDir = path.join(here, 'node_modules/three');
const types = { '.js': 'text/javascript', '.html': 'text/html' };

/**
 * Boots headless Chromium (SwiftShader WebGL2) with the three.js scene modules served
 * from disk under http://render.local/. `entry` is the scene module to load.
 */
export async function openScene(entry = 'main.js') {
	const browser = await chromium.launch({
		args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader']
	});
	const page = await browser.newPage();
	page.on('pageerror', (e) => console.error('[page]', e.message));
	page.on('console', (m) => m.type() === 'error' && console.error('[console]', m.text()));
	await page.route('http://render.local/**', (route) => {
		const url = new URL(route.request().url());
		const file = url.pathname.startsWith('/three/')
			? path.join(threeDir, url.pathname.slice('/three/'.length))
			: path.join(here, 'scene', url.pathname);
		if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: 'not found' });
		route.fulfill({
			body: fs.readFileSync(file),
			contentType: types[path.extname(file)] ?? 'application/octet-stream'
		});
	});
	const html = `<!doctype html><html><body style="margin:0;background:#000">
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<script type="module" src="/${entry}"></script></body></html>`;
	await page.route('http://render.local/index.html', (r) =>
		r.fulfill({ body: html, contentType: 'text/html' })
	);
	await page.goto('http://render.local/index.html');
	await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
	return { browser, page };
}

export function dataUrlToBuffer(url) {
	return Buffer.from(url.split(',')[1], 'base64');
}
