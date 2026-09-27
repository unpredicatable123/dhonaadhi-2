export type Theme = 'dark' | 'light';

/**
 * Mixed theme: the cinematic home and campaign pages stay dark ("Night Vision");
 * the catalogue (hub, listings, product detail, compare) is light for long reading
 * and spec comparison. Used by the server hook (first paint) and the layout (client nav).
 */
export function themeFor(pathname: string): Theme {
	return pathname === '/products' || pathname.startsWith('/products/') ? 'light' : 'dark';
}
