import type { Handle } from '@sveltejs/kit';
import { MOTION_COOKIE, parseMotionPref } from '$lib/stores/motion.svelte';

export const handle: Handle = async ({ event, resolve }) => {
	const motionPref = parseMotionPref(event.cookies.get(MOTION_COOKIE));
	event.locals.motionPref = motionPref;

	return resolve(event, {
		// 'system' leaves the decision to CSS/JS matchMedia; explicit prefs render server-side.
		transformPageChunk: ({ html }) =>
			html.replace('%dh.motion%', motionPref === 'reduced' ? 'reduced' : 'full'),
		preload: ({ type }) => type === 'js' || type === 'css'
	});
};
