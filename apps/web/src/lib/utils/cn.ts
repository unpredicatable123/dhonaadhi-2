import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { createTV } from 'tailwind-variants';

/**
 * tailwind-merge must know our custom @theme scales, otherwise it mistakes
 * `text-caption` (a size) for a colour and drops it next to `text-fg`.
 */
export const twMergeConfig = {
	extend: {
		theme: {
			text: [
				'display-2xl',
				'display-xl',
				'h1',
				'h2',
				'h3',
				'body-lg',
				'body',
				'caption',
				'mono-sm'
			],
			radius: ['chip', 'control', 'panel', 'scene'],
			ease: ['lens', 'shutter']
		}
	}
};

const twMerge = extendTailwindMerge(twMergeConfig);

/** Merge conditional class lists, resolving Tailwind conflicts (last wins). */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/** tailwind-variants bound to the same merge config. Import `tv` from here, not the package. */
export const tv = createTV({ twMergeConfig });
