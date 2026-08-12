export interface TagCount {
  name: string;
  count: number;
}

/** Sort collection entries by ISO date descending (newest first). */
export function sortByDateDesc<T extends {data: {date: string}}>(
  entries: readonly T[],
): T[] {
  return [...entries].sort(
    (a, b) => Date.parse(b.data.date) - Date.parse(a.data.date),
  );
}

/** Count tag occurrences and return the most-used tags first. */
export function countTagOccurrences<T>(
  entries: readonly T[],
  getTags: (entry: T) => readonly string[],
): TagCount[] {
  const counts = new Map<string, number>();

  entries.forEach((entry) => {
    getTags(entry).forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({name, count}))
    .sort((a, b) => b.count - a.count);
}
