import * as THREE from 'three';
import { createMaterials, createStudio } from './materials.js';
import * as cams from './cameras.js';
import * as devs from './devices.js';

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	preserveDrawingBuffer: true,
	alpha: false
});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
document.body.append(renderer.domElement);

const M = createMaterials();

export const builders = {
	bullet: (o) => cams.bullet(M, o),
	dome: (o) => cams.dome(M, o),
	turret: (o) => cams.turret(M, o),
	ptz: (o) => cams.ptz(M, o),
	fisheye: (o) => cams.fisheye(M, o),
	box: () => cams.box(M),
	thermal: () => cams.thermal(M),
	nvr: (o) => devs.nvr(M, o),
	switch: (o) => devs.poeSwitch(M, o),
	faceTerminal: () => devs.faceTerminal(M),
	reader: () => devs.reader(M),
	doorStation: () => devs.doorStation(M),
	indoorStation: () => devs.indoorStation(M),
	bridge: () => devs.bridge(M)
};

/** Radial studio backdrop matching the site's ink surfaces. */
function backdrop(w, h) {
	const c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	const x = c.getContext('2d');
	const g = x.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
	g.addColorStop(0, '#1d2632');
	g.addColorStop(0.55, '#10151d');
	g.addColorStop(1, '#0a0d12');
	x.fillStyle = g;
	x.fillRect(0, 0, w, h);
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	return t;
}

/** Frame an object: orbit angles in degrees, `fill` = fraction of the frame the bounds occupy. */
function frame(camera, object, { azimuth = -35, elevation = 14, fill = 0.72, lookY = 0.5 } = {}) {
	const box = new THREE.Box3().setFromObject(object);
	const size = box.getSize(new THREE.Vector3());
	const center = box.getCenter(new THREE.Vector3());
	const radius = size.length() / 2;
	const fov = THREE.MathUtils.degToRad(camera.fov);
	const dist = radius / Math.sin(fov / 2) / (fill * 1.35);
	const az = THREE.MathUtils.degToRad(azimuth);
	const el = THREE.MathUtils.degToRad(elevation);
	const target = new THREE.Vector3(center.x, box.min.y + size.y * lookY, center.z);
	camera.position.set(
		target.x + dist * Math.cos(el) * Math.sin(az),
		target.y + dist * Math.sin(el),
		target.z + dist * Math.cos(el) * Math.cos(az)
	);
	camera.lookAt(target);
	camera.near = dist / 50;
	camera.far = dist * 10;
	camera.updateProjectionMatrix();
}

/**
 * Render one product shot. Returns a PNG data URL at 2× the requested size
 * (the orchestrator downsamples = supersampling).
 */
window.shot = ({
	kind,
	options = {},
	width = 1200,
	height = 900,
	azimuth,
	elevation,
	fill,
	spin = 0
}) => {
	const W = width * 2;
	const H = height * 2;
	renderer.setPixelRatio(1);
	renderer.setSize(W, H, false);
	const { scene } = createStudio(renderer);
	scene.background = backdrop(W, H);
	const object = builders[kind](options);
	object.rotation.y += THREE.MathUtils.degToRad(spin);
	scene.add(object);
	const camera = new THREE.PerspectiveCamera(28, W / H);
	frame(camera, object, { azimuth, elevation, fill });
	renderer.render(scene, camera);
	const url = renderer.domElement.toDataURL('image/png');
	scene.traverse((o) => {
		if (o.geometry) o.geometry.dispose();
	});
	return url;
};

const smooth = (a, b, t) => {
	const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
	return x * x * (3 - 2 * x);
};

/** Part offsets at full separation (world units). */
const EXPLODE = {
	sunshield: [0, 5.5, 1],
	front: [0, 0, 11],
	lens: [0, 0, 7],
	sensor: [0, 0, 3],
	housing: [0, 0, -4],
	mount: [0, -4.5, -1]
};

let exploded;

/**
 * Exploded bullet at progress t ∈ [0,1]. Camera framing is fixed to the fully
 * exploded bounds so the sequence never zooms. Returns the image and the screen
 * position (%) of each part's centre for callout placement.
 */
window.exploded = ({ t, width = 1280, height = 720 }) => {
	const W = width * 2;
	const H = height * 2;
	renderer.setSize(W, H, false);
	if (!exploded) {
		const { scene } = createStudio(renderer);
		scene.background = backdrop(W, H);
		const object = builders.bullet({ light: 'hybrid' });
		scene.add(object);
		const cam = object.children[0];
		const parts = Object.fromEntries(Object.keys(EXPLODE).map((n) => [n, cam.getObjectByName(n)]));
		const base = Object.fromEntries(Object.entries(parts).map(([n, p]) => [n, p.position.clone()]));
		exploded = { scene, object, parts, base, camera: new THREE.PerspectiveCamera(26, W / H) };
		for (const [n, p] of Object.entries(parts))
			p.position.copy(base[n]).add(new THREE.Vector3(...EXPLODE[n]));
		frame(exploded.camera, object, { azimuth: -58, elevation: 16, fill: 0.9 });
	}
	const { scene, object, parts, base, camera } = exploded;
	const k = smooth(0.12, 0.82, t);
	for (const [n, p] of Object.entries(parts)) {
		p.position.copy(base[n]).addScaledVector(new THREE.Vector3(...EXPLODE[n]), k);
	}
	parts.sensor.visible = k > 0.05;
	object.rotation.y = THREE.MathUtils.degToRad(-12 + 24 * t);
	renderer.render(scene, camera);
	const anchors = Object.fromEntries(
		Object.entries(parts).map(([n, p]) => {
			const v = new THREE.Box3().setFromObject(p).getCenter(new THREE.Vector3()).project(camera);
			return [n, { x: ((v.x + 1) / 2) * 100, y: ((1 - v.y) / 2) * 100 }];
		})
	);
	return { url: renderer.domElement.toDataURL('image/png'), anchors };
};

window.ready = true;
