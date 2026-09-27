import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const rbox = (w, h, d, r = 0.4) => new RoundedBoxGeometry(w, h, d, 4, r);

function mesh(geo, mat, pos = [0, 0, 0], rot = [0, 0, 0]) {
	const m = new THREE.Mesh(geo, mat);
	m.position.set(...pos);
	m.rotation.set(...rot);
	m.castShadow = m.receiveShadow = true;
	return m;
}

/** Screen texture: a quiet UI — video tiles, or a face-verify frame. Never a real brand UI. */
function screenTexture(kind) {
	const c = document.createElement('canvas');
	c.width = 512;
	c.height = kind === 'portrait' ? 820 : 320;
	const x = c.getContext('2d');
	const grd = x.createLinearGradient(0, 0, 0, c.height);
	grd.addColorStop(0, '#0f1a24');
	grd.addColorStop(1, '#06090d');
	x.fillStyle = grd;
	x.fillRect(0, 0, c.width, c.height);
	if (kind === 'portrait') {
		x.strokeStyle = '#3bd49a';
		x.lineWidth = 4;
		const s = 220;
		const cx = 256;
		const cy = 360;
		for (const [dx, dy] of [
			[-1, -1],
			[1, -1],
			[-1, 1],
			[1, 1]
		]) {
			x.beginPath();
			x.moveTo(cx + (dx * s) / 2, cy + (dy * s) / 2 - dy * 40);
			x.lineTo(cx + (dx * s) / 2, cy + (dy * s) / 2);
			x.lineTo(cx + (dx * s) / 2 - dx * 40, cy + (dy * s) / 2);
			x.stroke();
		}
		x.fillStyle = '#e8edf4';
		x.globalAlpha = 0.8;
		x.fillRect(146, 620, 220, 14);
		x.globalAlpha = 0.4;
		x.fillRect(186, 650, 140, 10);
	} else {
		for (let i = 0; i < 6; i++) {
			const col = i % 3;
			const row = Math.floor(i / 3);
			const g = x.createLinearGradient(0, 0, 160, 140);
			g.addColorStop(0, ['#23384a', '#2b3540', '#1d2f2b'][col]);
			g.addColorStop(1, '#0b1117');
			x.fillStyle = g;
			x.fillRect(12 + col * 166, 16 + row * 148, 156, 138);
		}
	}
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	return t;
}

function screen(w, h, kind) {
	return new THREE.MeshStandardMaterial({
		map: screenTexture(kind),
		emissive: 0xffffff,
		emissiveMap: screenTexture(kind),
		emissiveIntensity: 0.9,
		roughness: 0.08
	});
}

/** Rack recorder: 1.5U chassis, glossy fascia, drive bays, status LEDs. */
export function nvr(M, { bays = 4 } = {}) {
	const g = new THREE.Group();
	g.add(mesh(rbox(34, 5.2, 26, 0.5), M.graphite, [0, 2.6, 0]));
	g.add(mesh(rbox(33.4, 4.6, 0.6, 0.3), M.glass, [0, 2.6, 13.1]));
	for (let i = 0; i < bays; i++)
		g.add(mesh(rbox(5.2, 3.2, 0.3, 0.2), M.black, [-12 + i * 6, 2.6, 13.45]));
	[0x2fe6c8, 0x2fe6c8, 0x4c8dff, 0xffb547].forEach((c, i) =>
		g.add(mesh(new THREE.CircleGeometry(0.22, 16), M.led(c), [11.5 + i * 1.1, 3.3, 13.42]))
	);
	for (let i = 0; i < 14; i++)
		g.add(mesh(new THREE.BoxGeometry(0.3, 3.4, 0.1), M.rubber, [-14 + i * 1.4, 2.6, -13.02]));
	return g;
}

/** PoE switch: long 1U chassis with two rows of ports and link LEDs. */
export function poeSwitch(M, { ports = 16 } = {}) {
	const g = new THREE.Group();
	g.add(mesh(rbox(36, 4.4, 20, 0.4), M.graphite, [0, 2.2, 0]));
	g.add(mesh(new THREE.PlaneGeometry(35, 3.8), M.black, [0, 2.2, 10.03]));
	const perRow = Math.ceil(ports / 2);
	for (let r = 0; r < 2; r++) {
		for (let i = 0; i < perRow; i++) {
			const x = -14 + i * (26 / perRow) + (i >= perRow / 2 ? 1.2 : 0);
			g.add(mesh(new THREE.BoxGeometry(1.4, 1.1, 0.3), M.rubber, [x, 1.55 + r * 1.3, 10.1]));
			g.add(
				mesh(new THREE.CircleGeometry(0.12, 12), M.led(i % 5 ? 0x2fe6c8 : 0xffb547), [
					x - 0.45,
					2.2 + r * 1.3 - 0.05,
					10.06
				])
			);
		}
	}
	for (let i = 0; i < 2; i++)
		g.add(mesh(new THREE.BoxGeometry(1.5, 1.5, 0.3), M.metal, [13 + i * 2, 2.2, 10.1]));
	return g;
}

