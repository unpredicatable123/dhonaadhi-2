import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

// Dev-only component catalogue. Production builds return 404.
export const prerender = false;

export function load() {
	if (!dev) error(404, 'Not found');
	return {};
}
