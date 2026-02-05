import type { APIRoute } from 'astro';
import { db, Views, eq } from 'astro:db';

export const prerender = false;

// GET - Get view count for a slug
export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug');
  
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await db.select().from(Views).where(eq(Views.slug, slug));
    const count = result[0]?.count || 0;

    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Views GET error:', error);
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST - Increment view count for a slug
export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get or create views record
    const viewsRecord = await db.select().from(Views).where(eq(Views.slug, slug));
    
    let newCount: number;
    
    if (viewsRecord.length === 0) {
      // Create new record with count 1
      await db.insert(Views).values({ slug, count: 1 });
      newCount = 1;
    } else {
      // Increment existing count
      newCount = (viewsRecord[0]?.count || 0) + 1;
      await db.update(Views).set({ count: newCount }).where(eq(Views.slug, slug));
    }

    return new Response(JSON.stringify({ count: newCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('View POST error:', error);
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

