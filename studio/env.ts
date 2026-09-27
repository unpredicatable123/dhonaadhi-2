// Studio reads the monorepo root .env (see envDir in sanity.cli.ts).
export const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
export const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2026-09-01';
export const previewOrigin = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:5173';
