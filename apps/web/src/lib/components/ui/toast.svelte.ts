export type ToastTone = 'neutral' | 'success' | 'error';
export type ToastItem = { id: number; message: string; tone: ToastTone };

let next = 0;

/** App-wide toast queue. Rendered once by <Toaster> in the root layout. */
class ToastStore {
	items = $state<ToastItem[]>([]);

	show(message: string, tone: ToastTone = 'neutral', ms = 4000) {
		const id = ++next;
		this.items = [...this.items.slice(-2), { id, message, tone }];
		if (ms > 0) setTimeout(() => this.dismiss(id), ms);
		return id;
	}

	dismiss(id: number) {
		this.items = this.items.filter((t) => t.id !== id);
	}
}

export const toast = new ToastStore();
