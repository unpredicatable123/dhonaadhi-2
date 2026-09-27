import { browser } from '$app/environment';

export const COMPARE_MAX = 4;
const KEY = 'dh-compare-v1';

export type CompareItem = {
	slug: string;
	modelNumber: string;
	name: string;
	href: string;
	image?: string;
};

/**
 * Compare selection (max 4), persisted per browser. Storage access is guarded:
 * private mode / blocked storage simply means the tray doesn't survive reloads.
 */
class CompareStore {
	items = $state<CompareItem[]>([]);
	/** True when no more products can be added. */
	full = $derived(this.items.length >= COMPARE_MAX);
	slugs = $derived(this.items.map((i) => i.slug));

	constructor() {
		if (!browser) return;
		this.items = read();
		window.addEventListener('storage', (e) => {
			if (e.key === KEY) this.items = read();
		});
	}

	has(slug: string) {
		return this.items.some((i) => i.slug === slug);
	}

	/** Returns false when the tray is full. */
	add(item: CompareItem): boolean {
		if (this.has(item.slug)) return true;
		if (this.full) return false;
		this.items = [...this.items, item];
		write(this.items);
		return true;
	}

	remove(slug: string) {
		this.items = this.items.filter((i) => i.slug !== slug);
		write(this.items);
	}

	toggle(item: CompareItem, on: boolean): boolean {
		if (on) return this.add(item);
		this.remove(item.slug);
		return true;
	}

	clear() {
		this.items = [];
		write(this.items);
	}
}

function read(): CompareItem[] {
	try {
		const v = JSON.parse(localStorage.getItem(KEY) ?? '[]') as unknown;
		return Array.isArray(v) ? (v as CompareItem[]).slice(0, COMPARE_MAX) : [];
	} catch {
		return [];
	}
}

function write(items: CompareItem[]) {
	try {
		localStorage.setItem(KEY, JSON.stringify(items));
	} catch {
		/* storage unavailable: keep in memory only */
	}
}

export const compare = new CompareStore();
