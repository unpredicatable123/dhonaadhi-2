import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const cyl = (rt, rb, h, seg = 64, open = false, t0 = 0, tl = Math.PI * 2) =>
	new THREE.CylinderGeometry(rt, rb, h, seg, 1, open, t0, tl);

function mesh(geo, mat, { pos = [0, 0, 0], rot = [0, 0, 0], name } = {}) {
	const m = new THREE.Mesh(geo, mat);
	m.position.set(...pos);
	m.rotation.set(...rot);
	m.castShadow = true;
	m.receiveShadow = true;
	if (name) m.name = name;
	return m;
}

/** Lens stack facing +Z: bezel ring, barrel, glass element. */
function lensAssembly(M, r = 1.1, depth = 1.2) {
	const g = new THREE.Group();
	g.add(mesh(new THREE.TorusGeometry(r * 1.25, r * 0.16, 24, 64), M.metal));
	g.add(
		mesh(cyl(r * 1.1, r * 1.1, depth, 48), M.black, {
			rot: [Math.PI / 2, 0, 0],
			pos: [0, 0, -depth / 2]
		})
	);
	g.add(
		mesh(new THREE.SphereGeometry(r, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.6), M.lens, {
			rot: [Math.PI / 2, 0, 0],
			pos: [0, 0, -r * 0.55]
		})
	);
	return g;
}

function ledRing(M, { count = 2, radius = 2, light = 'ir', size = 0.34 } = {}) {
	const g = new THREE.Group();
	const mat = light === 'white' ? M.warm : M.ir;
	for (let i = 0; i < count; i++) {
		const a = (i / count) * Math.PI * 2 + Math.PI / 2;
		g.add(
			mesh(new THREE.CircleGeometry(size, 24), mat, {
				pos: [Math.cos(a) * radius, Math.sin(a) * radius, 0.02]
			})
		);
	}
	return g;
}

/** Bullet: tube housing, sunshield, front glass, lens, LEDs, arm + base. Parts are named for the exploded view. */
export function bullet(M, { light = 'ir', color = 'white', solar = false } = {}) {
	const body = color === 'white' ? M.white : M.graphite;
	const cam = new THREE.Group();
	const housing = new THREE.Group();
	housing.name = 'housing';
	housing.add(mesh(cyl(3.1, 3.1, 13), body, { rot: [Math.PI / 2, 0, 0] }));
	housing.add(
		mesh(new THREE.SphereGeometry(3.1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), body, {
			rot: [-Math.PI / 2, 0, 0],
			pos: [0, 0, -6.5]
		})
	);
	cam.add(housing);

	const shield = mesh(cyl(3.55, 3.55, 14.6, 64, true, Math.PI * 0.64, Math.PI * 0.72), body, {
		rot: [Math.PI / 2, 0, 0],
		pos: [0, 0.1, 1.1],
		name: 'sunshield'
	});
	shield.material = body.clone();
	shield.material.side = THREE.DoubleSide;
	cam.add(shield);

	const front = new THREE.Group();
	front.name = 'front';
	front.add(mesh(new THREE.CircleGeometry(3.0, 64), M.glass));
	front.position.z = 6.52;
	cam.add(front);

	const optics = new THREE.Group();
	optics.name = 'lens';
	const lens = lensAssembly(M, 1.15, 2.2);
	lens.position.set(0, 0.5, 0);
	optics.add(lens);
	const leds = ledRing(M, {
		count: light === 'hybrid' ? 4 : 2,
		radius: 1.95,
		light: light === 'hybrid' ? 'white' : light
	});
	leds.position.y = 0.5;
	optics.add(leds);
	optics.position.z = 6.5;
	cam.add(optics);

	const sensor = new THREE.Group();
	sensor.name = 'sensor';
	sensor.add(mesh(new THREE.BoxGeometry(4.4, 4.4, 0.25), M.pcb));
	sensor.add(mesh(new THREE.BoxGeometry(1.4, 1.1, 0.3), M.black, { pos: [0, 0.5, 0.2] }));
	for (let i = 0; i < 6; i++)
		sensor.add(
			mesh(new THREE.BoxGeometry(0.4, 0.25, 0.2), M.gold, { pos: [-1.6 + i * 0.64, -1.5, 0.15] })
		);
	sensor.position.z = 3.2;
	sensor.visible = false; // only revealed by the exploded view
	cam.add(sensor);

	const mount = new THREE.Group();
	mount.name = 'mount';
	mount.add(mesh(new THREE.SphereGeometry(1.2, 32, 16), body, { pos: [0, -3.6, -2] }));
	mount.add(mesh(cyl(0.9, 1.1, 5), body, { pos: [0, -6.2, -2.4], rot: [0.12, 0, 0] }));
	mount.add(mesh(cyl(4.2, 4.4, 1.3), body, { pos: [0, -9.1, -2.8] }));
	cam.add(mount);

	cam.rotation.x = 0.1;
	cam.position.y = 9.8;
	const root = new THREE.Group();
	root.add(cam);
	if (solar) {
		// pole-mounted kit: camera arm clamps to the pole, panel on top
		mount.children[2].visible = false;
		cam.position.set(0, 16, 4);
		root.add(mesh(cyl(0.9, 0.9, 30), M.brushed, { pos: [0, 15, -3.6] }));
		root.add(mesh(cyl(2.4, 2.6, 0.8), M.brushed, { pos: [0, 0.4, -3.6] }));
		root.add(mesh(cyl(0.7, 0.7, 3.2), body, { rot: [Math.PI / 2, 0, 0], pos: [0, 7.3, -2.2] }));
		root.add(solarPanel(M));
	}
	return root;
}

