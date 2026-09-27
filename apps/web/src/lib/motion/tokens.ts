/** Motion tokens. CSS mirrors live in app.css (--ease-*, --dur-*). */
export const ease = {
	lens: [0.22, 1, 0.36, 1],
	shutter: [0.83, 0, 0.17, 1]
} as const;

export const duration = { fast: 0.18, base: 0.32, slow: 0.7, scene: 1.2 } as const;

export const cssEase = {
	lens: `cubic-bezier(${ease.lens.join(',')})`,
	shutter: `cubic-bezier(${ease.shutter.join(',')})`
} as const;

/** Named GSAP eases, registered via CustomEase in gsap.ts. */
export const gsapEase = { lens: 'lens', shutter: 'shutter' } as const;
