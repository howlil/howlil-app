/** @format */

/**
 * Format date to readable string
 * Example: "2024-01-15" → "January 15, 2024"
 */
export function formatDate(dateString: string, locale: string = 'en-US'): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Format date to short string
 * Example: "2024-01-15" → "Jan 15, 2024"
 */
export function formatDateShort(dateString: string, locale: string = 'en-US'): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Format date to relative time
 * Example: "2024-01-15" → "2 months ago"
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
      [31536000, 'year'],
      [2592000, 'month'],
      [604800, 'week'],
      [86400, 'day'],
      [3600, 'hour'],
      [60, 'minute'],
    ];

    for (const [seconds, unit] of intervals) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        return rtf.format(-interval, unit);
      }
    }

    return 'just now';
  } catch (error) {
    return dateString;
  }
}

/**
 * Check if date is valid
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