function solarPanel(M) {
	const g = new THREE.Group();
	const tex = cellTexture();
	const cells = M.solar.clone();
	cells.map = tex;
	g.add(mesh(new THREE.BoxGeometry(16, 0.5, 11), M.brushed));
	g.add(
		mesh(new THREE.PlaneGeometry(15.4, 10.4), cells, {
			rot: [-Math.PI / 2, 0, 0],
			pos: [0, 0.27, 0]
		})
	);
	g.add(mesh(cyl(0.6, 0.6, 12), M.brushed, { pos: [0, -6, 0] }));
	g.children[2].visible = false;
	g.rotation.set(-0.55, 0.35, 0);
	g.position.set(0, 31, -3.6);
	return g;
}

function cellTexture() {
	const c = document.createElement('canvas');
	c.width = c.height = 512;
	const x = c.getContext('2d');
	x.fillStyle = '#0a1330';
	x.fillRect(0, 0, 512, 512);
	x.strokeStyle = '#8fa6c8';
	x.lineWidth = 2;
	for (let i = 0; i <= 8; i++) {
		x.beginPath();
		x.moveTo(i * 64, 0);
		x.lineTo(i * 64, 512);
		x.moveTo(0, i * 64);
		x.lineTo(512, i * 64);
		x.stroke();
	}
	return new THREE.CanvasTexture(c);
}

/** Dome: flat base, collar, smoked bubble with visible lens ball. */
export function dome(M, { color = 'white', light = 'ir' } = {}) {
	const body = color === 'white' ? M.white : M.graphite;
	const g = new THREE.Group();
	g.add(mesh(cyl(6.2, 6.4, 1.4), body, { pos: [0, 0.7, 0] }));
	g.add(mesh(cyl(5.4, 6.0, 1.6), body, { pos: [0, 2.2, 0] }));
	const ball = new THREE.Group();
	ball.add(mesh(new THREE.SphereGeometry(3.2, 48, 32), M.black));
	const lens = lensAssembly(M, 0.9, 1);
	lens.position.z = 3.1;
	ball.add(lens);
	const leds = ledRing(M, { count: 2, radius: 1.6, light });
	leds.position.z = 3.05;
	ball.add(leds);
	ball.rotation.x = 0.55;
	ball.position.y = 3.4;
	g.add(ball);
	g.add(
		mesh(new THREE.SphereGeometry(4.9, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), M.smoked, {
			pos: [0, 2.9, 0]
		})
	);
	return g;
}

/** Turret ("eyeball"): base cup and a sphere with an exposed black face. */
export function turret(M, { color = 'white', light = 'ir' } = {}) {
	const body = color === 'white' ? M.white : M.graphite;
	const g = new THREE.Group();
	g.add(mesh(cyl(5.2, 5.6, 1.6), body, { pos: [0, 0.8, 0] }));
	g.add(mesh(cyl(4.3, 5.0, 1.8), body, { pos: [0, 2.4, 0] }));
	const eye = new THREE.Group();
	eye.add(mesh(new THREE.SphereGeometry(3.9, 64, 48), body));
	eye.add(mesh(cyl(2.9, 2.9, 1.6, 64), M.black, { rot: [Math.PI / 2, 0, 0], pos: [0, 0, 3.25] }));
	eye.add(mesh(new THREE.CircleGeometry(2.8, 64), M.glass, { pos: [0, 0, 4.06] }));
	const lens = lensAssembly(M, 0.95, 1);
	lens.position.set(0, 0.35, 4.1);
	eye.add(lens);
	const leds = ledRing(M, { count: 2, radius: 1.8, light });
	leds.position.set(0, 0.35, 4.07);
	eye.add(leds);
	eye.rotation.x = 0.22;
	eye.position.y = 6.3;
	g.add(eye);
	return g;
}

