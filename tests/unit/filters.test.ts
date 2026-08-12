import { describe, expect, it } from 'vitest';
import { matchesTag, normalizeTag } from '../../src/lib/filters';

describe('normalizeTag', () => {
  it('normalizes casing and surrounding whitespace only', () => {
    expect(normalizeTag('  React.js  ')).toBe('react.js');
    expect(normalizeTag('Google OAuth')).toBe('google oauth');
  });
});

describe('matchesTag', () => {
  it('matches the same normalized tag', () => {
    expect(matchesTag('Go', 'Go')).toBe(true);
    expect(matchesTag('React.js', 'react.js')).toBe(true);
  });

  it('does not match substrings or related names', () => {
    expect(matchesTag('Google OAuth', 'Go')).toBe(false);
    expect(matchesTag('JavaScript', 'Java')).toBe(false);
    expect(matchesTag('TypeScript', 'Script')).toBe(false);
  });
});
