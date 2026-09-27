<script lang="ts">
	import Logo from '$lib/components/brand/Logo.svelte';
	import { resolveLink } from '$lib/links';
	import { motion, type MotionPref } from '$lib/stores/motion.svelte';
	import { cn } from '$lib/utils/cn';
	import type { FooterData, Settings } from '$lib/sanity/types';

	let { settings, footer }: { settings: Settings; footer: FooterData | null } = $props();

	const year = new Date().getFullYear();
	const prefs: { value: MotionPref; label: string }[] = [
		{ value: 'system', label: 'System' },
		{ value: 'full', label: 'On' },
		{ value: 'reduced', label: 'Reduced' }
	];
</script>

<footer
	data-theme="dark"
	class="relative mt-32 border-t border-line bg-ink-950 print:hidden"
	data-print="hide"
>
	<div class="container-site grid gap-12 py-16 lg:grid-cols-12">
		<div class="grid content-start gap-5 lg:col-span-4">
			<a href="/" aria-label="{settings.brandName} home" class="w-fit">
				<Logo label={settings.brandName ?? ''} class="h-7 text-fg" />
			</a>
			{#if footer?.statement}<p class="max-w-[34ch] text-body-lg text-fg-muted">
					{footer.statement}
				</p>{/if}
			{#if settings.email}
				<a href="mailto:{settings.email}" class="w-fit font-mono text-sm text-fg hover:text-accent"
					>{settings.email}</a
				>
			{/if}
		</div>

		<nav aria-label="Footer" class="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
			{#each footer?.columns ?? [] as col (col._key)}
				<div>
					<h2 class="mb-3 font-sans text-sm font-medium text-fg">{col.heading}</h2>
					<ul class="grid">
						{#each col.links ?? [] as l (l._key)}
							<li>
								<a
									href={resolveLink(l)}
									class="flex min-h-10 items-center text-sm text-fg-muted transition-colors hover:text-fg"
									>{l.label}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</div>

	<div
		class="container-site flex flex-col gap-6 border-t border-line py-6 md:flex-row md:items-center"
	>
		<p class="text-caption text-fg-muted">© {year} {settings.companyName}. All rights reserved.</p>
		<ul class="flex flex-wrap gap-x-5">
			{#each footer?.legal ?? [] as l (l._key)}
				<li>
					<a
						href={resolveLink(l)}
						class="flex min-h-11 items-center text-caption text-fg-muted hover:text-fg">{l.label}</a
					>
				</li>
			{/each}
		</ul>
		<fieldset class="flex items-center gap-3 md:ml-auto">
			<legend class="sr-only">Motion</legend>
			<span class="text-caption text-fg-muted" aria-hidden="true">Motion</span>
			<div class="flex rounded-control p-0.5 hairline">
				{#each prefs as p (p.value)}
					<label
						class={cn(
							'relative flex h-10 cursor-pointer items-center rounded-[7px] px-3 text-caption transition-colors has-focus-visible:outline-2 has-focus-visible:outline-focus',
							motion.pref === p.value ? 'bg-raised text-fg' : 'text-fg-muted hover:text-fg'
						)}
					>
						<input
							type="radio"
							name="motion"
							value={p.value}
							checked={motion.pref === p.value}
							onchange={() => motion.set(p.value)}
							class="sr-only"
						/>
						{p.label}
					</label>
				{/each}
			</div>
		</fieldset>
	</div>
</footer>
