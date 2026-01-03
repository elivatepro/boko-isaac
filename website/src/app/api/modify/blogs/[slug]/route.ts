import { NextRequest, NextResponse } from "next/server";
import { deleteBlog, fetchBlogPost, updateBlog } from "@/utils/blogs";
import { isSupabaseConfigured } from "@/utils/supabaseClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookies = request.cookies;
  const authToken = cookies.get("authToken");
  return authToken?.value === "authenticated";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const blog = await fetchBlogPost(slug);
    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error reading blog:", error);
    const message = error instanceof Error ? error.message : "Failed to read blog";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, subtitle, summary, image, publishedAt, tag, content } = body;

    const updated = await updateBlog(
      slug,
      {
        title,
        subtitle,
        summary,
        image,
        publishedAt,
        tag,
        content,
      },
      { fallbackToFilesystem: !isSupabaseConfigured() },
    );

    return NextResponse.json({ success: true, slug: updated.slug });
  } catch (error) {
    console.error("Error updating blog:", error);
    const message = error instanceof Error ? error.message : "Failed to update blog";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    await deleteBlog(slug, { fallbackToFilesystem: !isSupabaseConfigured() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    const message = error instanceof Error ? error.message : "Failed to delete blog";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
