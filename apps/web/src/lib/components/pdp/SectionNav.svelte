<script lang="ts">
	import { cn } from '$lib/utils/cn';

	/** Sticky in-page nav; the section in view is marked current. */
	let { sections, model }: { sections: { id: string; label: string }[]; model: string } = $props();

	let current = $state<string | undefined>();
	$effect(() => {
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) current = e.target.id;
			},
			{ rootMargin: '-45% 0px -50% 0px' }
		);
		for (const s of sections) {
			const el = document.getElementById(s.id);
			if (el) io.observe(el);
		}
		return () => io.disconnect();
	});
</script>

<nav
	aria-label="On this page"
	class="sticky top-0 z-30 border-y border-line bg-ink-950/92 backdrop-blur-xl print:hidden"
>
	<div class="container-site flex items-center gap-6 overflow-x-auto">
		<span class="hidden shrink-0 font-mono text-sm text-accent md:block">{model}</span>
		<ul class="flex gap-1">
			{#each sections as s (s.id)}
				<li>
					<a
						href="#{s.id}"
						aria-current={current === s.id ? 'location' : undefined}
						class={cn(
							'relative flex h-14 items-center px-3 text-sm whitespace-nowrap transition-colors',
							current === s.id ? 'text-fg' : 'text-fg-muted hover:text-fg'
						)}
					>
						{s.label}
						<span
							class={cn(
								'absolute inset-x-3 bottom-0 h-0.5 origin-left bg-accent-fill transition-transform duration-(--dur-base)',
								current === s.id ? 'scale-x-100' : 'scale-x-0'
							)}
						></span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>
