import { describe, it, expect } from 'vitest';
import { generateSlug } from './slug';

describe('generateSlug', () => {
  it('returns a string of exactly 8 characters', () => {
    expect(generateSlug()).toHaveLength(8);
  });

  it('returns only URL-safe base64url characters (A-Z, a-z, 0-9, -, _)', () => {
    const slug = generateSlug();
    expect(slug).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('produces unique values across multiple calls', () => {
    const slugs = Array.from({ length: 10 }, () => generateSlug());
    const unique = new Set(slugs);
    expect(unique.size).toBeGreaterThan(1);
  });
});
