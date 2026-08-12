import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { withBase } from '../../lib/paths';

export const prerender = true;

export const GET: APIRoute = async () => {
  try {
    const blogPosts = await getCollection('blog');
    const blogResults = blogPosts.map((post) => ({
      title: post.data.title,
      url: withBase(`/blog/${post.slug}`),
      type: 'blog' as const,
      excerpt: post.data.excerpt,
    }));

    const projects = await getCollection('projects');
    const projectResults = projects.map((project) => ({
      title: project.data.title,
      url: withBase(`/projects/${project.slug}`),
      type: 'project' as const,
      excerpt: project.data.excerpt,
    }));

    return new Response(JSON.stringify([...blogResults, ...projectResults]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to fetch content' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
