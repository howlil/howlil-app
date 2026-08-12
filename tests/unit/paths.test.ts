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
    expect(normalizeBase('///howlil-app///')).toBe('/howlil-app/');
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
    expect(withBase('/', '/')).toBe('/');
  });

  it('preserves query strings and fragments on internal routes', () => {
    expect(withBase('/projects?tag=Go', '/howlil-app/')).toBe('/howlil-app/projects?tag=Go');
    expect(withBase('/blog/post#section', '/howlil-app/')).toBe('/howlil-app/blog/post#section');
  });

  it('prefixes local public assets', () => {
    expect(withBase('/favicon.svg', '/howlil-app/')).toBe('/howlil-app/favicon.svg');
    expect(withBase('/images/blog/cover.jpg', '/howlil-app/')).toBe('/howlil-app/images/blog/cover.jpg');
  });

  it('returns the base itself for root navigation', () => {
    expect(withBase('/', '/howlil-app/')).toBe('/howlil-app/');
  });

  it('keeps external, protocol-relative, and fragment links unchanged', () => {
    expect(withBase('https://example.com', '/howlil-app/')).toBe('https://example.com');
    expect(withBase('//cdn.example.com/file.png', '/howlil-app/')).toBe('//cdn.example.com/file.png');
    expect(withBase('mailto:hello@example.com', '/howlil-app/')).toBe('mailto:hello@example.com');
    expect(withBase('#main-content', '/howlil-app/')).toBe('#main-content');
  });
});
