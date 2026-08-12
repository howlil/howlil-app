import { describe, expect, it } from 'vitest';
import { normalizeBase, withBase } from '../../src/lib/paths';

describe('normalizeBase', () => {
  it('normalizes root deployment', () => {
    expect(normalizeBase('/')).toBe('/');
    expect(normalizeBase('')).toBe('/');
  });

  it('normalizes a repository base with one leading and trailing slash', () => {
    expect(normalizeBase('howlil-app')).toBe('/howlil-app/');
    expect(normalizeBase('/howlil-app/')).toBe('/howlil-app/');
  });
});

describe('withBase', () => {
  it('prefixes a non-root base exactly once', () => {
    expect(withBase('/projects', '/howlil-app/')).toBe('/howlil-app/projects');
    expect(withBase('/howlil-app/projects', '/howlil-app/')).toBe('/howlil-app/projects');
  });

  it('keeps root deployment clean', () => {
    expect(withBase('/projects', '/')).toBe('/projects');
    expect(withBase('projects', '/')).toBe('/projects');
  });

  it('keeps external and fragment links unchanged', () => {
    expect(withBase('https://example.com', '/howlil-app/')).toBe('https://example.com');
    expect(withBase('#main-content', '/howlil-app/')).toBe('#main-content');
  });
});
