// @sanity/visual-editing/svelte ships no type declarations (v6.1). Typed from its source.
declare module '@sanity/visual-editing/svelte' {
	import type { Handle } from '@sveltejs/kit';
	import type { SanityClient } from '@sanity/client';
	import type { Component } from 'svelte';

	export function handlePreview(options: {
		client: SanityClient;
		preview?: {
			secret?: string;
			cookie?: string;
			endpoints?: { enable?: string; disable?: string };
		};
	}): Handle;

	export const VisualEditing: Component<{ zIndex?: number; keepStegaOnCopy?: boolean }>;
}
