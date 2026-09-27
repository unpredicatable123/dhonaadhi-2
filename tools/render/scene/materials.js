import * as THREE from 'three';

/** Shared PBR materials. Housings are original, brand-free industrial design. */
export function createMaterials() {
	const std = (o) => new THREE.MeshStandardMaterial(o);
	const phys = (o) => new THREE.MeshPhysicalMaterial(o);
	return {
		white: phys({ color: 0xe9edf1, roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
		graphite: phys({ color: 0x2a2f37, roughness: 0.45, clearcoat: 0.3 }),
		black: std({ color: 0x0b0d10, roughness: 0.55 }),
		rubber: std({ color: 0x15181c, roughness: 0.9 }),
		metal: std({ color: 0xb9c0c8, metalness: 1, roughness: 0.28 }),
		brushed: std({ color: 0x8e969f, metalness: 0.9, roughness: 0.42 }),
		glass: phys({
			color: 0x05070a,
			roughness: 0.04,
			metalness: 0.1,
			clearcoat: 1,
			clearcoatRoughness: 0.02
		}),
		smoked: phys({
			color: 0x1a1f26,
			roughness: 0.05,
			transmission: 0.55,
			thickness: 0.4,
			ior: 1.5,
			transparent: true,
			opacity: 0.92,
			clearcoat: 1
		}),
		lens: phys({
			color: 0x0a1020,
			metalness: 0.3,
			roughness: 0.05,
			clearcoat: 1,
			sheen: 1,
			sheenColor: 0x3b2a6b
		}),
		germanium: phys({
			color: 0x2b2230,
			metalness: 0.85,
			roughness: 0.12,
			iridescence: 1,
			iridescenceIOR: 1.8
		}),
		ir: std({ color: 0x2a0d10, roughness: 0.3, emissive: 0x3a0508, emissiveIntensity: 0.4 }),
		warm: std({ color: 0xf5e6c8, roughness: 0.3, emissive: 0xffe2a8, emissiveIntensity: 0.25 }),
		led: (hex) => std({ color: hex, emissive: hex, emissiveIntensity: 2.2 }),
		pcb: std({ color: 0x0f2a24, roughness: 0.6 }),
		gold: std({ color: 0xc9a44c, metalness: 1, roughness: 0.3 }),
		solar: phys({ color: 0x0b1530, roughness: 0.15, clearcoat: 1, metalness: 0.4 })
	};
}

/** Soft studio: environment reflections + key/fill/rim, plus a contact shadow disc. */
export function createStudio(renderer, { rim = 0xffffff } = {}) {
	const scene = new THREE.Scene();
	const pmrem = new THREE.PMREMGenerator(renderer);
	scene.environment = pmrem.fromScene(new RoomEnvironmentLite(), 0.04).texture;
	scene.environmentIntensity = 0.55;

	const key = new THREE.DirectionalLight(0xfff4e6, 2.6);
	key.position.set(-18, 26, 22);
	key.castShadow = true;
	key.shadow.mapSize.set(2048, 2048);
	key.shadow.camera.left = key.shadow.camera.bottom = -30;
	key.shadow.camera.right = key.shadow.camera.top = 30;
	key.shadow.radius = 8;
	key.shadow.bias = -0.0004;
	scene.add(key);

	const fill = new THREE.DirectionalLight(0xf4f1ea, 0.6);
	fill.position.set(22, 8, 14);
	scene.add(fill);

	const rimLight = new THREE.DirectionalLight(rim, 0.55);
	rimLight.position.set(14, 4, -26);
	scene.add(rimLight);

	const floor = new THREE.Mesh(
		new THREE.PlaneGeometry(400, 400),
		new THREE.ShadowMaterial({ opacity: 0.22 })
	);
	floor.rotation.x = -Math.PI / 2;
	floor.receiveShadow = true;
	scene.add(floor);
	return { scene, floor };
}

/** Minimal RoomEnvironment clone (bright panels in a dark room) — keeps reflections subtle and cool. */
class RoomEnvironmentLite extends THREE.Scene {
	constructor() {
		super();
		const room = new THREE.Mesh(
			new THREE.BoxGeometry(40, 20, 40),
			new THREE.MeshBasicMaterial({ color: 0x2a2a28, side: THREE.BackSide })
		);
		this.add(room);
		const panel = (w, h, x, y, z, ry, intensity, color = 0xffffff) => {
			const m = new THREE.Mesh(
				new THREE.PlaneGeometry(w, h),
				new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) })
			);
			m.position.set(x, y, z);
			m.rotation.y = ry;
			m.lookAt(0, 0, 0);
			this.add(m);
		};
		panel(14, 6, -12, 8, 10, 0, 6);
		panel(10, 4, 14, 4, 6, 0, 2.5, 0xf4f1ea);
		panel(20, 2, 0, 9.5, -12, 0, 3);
		panel(6, 6, 0, -9, 0, 0, 0.6);
	}
}
