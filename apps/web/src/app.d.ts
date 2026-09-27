import type { SanityClient } from '@sanity/client';
import type { MotionPref } from '$lib/stores/motion.svelte';

declare global {
	namespace App {
		interface Locals {
			motionPref: MotionPref;
			/** True inside the Sanity Presentation tool (draft perspective + stega). */
			preview: boolean;
			/** Set by handlePreview in Sanity mode. */
			client?: SanityClient;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