/** Face-recognition terminal on a short pedestal. */
export function faceTerminal(M) {
	const g = new THREE.Group();
	g.add(mesh(rbox(11.5, 20, 2.6, 0.9), M.graphite, [0, 15, 0]));
	g.add(mesh(new THREE.PlaneGeometry(10.2, 16.4), screen(10, 16, 'portrait'), [0, 14.3, 1.32]));
	[-1.3, 1.3].forEach((dx) =>
		g.add(mesh(new THREE.CircleGeometry(0.42, 24), M.lens, [dx, 23.6, 1.32]))
	);
	g.add(mesh(new THREE.CylinderGeometry(1.2, 1.6, 5, 32), M.brushed, [0, 2.5, 0]));
	g.add(mesh(new THREE.CylinderGeometry(4, 4.2, 0.8, 48), M.brushed, [0, 0.4, 0]));
	return g;
}

/** Card/QR reader: dark glass with a teal ring. */
export function reader(M) {
	const g = new THREE.Group();
	g.add(mesh(rbox(8.4, 13, 2.2, 0.8), M.graphite, [0, 6.5, 0]));
	g.add(mesh(rbox(7.6, 12.2, 0.2, 0.6), M.glass, [0, 6.5, 1.12]));
	g.add(mesh(new THREE.TorusGeometry(2, 0.12, 12, 64), M.led(0x2fe6c8), [0, 8.3, 1.25]));
	for (let r = 0; r < 3; r++)
		for (let c = 0; c < 3; c++)
			g.add(
				mesh(new THREE.CircleGeometry(0.34, 20), M.led(0x8a95a8), [
					-1.6 + c * 1.6,
					3.2 + r * 1.2 - 1.2,
					1.24
				])
			);
	g.rotation.x = -0.05;
	return g;
}

/** Villa door station: brushed aluminium, camera, grille, call button. */
export function doorStation(M) {
	const g = new THREE.Group();
	g.add(mesh(rbox(9, 20, 3, 0.7), M.brushed, [0, 10, 0]));
	g.add(mesh(rbox(7.6, 5.4, 0.3, 0.5), M.glass, [0, 16, 1.45]));
	g.add(mesh(new THREE.CircleGeometry(0.8, 32), M.lens, [0, 16.4, 1.62]));
	for (let r = 0; r < 4; r++)
		for (let c = 0; c < 7; c++)
			g.add(
				mesh(new THREE.CircleGeometry(0.16, 12), M.black, [-2.4 + c * 0.8, 10.8 - r * 0.8, 1.52])
			);
	g.add(
		mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.4, 48), M.metal, [0, 5, 1.55], [Math.PI / 2, 0, 0])
	);
	g.add(mesh(new THREE.TorusGeometry(1.45, 0.1, 12, 48), M.led(0x2fe6c8), [0, 5, 1.76]));
	return g;
}

/** 7″ indoor monitor on a desk stand. */
export function indoorStation(M) {
	const g = new THREE.Group();
	g.add(mesh(rbox(19, 12.4, 1.4, 0.6), M.white, [0, 8.5, 0], [-0.12, 0, 0]));
	g.add(
		mesh(
			new THREE.PlaneGeometry(16.8, 10.2),
			screen(17, 10, 'tiles'),
			[0, 8.58, 0.72],
			[-0.12, 0, 0]
		)
	);
	g.add(mesh(rbox(8, 1, 6, 0.4), M.white, [0, 0.5, -1.4]));
	g.add(mesh(rbox(1.4, 4, 1, 0.3), M.white, [0, 2.8, -1.6], [-0.3, 0, 0]));
	return g;
}

/** Point-to-point wireless bridge on a pole clamp. */
export function bridge(M) {
	const g = new THREE.Group();
	g.add(mesh(new THREE.CylinderGeometry(0.9, 0.9, 24, 32), M.brushed, [0, 12, -3]));
	g.add(mesh(rbox(12, 12, 3.2, 1.6), M.white, [0, 15, 0.2], [-0.08, 0.3, 0]));
	g.add(mesh(rbox(3, 2, 3, 0.4), M.brushed, [0, 15, -2], [0, 0.3, 0]));
	g.add(mesh(new THREE.CircleGeometry(0.2, 12), M.led(0x2fe6c8), [3.5, 10.8, 1.9]));
	return g;
}
