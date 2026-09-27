import crypto from 'node:crypto';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handlePreview } from '@sanity/visual-editing/svelte';
import { MOTION_COOKIE, parseMotionPref } from '$lib/stores/motion.svelte';
import { env } from '$lib/server/env';
import { themeFor } from '$lib/theme';
import { serverClient } from '$lib/server/sanity';

const motion: Handle = async ({ event, resolve }) => {
	const motionPref = parseMotionPref(event.cookies.get(MOTION_COOKIE));
	event.locals.motionPref = motionPref;
	event.locals.preview ??= false;
	return resolve(event, {
		// 'system' leaves the decision to CSS/JS matchMedia; explicit prefs render server-side.
		transformPageChunk: ({ html }) =>
			html
				.replace('%dh.motion%', motionPref === 'reduced' ? 'reduced' : 'full')
				.replace('%dh.theme%', themeFor(event.url.pathname)),
		preload: ({ type }) => type === 'js' || type === 'css' || type === 'font'
	});
};

/**
 * Presentation-tool draft mode. The preview secret must be stable across server
 * instances, so it is derived from the viewer token rather than generated per boot.
 */
const preview: Handle | undefined =
	serverClient && env.SANITY_API_READ_TOKEN
		? handlePreview({
				client: serverClient.withConfig({ token: env.SANITY_API_READ_TOKEN }),
				preview: {
					secret: crypto.createHash('sha256').update(env.SANITY_API_READ_TOKEN).digest('hex'),
					endpoints: { enable: '/api/preview/enable', disable: '/api/preview/disable' }
				}
			})
		: undefined;

export const handle: Handle = preview ? sequence(preview, motion) : motion;
