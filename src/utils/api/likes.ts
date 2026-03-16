/** @format */

/**
 * Fetch like count for a slug
 */
export async function getLikeCount(slug: string): Promise<number> {
  try {
    const response = await fetch(`/api/likes?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) return 0;
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Failed to fetch like count:', error);
    return 0;
  }
}

/**
 * Toggle like for a slug
 */
export async function toggleLike(
  slug: string,
  visitorId: string
): Promise<{ count: number; liked: boolean }> {
  try {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, visitorId }),
    });

    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to toggle like:', error);
    return { count: 0, liked: false };
  }
}

/**
 * Generate or get visitor ID from localStorage
 */
export function getVisitorId(): string {
  let visitorId = localStorage.getItem('visitor-id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitor-id', visitorId);
  }
  return visitorId;
}
