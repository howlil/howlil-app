/** @format */

import {defineCollection, z} from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(), // Optional for now, can be made required later
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: z.string(),
      type: z.enum(['side-project', 'contribution', 'production', 'hackathon']),
      date: z.string(),
      excerpt: z.string(),
      tags: z.array(z.string()).default([]),
      coverImages: z.array(z.string()).optional(), // Multiple images for slider
      coverVideo: z.string().optional(), // Single video
    })
    .refine((data) => !(data.coverImages && data.coverVideo), {
      message: 'Cannot have both coverImages and coverVideo. Choose one.',
    }),
});

export const collections = {blog, projects};
