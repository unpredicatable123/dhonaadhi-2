import { env as priv } from '$env/dynamic/private';
import { env as pub } from '$env/dynamic/public';
import { z } from 'zod';

/**
 * Validated server environment. Two data sources are supported:
 * - `sanity`: live Content Lake (requires project id + dataset)
 * - `fixtures`: the seed dataset evaluated locally with groq-js (dev/CI without a Sanity project)
 */
const base = z.object({
	PUBLIC_SANITY_DATASET: z.string().min(1).default('production'),
	PUBLIC_SANITY_API_VERSION: z.string().default('2026-09-01'),
	PUBLIC_SANITY_STUDIO_URL: z.url().default('http://localhost:3333'),
	PUBLIC_SITE_URL: z.url().default('http://localhost:5173'),
	SANITY_API_READ_TOKEN: z.string().min(1).optional(),
	/** Webhook signing secret and Vercel ISR bypass token (Vercel requires ≥ 32 chars). */
	SANITY_REVALIDATE_SECRET: z.string().min(32).optional()
});

const schema = z.union([
	base.extend({
		PUBLIC_SANITY_PROJECT_ID: z.string().regex(/^[a-z0-9-]+$/),
		dataSource: z.literal('sanity').default('sanity')
	}),
	base.extend({
		PUBLIC_SANITY_PROJECT_ID: z.undefined().optional(),
		dataSource: z.literal('fixtures').default('fixtures')
	})
]);

const input = Object.fromEntries(
	Object.entries({ ...pub, ...priv }).filter(([, v]) => v !== '' && v !== undefined)
);
const parsed = schema.safeParse(input);
if (!parsed.success) {
	throw new Error(`Invalid environment:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
export type Env = typeof env;
