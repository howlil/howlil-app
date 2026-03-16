/** @format */

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + suffix;
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Convert to title case (capitalize with exceptions for small words)
 */
export function toTitleCase(text: string): string {
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v?\.?|vs?\.?|via)$/i;

  return text.replace(
    /[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g,
    (match, index, title) => {
      if (index > 0 && index + match.length !== title.length && match.search(smallWords) > -1) {
        return match.toLowerCase();
      }
      if (match.toUpperCase() !== match) {
        return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
      }
      return match;
    }
  );
}

/**
 * Convert string to slug (URL-friendly)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape special characters for safe HTML display
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Word count
 */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Reading time estimate in minutes
 */
export function readingTime(text: string, wordsPerMinute: number = 200): number {
  const words = wordCount(text);
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
