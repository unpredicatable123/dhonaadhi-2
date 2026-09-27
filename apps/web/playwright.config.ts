import { defineConfig, devices } from '@playwright/test';

/**
 * e2e runs against a production build served by `vite preview`. With no Sanity project
 * configured the app uses the seed fixtures, so the suite is deterministic in CI.
 */
export default defineConfig({
	testDir: 'e2e',
	testMatch: '**/*.e2e.ts',
	timeout: 60_000,
	expect: { timeout: 10_000 },
	fullyParallel: true,
	retries: process.env.CI ? 1 : 0,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'retain-on-failure',
		...devices['Desktop Chrome'],
		viewport: { width: 1440, height: 900 }
	},
	webServer: {
		command: 'pnpm exec cross-env E2E_BUILD=1 vite build && pnpm preview --port 4173 --strictPort',
		port: 4173,
		timeout: 240_000,
		reuseExistingServer: !process.env.CI
	}
});
