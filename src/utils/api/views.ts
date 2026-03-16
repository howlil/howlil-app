/** @format */

/**
 * Fetch view count for a slug
 */
export async function getViewCount(slug: string): Promise<number> {
  try {
    const response = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Failed to fetch view count:', error);
    return 0;
  }
}

/**
 * Increment view count for a slug
 */
export async function incrementView(slug: string): Promise<number> {
  try {
    const viewedKey = `viewed-${slug}`;
    const hasViewed = sessionStorage.getItem(viewedKey) === 'true';

    if (!hasViewed) {
      const response = await fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        throw new Error('Failed to increment view');
      }

      const data = await response.json();
      sessionStorage.setItem(viewedKey, 'true');
      return data.count || 0;
    } else {
      return await getViewCount(slug);
    }
  } catch (error) {
    console.error('Failed to increment view:', error);
    return await getViewCount(slug);
  }
}
