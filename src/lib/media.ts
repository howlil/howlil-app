export type ProjectMediaKind = 'youtube' | 'google-drive' | 'video';

export interface ProjectMedia {
  kind: ProjectMediaKind;
  src: string;
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

function requireYoutubeId(candidate: string | null | undefined): string {
  if (!candidate || !YOUTUBE_ID.test(candidate)) {
    throw new Error('Invalid YouTube video URL');
  }
  return candidate;
}

function resolveYoutube(url: URL): ProjectMedia | null {
  const host = url.hostname.toLowerCase().replace(/^www\./, '');

  if (host === 'youtu.be') {
    const id = requireYoutubeId(url.pathname.split('/').filter(Boolean)[0]);
    return { kind: 'youtube', src: `https://www.youtube.com/embed/${id}` };
  }

  if (host !== 'youtube.com' && host !== 'm.youtube.com' && host !== 'youtube-nocookie.com') {
    return null;
  }

  if (url.pathname === '/watch') {
    const id = requireYoutubeId(url.searchParams.get('v'));
    return { kind: 'youtube', src: `https://www.youtube.com/embed/${id}` };
  }

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments[0] === 'embed' || segments[0] === 'shorts') {
    const id = requireYoutubeId(segments[1]);
    return { kind: 'youtube', src: `https://www.youtube.com/embed/${id}` };
  }

  throw new Error('Unsupported YouTube video URL');
}

function resolveGoogleDrive(url: URL): ProjectMedia | null {
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (host !== 'drive.google.com') return null;

  const match = url.pathname.match(/^\/file\/d\/([^/]+)\/(?:view|preview)\/?$/);
  if (!match?.[1]) {
    throw new Error('Unsupported Google Drive video URL');
  }

  return {
    kind: 'google-drive',
    src: `https://drive.google.com/file/d/${encodeURIComponent(match[1])}/preview`,
  };
}

export function resolveProjectMedia(value: string): ProjectMedia {
  const source = value.trim();
  if (!source) throw new Error('Media URL cannot be empty');

  if (source.startsWith('/') && !source.startsWith('//')) {
    return { kind: 'video', src: source };
  }

  let url: URL;
  try {
    url = new URL(source);
  } catch {
    throw new Error('Media URL must be root-relative or use http(s)');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Media URL must use http(s)');
  }

  return (
    resolveYoutube(url) ??
    resolveGoogleDrive(url) ??
    { kind: 'video', src: url.href }
  );
}
