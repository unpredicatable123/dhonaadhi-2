import type { MotionPref } from '$lib/stores/motion.svelte';

declare global {
	namespace App {
		interface Locals {
			motionPref: MotionPref;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
