
import {getCollection} from 'astro:content';
import type {APIRoute} from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
  try {
    const blogPosts = await getCollection('blog');
    const blogResults = blogPosts.map((post) => ({
      title: post.data.title,
      url: `/blog/${post.slug}`,
      type: 'blog' as const,
      excerpt: post.data.excerpt,
    }));

    const projects = await getCollection('projects');
    const projectResults = projects.map((project) => ({
      title: project.data.title,
      url: `/projects/${project.slug}`,
      type: 'project' as const,
      excerpt: project.data.excerpt,
    }));

    const allContent = [...blogResults, ...projectResults];

    return new Response(JSON.stringify(allContent), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({error: 'Failed to fetch content'}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
