import { NextRequest, NextResponse } from "next/server";
import { fetchBlogPosts, createBlog } from "@/utils/blogs";
import { isSupabaseConfigured } from "@/utils/supabaseClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookies = request.cookies;
  const authToken = cookies.get("authToken");
  return authToken?.value === "authenticated";
}

// GET all blog posts
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blogs = await fetchBlogPosts();
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error reading blogs:", error);
    const message = error instanceof Error ? error.message : "Failed to read blogs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create blog post
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, subtitle, summary, image, publishedAt, tag, content } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    const blog = await createBlog(
      {
        slug,
        title,
        subtitle,
        summary,
        image,
        publishedAt,
        tag,
        content: content || "",
      },
      { fallbackToFilesystem: !isSupabaseConfigured() },
    );

    return NextResponse.json({ success: true, slug: blog.slug });
  } catch (error) {
    console.error("Error creating blog:", error);
    const message = error instanceof Error ? error.message : "Failed to create blog";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
