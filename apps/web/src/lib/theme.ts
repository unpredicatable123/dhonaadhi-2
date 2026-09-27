export type Theme = 'dark' | 'light';

/**
 * The site is light throughout (warm off-white, ink type, emerald accent). Kept as a
 * function so a future campaign page can opt into another theme in one place.
 */
export function themeFor(_pathname: string): Theme {
	return 'light';
}