/** PTZ: pendant arm, cylindrical head, lower dome with zoom lens, optional IR ring. */
export function ptz(M, { color = 'white', ir = true } = {}) {
	const body = color === 'white' ? M.white : M.graphite;
	const g = new THREE.Group();
	g.add(mesh(new RoundedBoxGeometry(5, 3, 5, 4, 0.8), body, { pos: [0, 16, -8] }));
	g.add(mesh(new RoundedBoxGeometry(7, 11, 1, 3, 0.4), body, { pos: [0, 15, -10.8] }));
	g.add(mesh(cyl(1.4, 1.4, 9), body, { rot: [Math.PI / 2, 0, 0], pos: [0, 16, -3.8] }));
	g.add(mesh(new THREE.SphereGeometry(1.8, 32, 16), body, { pos: [0, 16, 0.6] }));
	g.add(mesh(cyl(0.9, 0.9, 1.6), body, { pos: [0, 14.6, 0.6] }));
	const head = new THREE.Group();
	head.add(mesh(cyl(4.6, 5.2, 5.2), body));
	if (ir)
		head.add(
			mesh(new THREE.TorusGeometry(4.9, 0.35, 16, 64), M.ir, {
				rot: [Math.PI / 2, 0, 0],
				pos: [0, -1.6, 0]
			})
		);
	head.add(
		mesh(
			new THREE.SphereGeometry(4.5, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
			M.smoked,
			{ pos: [0, -2.6, 0] }
		)
	);
	const ball = new THREE.Group();
	ball.add(mesh(new THREE.SphereGeometry(3, 48, 32), M.black));
	const lens = lensAssembly(M, 1.2, 2);
	lens.position.z = 3;
	ball.add(lens);
	ball.rotation.x = 0.45;
	ball.position.y = -2.8;
	head.add(ball);
	head.position.set(0, 11.2, 0.6);
	g.add(head);
	return g;
}

/** Fisheye: a flat puck with a central hemispherical lens. */
export function fisheye(M, { color = 'white' } = {}) {
	const body = color === 'white' ? M.white : M.graphite;
	const g = new THREE.Group();
	g.add(mesh(cyl(7.2, 7.6, 1.8), body, { pos: [0, 0.9, 0] }));
	g.add(
		mesh(new THREE.SphereGeometry(7.2, 64, 16, 0, Math.PI * 2, 0, 0.35), body, {
			pos: [0, -4.9, 0]
		})
	);
	g.add(mesh(cyl(2.6, 2.6, 0.6), M.black, { pos: [0, 2.3, 0] }));
	g.add(
		mesh(new THREE.SphereGeometry(1.9, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), M.lens, {
			pos: [0, 2.5, 0]
		})
	);
	g.add(
		mesh(new THREE.TorusGeometry(2.5, 0.12, 12, 64), M.metal, {
			rot: [Math.PI / 2, 0, 0],
			pos: [0, 2.6, 0]
		})
	);
	g.rotation.x = 0.55;
	g.position.y = 3;
	return g;
}

/** Box camera body with an interchangeable lens barrel. */
export function box(M) {
	const g = new THREE.Group();
	g.add(mesh(new RoundedBoxGeometry(6.4, 6.2, 12, 4, 0.5), M.graphite, { pos: [0, 5.5, 0] }));
	g.add(mesh(cyl(2.5, 2.5, 7, 64), M.black, { rot: [Math.PI / 2, 0, 0], pos: [0, 5.5, 9.4] }));
	for (let i = 0; i < 3; i++)
		g.add(
			mesh(new THREE.TorusGeometry(2.55, 0.12, 12, 64), M.rubber, { pos: [0, 5.5, 7.4 + i * 1.8] })
		);
	const lens = lensAssembly(M, 1.9, 0.8);
	lens.position.set(0, 5.5, 12.95);
	g.add(lens);
	g.add(mesh(cyl(1, 1.4, 2.4), M.brushed, { pos: [0, 1.2, 0] }));
	g.add(mesh(cyl(3.2, 3.2, 0.8), M.brushed, { pos: [0, 0.4, 0] }));
	return g;
}

/** Bi-spectrum thermal: wide housing, sunshield, germanium + visible lenses side by side. */
export function thermal(M) {
	const g = new THREE.Group();
	const cam = new THREE.Group();
	cam.add(mesh(new RoundedBoxGeometry(9.5, 7, 16, 5, 1.2), M.white));
	cam.add(mesh(new RoundedBoxGeometry(11, 0.6, 18, 3, 0.3), M.white, { pos: [0, 3.9, 0.8] }));
	cam.add(mesh(new RoundedBoxGeometry(8.6, 5.8, 0.4, 3, 0.2), M.black, { pos: [0, -0.2, 8.05] }));
	const ge = lensAssembly(M, 1.5, 1.4);
	ge.children[2].material = M.germanium;
	ge.position.set(-2.1, -0.2, 8.3);
	cam.add(ge);
	const vis = lensAssembly(M, 1.0, 1.2);
	vis.position.set(2.3, -0.2, 8.3);
	cam.add(vis);
	cam.position.y = 11;
	cam.rotation.x = 0.08;
	g.add(cam);
	g.add(mesh(cyl(1.1, 1.3, 7), M.white, { pos: [0, 4.2, -2] }));
	g.add(mesh(cyl(4.4, 4.6, 1.3), M.white, { pos: [0, 0.65, -2] }));
	return g;
}
