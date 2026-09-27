/** Command palette visibility (opened by the header button or ⌘K / Ctrl+K). */
class PaletteState {
	open = $state(false);
	initialQuery = $state('');

	show(query = '') {
		this.initialQuery = query;
		this.open = true;
	}

	hide() {
		this.open = false;
	}
}

export const palette = new PaletteState();
