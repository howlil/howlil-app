import {describe, expect, it} from 'vitest';
import {
  getFeaturedProjects,
  getMoreProjects,
  getProjectVisual,
  type ProjectEntry,
} from '../../src/features/projects/model';

function project(
  slug: string,
  date: string,
  featured = false,
  featuredRank?: number,
): ProjectEntry {
  return {
    slug,
    data: {
      title: slug,
      type: 'side-project',
      date,
      excerpt: `${slug} excerpt`,
      tags: [],
      featured,
      featuredRank,
      engineeringFocus: [],
      verifiedEvidence: [],
    },
  } as unknown as ProjectEntry;
}

describe('project model', () => {
  it('orders featured projects by explicit portfolio rank', () => {
    const projects = [
      project('older', '2024-01-01', true, 2),
      project('newer', '2026-01-01', true, 1),
      project('archive', '2026-09-01'),
    ];

    expect(getFeaturedProjects(projects).map((entry) => entry.slug)).toEqual(['newer', 'older']);
    expect(getMoreProjects(projects).map((entry) => entry.slug)).toEqual(['archive']);
  });

  it('falls back to newest projects when no project is explicitly featured', () => {
    const projects = [
      project('old', '2024-01-01'),
      project('new', '2026-01-01'),
    ];

    expect(getFeaturedProjects(projects, 1).map((entry) => entry.slug)).toEqual(['new']);
  });

  it('keeps semantic project visuals stable when ranking changes', () => {
    const codeflow = project('codeflow', '2026-09-06', true, 3);
    const sopflow = project('sopflow', '2026-09-06', true, 1);

    expect(getProjectVisual(codeflow, 2)).toEqual({tone: 1, icon: 'code'});
    expect(getProjectVisual(sopflow, 0)).toEqual({tone: 2, icon: 'document'});
  });
});
