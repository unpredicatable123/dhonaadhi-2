import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
	it('keeps custom type sizes alongside semantic colours', () => {
		expect(cn('text-caption font-medium text-fg')).toBe('text-caption font-medium text-fg');
	});
	it('resolves conflicts within the same scale (last wins)', () => {
		expect(cn('text-h2', 'text-h1')).toBe('text-h1');
		expect(cn('rounded-chip', 'rounded-panel')).toBe('rounded-panel');
	});
});
