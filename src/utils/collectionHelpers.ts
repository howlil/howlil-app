export interface TagCount {
  name: string;
  count: number;
}

/**
 * Sort collection entries by date descending (newest first).
 */
export function sortByDateDesc<T extends { data: { date: string } }>(entries: T[]): T[] {
  return [...entries].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}

/**
 * Count occurrences of tags from collection entries.
 * getTags(entry) should return the list of tag strings for that entry (e.g. entry.data.tags).
 * Returns array of { name, count } sorted by count descending.
 */
export function countTagOccurrences<T>(
  entries: T[],
  getTags: (entry: T) => string[]
): TagCount[] {
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    const tags = getTags(entry);
    tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
