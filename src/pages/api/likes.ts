import type { APIRoute } from 'astro';
import { db, Likes, UserLikes, eq, and } from 'astro:db';

export const prerender = false;

// GET - Get like count for a slug
export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug');
  
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await db.select().from(Likes).where(eq(Likes.slug, slug));
    const count = result[0]?.count || 0;

    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Likes GET error:', error);
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST - Toggle like for a slug
export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug, visitorId } = await request.json();

    if (!slug || !visitorId) {
      return new Response(JSON.stringify({ error: 'Slug and visitorId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user already liked
    const existingLike = await db
      .select()
      .from(UserLikes)
      .where(and(eq(UserLikes.slug, slug), eq(UserLikes.visitorId, visitorId)));

    const hasLiked = existingLike.length > 0;

    // Get or create likes record
    let likesRecord = await db.select().from(Likes).where(eq(Likes.slug, slug));
    
    if (likesRecord.length === 0) {
      await db.insert(Likes).values({ slug, count: 0 });
      likesRecord = await db.select().from(Likes).where(eq(Likes.slug, slug));
    }

    let newCount: number;

    if (hasLiked) {
      // Unlike
      await db
        .delete(UserLikes)
        .where(and(eq(UserLikes.slug, slug), eq(UserLikes.visitorId, visitorId)));
      
      newCount = Math.max(0, (likesRecord[0]?.count || 1) - 1);
      await db.update(Likes).set({ count: newCount }).where(eq(Likes.slug, slug));
    } else {
      // Like
      await db.insert(UserLikes).values({ slug, visitorId });
      
      newCount = (likesRecord[0]?.count || 0) + 1;
      await db.update(Likes).set({ count: newCount }).where(eq(Likes.slug, slug));
    }

    return new Response(JSON.stringify({ count: newCount, liked: !hasLiked }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Like POST error:', error);
    return new Response(JSON.stringify({ count: 0, liked: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
