/** @format */

import {defineCollection, z} from 'astro:content';

const nonEmptyString = z.string().trim().min(1);

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'Date must be a valid calendar date');

const httpUrl = z
  .string()
  .url()
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  }, 'URL must use http or https');

const mediaSource = z.string().trim().min(1).refine((value) => {
  if (value.startsWith('/')) return true;

  try {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}, 'Media source must be a root-relative path or an http(s) URL');

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: nonEmptyString,
    date: isoDate,
    category: nonEmptyString,
    excerpt: nonEmptyString,
    tags: z.array(nonEmptyString).default([]),
    coverImage: mediaSource.optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: nonEmptyString,
      type: z.enum([
        'work',
        'academic',
        'hackathon',
        'study-independent',
        'side-project',
        'contribution',
        'production',
      ]),
      date: isoDate,
      excerpt: nonEmptyString,
      summary: nonEmptyString.optional(),
      tags: z.array(nonEmptyString).default([]),
      featured: z.boolean().default(false),
      featuredRank: z.number().int().positive().optional(),
      role: nonEmptyString.optional(),
      engineeringFocus: z.array(nonEmptyString).default([]),
      verifiedEvidence: z.array(nonEmptyString).default([]),
      diagrams: z.array(z.object({
        kind: z.enum(['architecture', 'sequence', 'state', 'domain', 'deployment', 'activity']),
        title: nonEmptyString,
        src: mediaSource,
        source: mediaSource.optional(),
        alt: nonEmptyString,
        caption: nonEmptyString.optional(),
      })).max(4).default([]),
      coverImages: z.array(mediaSource).min(1).optional(),
      coverVideo: mediaSource.optional(),
      liveSite: httpUrl.optional(),
      repository: httpUrl.optional(),
      videoDemo: httpUrl.optional(),
    })
    .refine((data) => !(data.coverImages && data.coverVideo), {
      message: 'Cannot have both coverImages and coverVideo. Choose one.',
    })
    .refine((data) => !data.featuredRank || data.featured, {
      message: 'featuredRank is only valid when featured is true.',
    }),
});

export const collections = {blog, projects};
