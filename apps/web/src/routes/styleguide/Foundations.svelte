<script lang="ts">
	import Logo from '$lib/components/brand/Logo.svelte';
	import { contrast } from '$lib/design/contrast';
	import { pairs, palette } from '$lib/design/tokens';
	import Specimen from './Specimen.svelte';

	const scale = [
		['display-2xl', 'text-display-2xl', 'font-display', 'Night, resolved.'],
		['display-xl', 'text-display-xl', 'font-display', 'Every angle.'],
		['h1', 'text-h1', 'font-display', 'Network cameras'],
		['h2', 'text-h2', 'font-display', 'Built for low light'],
		['h3', 'text-h3', 'font-display', 'Perimeter protection'],
		[
			'body-lg',
			'text-body-lg',
			'font-sans',
			'Full-colour video at 0.0005 lux, without a floodlight.'
		],
		['body', 'text-body', 'font-sans', 'Deep-learning filters discard leaves, rain and animals.'],
		['caption', 'text-caption', 'font-sans', 'Images are renders. Final appearance may vary.'],
		['mono-sm', 'text-mono-sm', 'font-mono uppercase tracking-[0.08em]', 'NX-4K-D72 · PERSON 0.98']
	] as const;
</script>

<Specimen
	title="Logo"
	note="Wordmark is outlined Clash Display 600; the monogram iris doubles as loader."
>
	<div class="grid gap-6 sm:grid-cols-2">
		<div
			class="grid place-items-center gap-6 rounded-panel bg-ink-950 p-10 hairline"
			data-theme="dark"
		>
			<Logo label="Dhonaadhi" class="h-10 text-mist-100" />
			<Logo label="Dhonaadhi" variant="monogram" class="size-20 text-mist-100" animated />
		</div>
		<div
			class="grid place-items-center gap-6 rounded-panel bg-paper-50 p-10 hairline"
			data-theme="light"
		>
			<Logo label="Dhonaadhi" class="h-10 text-ink-950" />
			<Logo label="Dhonaadhi" variant="monogram" class="size-20 text-ink-950" />
		</div>
	</div>
</Specimen>

<Specimen
	title="Colour"
	note="Raw palette. Components use semantic tokens (bg, surface, fg, accent…)."
>
	<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
		{#each Object.entries(palette) as [name, hex] (name)}
			<li class="overflow-hidden rounded-control hairline">
				<div class="h-16" style:background={hex}></div>
				<div class="p-2.5">
					<p class="text-caption font-medium">{name}</p>
					<p class="font-mono text-mono-sm text-fg-muted">{hex.toUpperCase()}</p>
				</div>
			</li>
		{/each}
	</ul>
</Specimen>

<Specimen
	title="Contrast"
	note="Computed live from tokens.ts; the same table is asserted in Vitest."
>
	<div class="overflow-x-auto">
		<table class="w-full min-w-[34rem] text-left text-sm">
			<thead class="eyebrow">
				<tr
					><th class="py-2">Sample</th><th>Pair</th><th>Use</th><th class="text-right">Ratio</th
					></tr
				>
			</thead>
			<tbody>
				{#each pairs as p (p.fg + p.bg)}
					{@const r = contrast(palette[p.fg], palette[p.bg])}
					<tr class="border-t border-line">
						<td class="py-2">
							<span
								class="inline-block rounded-chip px-2 py-0.5 font-medium"
								style:color={palette[p.fg]}
								style:background={palette[p.bg]}>Aa</span
							>
						</td>
						<td class="font-mono text-mono-sm">{p.fg} / {p.bg}</td>
						<td class="text-fg-muted">{p.use}</td>
						<td class="text-right font-mono tabular-nums">
							{r.toFixed(2)}
							<span class={r >= p.min ? 'text-accent' : 'text-danger'}
								>{r >= p.min ? 'pass' : 'fail'}</span
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Specimen>

<Specimen title="Type" note="Fluid clamp() scale, 375 → 1440px.">
	<div class="grid gap-6">
		{#each scale as [name, size, family, sample] (name)}
			<div class="grid gap-1">
				<p class="font-mono text-mono-sm text-fg-muted">{name}</p>
				<p class="{size} {family} truncate">{sample}</p>
			</div>
		{/each}
	</div>
</Specimen>
