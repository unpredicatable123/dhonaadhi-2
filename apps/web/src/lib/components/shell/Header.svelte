<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { ChevronDown, Menu, Search, Columns3 } from '@lucide/svelte';
	import Logo from '$lib/components/brand/Logo.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MegaMenu from './MegaMenu.svelte';
	import MobileNav from './MobileNav.svelte';
	import { resolveLink, paths } from '$lib/links';
	import { compare } from '$lib/stores/compare.svelte';
	import { palette } from './palette.svelte';
	import { cn } from '$lib/utils/cn';
	import type { CategoryTree, Navigation } from '$lib/sanity/types';

	let {
		brandName,
		navigation,
		categories
	}: { brandName: string; navigation: Navigation | null; categories: CategoryTree } = $props();

	let scrollY = $state(0);
	let lastY = 0;
	let hidden = $state(false);
	let open = $state<string | null>(null);
	let mobileOpen = $state(false);
	let header: HTMLElement;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	/** Transparent only while over the home hero. */
	const overHero = $derived(page.route.id === '/' && scrollY < 80 && !open);

	$effect(() => {
		const y = scrollY;
		const focusInside = header?.contains(document.activeElement);
		if (open || mobileOpen || focusInside || y < 160) hidden = false;
		else if (Math.abs(y - lastY) > 6) hidden = y > lastY;
		lastY = y;
	});

	afterNavigate(() => {
		open = null;
		mobileOpen = false;
	});

	function openSoon(key: string) {
		clearTimeout(closeTimer);
		open = key;
	}
	function closeSoon() {
		clearTimeout(closeTimer);
		closeTimer = setTimeout(() => (open = null), 180);
	}
	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			const key = open;
			open = null;
			header.querySelector<HTMLButtonElement>(`[data-trigger="${key}"]`)?.focus();
		}
	}
	function onfocusout(e: FocusEvent) {
		if (!header.contains(e.relatedTarget as Node | null)) open = null;
	}
</script>

<svelte:window bind:scrollY {onkeydown} />

<!-- Hover intent is delegated from the triggers inside; the header keeps its banner landmark role. Esc is handled on window so it also closes hover-opened panels. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<header
	bind:this={header}
	{onfocusout}
	onmouseleave={closeSoon}
	class={cn(
		'fixed inset-x-0 top-0 z-50 transition-[translate,background-color,border-color] duration-(--dur-base) ease-lens print:hidden',
		hidden && '-translate-y-full',
		overHero
			? 'border-b border-transparent bg-transparent'
			: 'border-b border-line bg-ink-950/80 backdrop-blur-xl backdrop-saturate-150'
	)}
	data-print="hide"
>
	<div class="container-site flex h-(--header-h) items-center gap-6">
		<a
			href="/"
			class="-ml-2 flex tap items-center rounded-control px-2 text-fg"
			aria-label="{brandName} home"
		>
			<Logo label={brandName} class="h-[22px]" />
		</a>

		<nav aria-label="Main" class="ml-4 hidden h-full lg:block">
			<ul class="flex h-full items-center gap-1">
				{#each navigation?.items ?? [] as item (item._key)}
					{@const href = resolveLink(item.link)}
					{@const hasMega = item.mega && item.mega !== 'none'}
					<li
						class="flex h-full items-center"
						onmouseenter={() => (hasMega ? openSoon(item._key) : closeSoon())}
					>
						{#if hasMega}
							<button
								type="button"
								data-trigger={item._key}
								aria-expanded={open === item._key}
								aria-controls="mega-{item._key}"
								onclick={() => (open = open === item._key ? null : item._key)}
								class={cn(
									'flex h-11 items-center gap-1.5 rounded-control px-3 text-sm font-medium transition-colors',
									open === item._key || page.url.pathname.startsWith(href)
										? 'text-fg'
										: 'text-fg/75 hover:text-fg'
								)}
							>
								{item.link?.label}
								<ChevronDown
									class={cn(
										'size-3.5 transition-transform duration-(--dur-base)',
										open === item._key && 'rotate-180'
									)}
									aria-hidden="true"
								/>
							</button>
						{:else}
							<a
								{href}
								class="flex h-11 items-center rounded-control px-3 text-sm font-medium text-fg/75 transition-colors hover:text-fg"
								>{item.link?.label}</a
							>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>

		<div class="ml-auto flex items-center gap-1.5">
			{#each navigation?.utility ?? [] as l (l._key)}
				<a
					href={resolveLink(l)}
					class="hidden h-11 items-center rounded-control px-3 text-sm text-fg-muted hover:text-fg xl:flex"
					>{l.label}</a
				>
			{/each}
			<button
				type="button"
				onclick={() => palette.show()}
				class="flex tap items-center gap-2 rounded-control px-2.5 text-fg/80 transition-colors hover:bg-raised hover:text-fg sm:border sm:border-line sm:pr-2 sm:pl-3"
			>
				<Search class="size-4" aria-hidden="true" />
				<span class="hidden text-sm sm:inline">Search</span>
				<kbd
					class="hidden rounded-chip border border-line px-1.5 font-mono text-[0.6875rem] text-fg-muted md:inline"
					>⌘K</kbd
				>
				<span class="sr-only sm:hidden">Search products</span>
			</button>
			{#if compare.items.length}
				<a
					href={paths.compare(compare.slugs)}
					data-compare-icon
					class="relative grid tap place-items-center rounded-control text-fg/80 hover:bg-raised hover:text-fg"
				>
					<Columns3 class="size-5" aria-hidden="true" />
					<span
						class="absolute top-1.5 right-1 grid size-4 place-items-center rounded-full bg-accent-fill font-mono text-[0.625rem] font-medium text-on-accent"
						>{compare.items.length}</span
					>
					<span class="sr-only">Compare {compare.items.length} products</span>
				</a>
			{/if}
			{#if navigation?.cta}
				<Button
					href={resolveLink(navigation.cta)}
					size="sm"
					variant="secondary"
					class="hidden md:inline-flex">{navigation.cta.label}</Button
				>
			{/if}
			<button
				type="button"
				class="grid tap place-items-center rounded-control text-fg hover:bg-raised lg:hidden"
				aria-expanded={mobileOpen}
				onclick={() => (mobileOpen = true)}
			>
				<Menu class="size-5" aria-hidden="true" /><span class="sr-only">Open menu</span>
			</button>
		</div>
	</div>

	{#each navigation?.items ?? [] as item (item._key)}
		{#if item.mega && item.mega !== 'none' && open === item._key}
			<MegaMenu id="mega-{item._key}" {item} {categories} onenter={() => openSoon(item._key)} />
		{/if}
	{/each}
</header>

{#if open}
	<div
		class="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-[2px] transition-opacity"
		aria-hidden="true"
	></div>
{/if}

<MobileNav bind:open={mobileOpen} {brandName} {navigation} {categories} />
