<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	type Tab = { id: string; label: string };
	type Props = {
		tabs: Tab[];
		active?: string;
		label: string;
		panel: Snippet<[string]>;
		class?: string;
	};

	let { tabs, active = $bindable(tabs[0]?.id), label, panel, class: className }: Props = $props();
	const base = $props.id();
	let buttons: HTMLButtonElement[] = $state([]);

	// WAI-ARIA tabs pattern: automatic activation, arrow/Home/End keys.
	function onkeydown(e: KeyboardEvent, i: number) {
		const last = tabs.length - 1;
		const next =
			e.key === 'ArrowRight'
				? i === last
					? 0
					: i + 1
				: e.key === 'ArrowLeft'
					? i === 0
						? last
						: i - 1
					: e.key === 'Home'
						? 0
						: e.key === 'End'
							? last
							: -1;
		if (next < 0) return;
		e.preventDefault();
		active = tabs[next].id;
		buttons[next]?.focus();
	}
</script>

<div class={className}>
	<div role="tablist" aria-label={label} class="flex gap-1 border-b border-line">
		{#each tabs as t, i (t.id)}
			<button
				bind:this={buttons[i]}
				role="tab"
				type="button"
				id="{base}-tab-{t.id}"
				aria-selected={active === t.id}
				aria-controls="{base}-panel-{t.id}"
				tabindex={active === t.id ? 0 : -1}
				onclick={() => (active = t.id)}
				onkeydown={(e) => onkeydown(e, i)}
				class={cn(
					'relative h-11 px-4 text-sm font-medium transition-colors duration-(--dur-fast)',
					active === t.id ? 'text-fg' : 'text-fg-muted hover:text-fg'
				)}
			>
				{t.label}
				<span
					class={cn(
						'absolute inset-x-3 -bottom-px h-0.5 origin-left bg-accent-fill transition-transform duration-(--dur-base) ease-lens',
						active === t.id ? 'scale-x-100' : 'scale-x-0'
					)}
				></span>
			</button>
		{/each}
	</div>
	{#each tabs as t (t.id)}
		<div
			role="tabpanel"
			id="{base}-panel-{t.id}"
			aria-labelledby="{base}-tab-{t.id}"
			hidden={active !== t.id}
			tabindex="0"
			class="pt-6 focus-visible:outline-offset-4"
		>
			{#if active === t.id}{@render panel(t.id)}{/if}
		</div>
	{/each}
</div>
