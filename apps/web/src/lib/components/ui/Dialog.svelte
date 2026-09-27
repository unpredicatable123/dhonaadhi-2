<script lang="ts" module>
	import { tv } from '$lib/utils/cn';

	const panel = tv({
		base: [
			'fixed m-0 max-h-none max-w-none bg-surface p-0 text-fg hairline',
			'backdrop:bg-ink-950/70 backdrop:backdrop-blur-sm',
			'open:flex open:flex-col'
		],
		variants: {
			placement: {
				center:
					'inset-0 m-auto h-fit max-h-[85dvh] w-[min(40rem,calc(100vw-2rem))] rounded-panel dialog-center',
				right: 'inset-y-0 right-0 left-auto h-dvh w-[min(26rem,100vw)] dialog-right',
				left: 'inset-y-0 left-0 right-auto h-dvh w-[min(26rem,100vw)] dialog-left',
				bottom: 'inset-x-0 top-auto bottom-0 max-h-[85dvh] w-full rounded-t-panel dialog-bottom',
				full: 'inset-0 h-dvh w-screen border-0 dialog-full'
			}
		},
		defaultVariants: { placement: 'center' }
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';
	import { cn } from '$lib/utils/cn';

	/**
	 * Modal / drawer on native <dialog>: focus trap, Esc, inert background and top-layer
	 * come from the platform. Focus returns to the opener on close.
	 */
	type Props = {
		open?: boolean;
		title: string;
		hideTitle?: boolean;
		placement?: 'center' | 'right' | 'left' | 'bottom' | 'full';
		children: Snippet;
		footer?: Snippet;
		/** false: no visible header bar (title stays for screen readers; Esc/backdrop close). */
		chrome?: boolean;
		class?: string;
		onclose?: () => void;
	};

	let {
		open = $bindable(false),
		title,
		hideTitle = false,
		placement,
		children,
		footer,
		chrome = true,
		class: className,
		onclose
	}: Props = $props();

	const id = $props.id();
	let dialog: HTMLDialogElement | undefined = $state();
	let opener: Element | null = null;

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) {
			opener = document.activeElement;
			dialog.showModal();
			document.documentElement.dataset.modal = 'open';
		} else if (!open && dialog.open) {
			dialog.close();
		}
	});

	function handleClose() {
		open = false;
		delete document.documentElement.dataset.modal;
		if (opener instanceof HTMLElement) opener.focus();
		onclose?.();
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby="{id}-title"
	class={panel({ placement, class: className })}
	onclose={handleClose}
	onclick={(e) => e.target === dialog && (open = false)}
	data-lenis-prevent
>
	{#if chrome}
		<header class="flex min-h-16 items-center gap-4 border-b border-line px-5">
			<h2
				id="{id}-title"
				class={cn('flex-1 font-display text-xl font-medium', hideTitle && 'sr-only')}
			>
				{title}
			</h2>
			<button
				type="button"
				class="ml-auto grid tap place-items-center rounded-control text-fg-muted hover:bg-raised hover:text-fg"
				onclick={() => (open = false)}
			>
				<X class="size-5" aria-hidden="true" />
				<span class="sr-only">Close</span>
			</button>
		</header>
	{:else}
		<h2 id="{id}-title" class="sr-only">{title}</h2>
	{/if}
	<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
		{@render children()}
	</div>
	{#if footer}
		<footer class="border-t border-line px-5 py-4">{@render footer()}</footer>
	{/if}
</dialog>

<style>
	dialog[open] {
		animation: var(--dialog-in) var(--dur-base) var(--ease-lens) both;
	}
	dialog::backdrop {
		animation: fade var(--dur-base) var(--ease-lens) both;
	}
	:global(.dialog-center) {
		--dialog-in: dialog-zoom;
	}
	:global(.dialog-right) {
		--dialog-in: dialog-from-right;
	}
	:global(.dialog-left) {
		--dialog-in: dialog-from-left;
	}
	:global(.dialog-bottom) {
		--dialog-in: dialog-from-bottom;
	}
	:global(.dialog-full) {
		--dialog-in: fade;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	@keyframes dialog-zoom {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
	}
	@keyframes dialog-from-right {
		from {
			transform: translateX(100%);
		}
	}
	@keyframes dialog-from-left {
		from {
			transform: translateX(-100%);
		}
	}
	@keyframes dialog-from-bottom {
		from {
			transform: translateY(100%);
		}
	}
</style>
