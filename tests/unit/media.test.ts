import { describe, expect, it } from 'vitest';
import { resolveProjectMedia } from '../../src/lib/media';

describe('resolveProjectMedia', () => {
  it('normalizes a YouTube watch URL', () => {
    expect(resolveProjectMedia('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42')).toEqual({
      kind: 'youtube',
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    });
  });

  it('normalizes a youtu.be URL', () => {
    expect(resolveProjectMedia('https://youtu.be/dQw4w9WgXcQ?si=abc')).toEqual({
      kind: 'youtube',
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    });
  });

  it('normalizes an existing YouTube embed URL', () => {
    expect(resolveProjectMedia('https://www.youtube.com/embed/dQw4w9WgXcQ')).toEqual({
      kind: 'youtube',
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    });
  });

  it('normalizes a Google Drive file view URL to preview', () => {
    expect(resolveProjectMedia('https://drive.google.com/file/d/abc123XYZ/view?usp=sharing')).toEqual({
      kind: 'google-drive',
      src: 'https://drive.google.com/file/d/abc123XYZ/preview',
    });
  });

  it('keeps direct http video URLs as video sources', () => {
    expect(resolveProjectMedia('https://cdn.example.com/demo.mp4')).toEqual({
      kind: 'video',
      src: 'https://cdn.example.com/demo.mp4',
    });
  });

  it('keeps root-relative video paths as video sources', () => {
    expect(resolveProjectMedia('/videos/demo.mp4')).toEqual({
      kind: 'video',
      src: '/videos/demo.mp4',
    });
  });

  it('rejects malformed and unsupported values', () => {
    expect(() => resolveProjectMedia('not a url')).toThrow();
    expect(() => resolveProjectMedia('javascript:alert(1)')).toThrow();
    expect(() => resolveProjectMedia('https://youtube.com/watch')).toThrow();
    expect(() => resolveProjectMedia('https://drive.google.com/open?id=abc')).toThrow();
  });
});
