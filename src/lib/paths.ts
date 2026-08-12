export function normalizeBase(base: string): string {
  const trimmed = base.trim();
  if (!trimmed || trimmed === '/') return '/';

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`;
}

export function withBase(
  path: string,
  base: string = import.meta.env.BASE_URL || '/',
): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) {
    return path;
  }

  const normalizedBase = normalizeBase(base);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (normalizedBase === '/') {
    return normalizedPath;
  }

  const baseWithoutTrailingSlash = normalizedBase.slice(0, -1);
  if (
    normalizedPath === baseWithoutTrailingSlash ||
    normalizedPath.startsWith(`${baseWithoutTrailingSlash}/`)
  ) {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return normalizedBase;
  }

  return `${baseWithoutTrailingSlash}${normalizedPath}`;
}
