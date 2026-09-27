import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/** Deterministic PRNG so every mode renders the identical street. */
function rng(seed) {
	let s = seed >>> 0;
	return () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
}

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.append(renderer.domElement);

function windowsTexture(rand, lit) {
	const c = document.createElement('canvas');
	c.width = 256;
	c.height = 512;
	const x = c.getContext('2d');
	x.fillStyle = lit ? '#0d1016' : '#ebe5d9';
	x.fillRect(0, 0, 256, 512);
	for (let r = 0; r < 24; r++) {
		for (let k = 0; k < 8; k++) {
			const on = lit && rand() < 0.2;
			const warm = rand() < 0.7;
			x.fillStyle = on
				? warm
					? `hsl(38 ${60 + rand() * 30}% ${55 + rand() * 20}%)`
					: `hsl(200 40% ${60 + rand() * 20}%)`
				: lit
					? '#141922'
					: `hsl(40 6% ${52 + rand() * 12}%)`;
			x.fillRect(8 + k * 31, 8 + r * 21, 22, 13);
		}
	}
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	return t;
}

function buildStreet(mode) {
	// The hero is a calm daylight street (the site is light); night modes are for the dusk comparison.
	const night = mode !== 'day' && mode !== 'hero';
	const rand = rng(7);
	const scene = new THREE.Scene();
	const sky = document.createElement('canvas');
	sky.width = 4;
	sky.height = 256;
	const sx = sky.getContext('2d');
	const sg = sx.createLinearGradient(0, 0, 0, 256);
	if (night) {
		sg.addColorStop(0, '#03050a');
		sg.addColorStop(0.7, '#0b1422');
		sg.addColorStop(1, '#1b2432');
	} else {
		sg.addColorStop(0, '#d9d7cf');
		sg.addColorStop(1, '#f4f2ec');
	}
	sx.fillStyle = sg;
	sx.fillRect(0, 0, 4, 256);
	scene.background = new THREE.CanvasTexture(sky);
	scene.background.colorSpace = THREE.SRGBColorSpace;
	scene.fog = new THREE.FogExp2(night ? 0x0a111c : 0xeeebe4, night ? 0.01 : 0.0035);

	// LumaNight: same night scene, but the sensor 'sees' it — lifted ambient keeps full colour.
	const luma = mode === 'luma';
	scene.add(
		new THREE.HemisphereLight(
			luma ? 0x9fb6d8 : night ? 0x2a3b55 : 0xf3efe6,
			night ? 0x1a1712 : 0x5a5248,
			luma ? 1.5 : night ? 0.35 : 1.6
		)
	);
	const sun = new THREE.DirectionalLight(
		night ? 0x8aa2c8 : 0xfff1dc,
		luma ? 1.1 : night ? 0.25 : 2.6
	);
	sun.position.set(-40, 60, 20);
	sun.castShadow = true;
	sun.shadow.mapSize.set(2048, 2048);
	Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, far: 200 });
	scene.add(sun);

	const asphalt = new THREE.MeshPhysicalMaterial({
		color: night ? 0x1a1d22 : 0x5c5c5a,
		roughness: night ? 0.32 : 0.8,
		metalness: 0.05,
		clearcoat: night ? 0.6 : 0
	});
	const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 260), asphalt);
	road.rotation.x = -Math.PI / 2;
	road.receiveShadow = true;
	scene.add(road);
	const walkMat = new THREE.MeshStandardMaterial({
		color: night ? 0x2a2e35 : 0xd6d1c6,
		roughness: 0.85
	});
	for (const side of [-1, 1]) {
		const walk = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 260), walkMat);
		walk.position.set(side * 10, 0.15, 0);
		walk.receiveShadow = true;
		scene.add(walk);
	}
	const lineMat = new THREE.MeshBasicMaterial({ color: night ? 0x8d8f86 : 0xe8e6da });
	for (let z = -120; z < 60; z += 8) {
		const l = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 3.5), lineMat);
		l.rotation.x = -Math.PI / 2;
		l.position.set(0, 0.01, z);
		scene.add(l);
	}

	for (const side of [-1, 1]) {
		for (let z = 40; z > -160;) {
			const w = 10 + rand() * 12;
			const h = 14 + rand() * 46;
			const d = 12 + rand() * 6;
			const tex = windowsTexture(rand, night);
			tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
			tex.repeat.set(w / 7, h / 10);
			const mat = new THREE.MeshStandardMaterial({
				color: night ? 0x3a414c : 0xf4f0e8,
				map: tex,
				emissive: night ? 0xffffff : 0x000000,
				emissiveMap: night ? tex : null,
				emissiveIntensity: night ? 0.55 : 0,
				roughness: 0.7
			});
			const b = new THREE.Mesh(new THREE.BoxGeometry(d, h, w), mat);
			b.position.set(side * (13 + d / 2), h / 2, z - w / 2);
			b.castShadow = b.receiveShadow = true;
			scene.add(b);
			z -= w + 0.6;
		}
	}

	// Streetlights: emissive heads everywhere, real spot lights only on the nearest few.
	const poleMat = new THREE.MeshStandardMaterial({
		color: 0x2a2f36,
		roughness: 0.5,
		metalness: 0.6
	});
	const lampMat = new THREE.MeshStandardMaterial({
		color: 0xffe7b8,
		emissive: night ? 0xffd9a0 : 0x000000,
		emissiveIntensity: 6
	});
	for (let i = 0; i < 9; i++) {
		const z = 20 - i * 22;
		const side = i % 2 ? 1 : -1;
		const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 9), poleMat);
		pole.position.set(side * 7.8, 4.5, z);
		scene.add(pole);
		const head = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.6), lampMat);
		head.position.set(side * 7.0, 9, z);
		scene.add(head);
		if (night && i < 5) {
			const s = new THREE.SpotLight(0xffd6a0, 260, 36, 0.85, 0.7, 1.6);
			s.position.set(side * 6.6, 8.8, z);
			s.target.position.set(side * 3, 0, z);
			s.castShadow = i < 3;
			scene.add(s, s.target);
		}
	}

	// Subjects used by the detection overlay.
	const car = new THREE.Group();
	const paint = new THREE.MeshPhysicalMaterial({
		color: 0x7a1f28,
		roughness: 0.3,
		metalness: 0.6,
		clearcoat: 1
	});
	car.add(new THREE.Mesh(new RoundedBoxGeometry(2.1, 0.9, 4.6, 4, 0.3), paint).translateY(0.75));
	car.add(
		new THREE.Mesh(
			new RoundedBoxGeometry(1.8, 0.7, 2.4, 4, 0.3),
			new THREE.MeshPhysicalMaterial({ color: 0x0b0e13, roughness: 0.05, clearcoat: 1 })
		)
			.translateY(1.45)
			.translateZ(-0.2)
	);
	const tyre = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 });
	for (const [x, z] of [
		[-1, 1.5],
		[1, 1.5],
		[-1, -1.5],
		[1, -1.5]
	]) {
		const w = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 24), tyre);
		w.rotation.z = Math.PI / 2;
		w.position.set(x, 0.38, z);
		car.add(w);
	}
	const head = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		emissive: night ? 0xfff3dc : 0x000000,
		emissiveIntensity: 3
	});
	for (const x of [-0.7, 0.7])
		car.add(
			new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.16, 0.05), head)
				.translateX(x)
				.translateY(0.9)
				.translateZ(2.31)
		);
	const tail = new THREE.MeshStandardMaterial({
		color: 0x5a0a0e,
		emissive: night ? 0xff2a36 : 0x000000,
		emissiveIntensity: 3
	});
	for (const x of [-0.75, 0.75])
		car.add(
			new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.14, 0.05), tail)
				.translateX(x)
				.translateY(0.95)
				.translateZ(-2.31)
		);
	if (night) {
		const beam = new THREE.SpotLight(0xfff1d6, 60, 30, 0.45, 0.6, 1.5);
		beam.position.set(0, 0.9, 2.3);
		beam.target.position.set(0, 0, 14);
		car.add(beam, beam.target);
	}
	car.traverse((o) => (o.castShadow = true));
	// Hero: right lane, so both subjects share the right half of the frame.
	car.position.set(mode === 'hero' ? 3.4 : -3.2, 0, mode === 'hero' ? -12 : -8);
	car.rotation.y = Math.PI;
	scene.add(car);

	const person = new THREE.Group();
	const cloth = new THREE.MeshStandardMaterial({ color: 0x3a3632, roughness: 0.8 });
	const skin = new THREE.MeshStandardMaterial({ color: 0xa87858, roughness: 0.7 });
	person.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.9, 8, 16), cloth).translateY(1.1));
	person.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), skin).translateY(1.82));
	for (const x of [-0.12, 0.12])
		person.add(
			new THREE.Mesh(
				new THREE.CapsuleGeometry(0.1, 0.62, 6, 12),
				new THREE.MeshStandardMaterial({ color: 0x15181d })
			)
				.translateX(x)
				.translateY(0.42)
		);
	person.add(
		new THREE.Mesh(
			new THREE.BoxGeometry(0.3, 0.4, 0.14),
			new THREE.MeshStandardMaterial({ color: 0xc7a14a })
		)
			.translateX(0.3)
			.translateY(1.0)
	);
	person.traverse((o) => (o.castShadow = true));
	person.position.set(8.6, 0.3, 1);
	person.rotation.y = -0.4;
	scene.add(person);

	return { scene, subjects: { PERSON: person, VEHICLE: car } };
}

