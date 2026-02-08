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
      type: z.enum(['work', 'academic', 'hackathon', 'study-independent', 'side-project', 'contribution', 'production']),
      date: z.string(),
      excerpt: z.string(),
      tags: z.array(z.string()).default([]),
      coverImages: z.array(z.string()).optional(),
      coverVideo: z.string().optional(),
      // Optional links
      liveSite: z.string().optional(),
      repository: z.string().optional(),
      videoDemo: z.string().optional(),
      // Short explanation & goals (shown above body)
      shortExplanation: z.string().optional(),
      projectGoals: z.array(z.string()).default([]),
    })
    .refine((data) => !(data.coverImages && data.coverVideo), {
      message: 'Cannot have both coverImages and coverVideo. Choose one.',
    }),
});

const shorts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {blog, projects, shorts};
