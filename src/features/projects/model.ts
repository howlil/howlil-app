import type { CollectionEntry } from 'astro:content';
import { sortByDateDesc } from '../../utils/collectionHelpers';

export type ProjectEntry = CollectionEntry<'projects'>;
export type ProjectVisualIcon =
  | 'code'
  | 'document'
  | 'notes'
  | 'work'
  | 'payment'
  | 'analytics'
  | 'cloud';

export interface ProjectVisual {
  tone: 1 | 2 | 3;
  icon: ProjectVisualIcon;
}

const PROJECT_VISUALS: Record<string, ProjectVisual> = {
  codeflow: { tone: 1, icon: 'code' },
  sopflow: { tone: 2, icon: 'document' },
  notespace: { tone: 3, icon: 'notes' },
  jobflow: { tone: 1, icon: 'work' },
  'tedx-payment-service': { tone: 1, icon: 'payment' },
  'tracer-survey': { tone: 2, icon: 'analytics' },
  'stunby-cloud-api': { tone: 3, icon: 'cloud' },
};

const FALLBACK_VISUALS: readonly ProjectVisual[] = [
  { tone: 1, icon: 'code' },
  { tone: 2, icon: 'analytics' },
  { tone: 3, icon: 'cloud' },
];

export function orderProjects(projects: readonly ProjectEntry[]): ProjectEntry[] {
  return sortByDateDesc(projects);
}

export function getFeaturedProjects(
  projects: readonly ProjectEntry[],
  limit?: number,
): ProjectEntry[] {
  const ordered = orderProjects(projects);
  const featured = ordered
    .filter((project) => project.data.featured)
    .sort((a, b) => (a.data.featuredRank ?? Number.MAX_SAFE_INTEGER) - (b.data.featuredRank ?? Number.MAX_SAFE_INTEGER));
  const selected = featured.length > 0 ? featured : ordered;
  return typeof limit === 'number' ? selected.slice(0, limit) : selected;
}

export function getMoreProjects(projects: readonly ProjectEntry[]): ProjectEntry[] {
  const ordered = orderProjects(projects);
  const featuredSlugs = new Set(getFeaturedProjects(projects).map((project) => project.slug));
  return ordered.filter((project) => !featuredSlugs.has(project.slug));
}

export function getProjectVisual(project: ProjectEntry, index: number): ProjectVisual {
  return PROJECT_VISUALS[project.slug] ?? FALLBACK_VISUALS[index % FALLBACK_VISUALS.length];
}

export function getProjectYear(project: ProjectEntry): string {
  return project.data.date.slice(0, 4);
}

export function getProjectSummary(project: ProjectEntry): string {
  return project.data.summary ?? project.data.excerpt;
}