function screenBox(obj, camera, pad = 0.12) {
	const box = new THREE.Box3().setFromObject(obj);
	const pts = [];
	for (const x of [box.min.x, box.max.x])
		for (const y of [box.min.y, box.max.y])
			for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z).project(camera));
	const xs = pts.map((p) => (p.x + 1) / 2);
	const ys = pts.map((p) => (1 - p.y) / 2);
	const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
	const pw = (x1 - x0) * pad;
	const ph = (y1 - y0) * pad * 0.5;
	return {
		x: (x0 - pw) * 100,
		y: (y0 - ph) * 100,
		w: (x1 - x0 + 2 * pw) * 100,
		h: (y1 - y0 + 2 * ph) * 100
	};
}

const isNight = (mode) => mode === 'night' || mode === 'luma';

/** mode: 'day' | 'night' | 'luma' | 'hero'. Conventional mono/grain is applied by the orchestrator. */
window.city = ({ mode, width, height }) => {
	renderer.setPixelRatio(1);
	renderer.setSize(width, height, false);
	const { scene, subjects } = buildStreet(mode);
	const camera = new THREE.PerspectiveCamera(mode === 'hero' ? 46 : 42, width / height, 0.1, 400);
	// Hero: framed so both subjects sit in the right half; the left half stays calm for copy.
	if (mode === 'hero') {
		camera.position.set(-2.5, 6.4, 21);
		camera.lookAt(-4.5, 2.6, -30);
	} else {
		camera.position.set(3.5, 5.5, 18);
		camera.lookAt(0, 2.2, -30);
	}
	camera.updateMatrixWorld();
	renderer.toneMappingExposure = { day: 1.0, night: 0.9, luma: 1.35, hero: 1.0 }[mode];
	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
	if (isNight(mode))
		composer.addPass(
			new UnrealBloomPass(
				new THREE.Vector2(width, height),
				mode === 'luma' ? 0.25 : 0.45,
				0.5,
				0.88
			)
		);
	composer.addPass(new OutputPass());
	composer.render();
	const detections = Object.entries(subjects).map(([label, obj]) => ({
		label,
		...screenBox(obj, camera)
	}));
	return { url: renderer.domElement.toDataURL('image/png'), detections };
};

window.ready = true;
