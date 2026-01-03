import { NextRequest, NextResponse } from "next/server";
import { deleteProject, fetchProjectBySlug, updateProject } from "@/utils/projects";
import { isSupabaseConfigured } from "@/utils/supabaseClient";

// Force Node.js runtime for server-side utilities
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Check authentication
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookies = request.cookies;
  const authToken = cookies.get("authToken");
  return authToken?.value === "authenticated";
}

// GET - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const project = await fetchProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      slug: project.slug,
      title: project.title,
      publishedAt: project.publishedAt,
      summary: project.summary,
      images: project.images,
      content: project.content,
      link: project.link,
      image: project.image,
      team: project.team,
    });
  } catch (error) {
    console.error("Error reading project:", error);
    const message = error instanceof Error ? error.message : "Failed to read project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT - Update project
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
    const { title, publishedAt, summary, images, content, link, team, image } = body;

    const updated = await updateProject(
      slug,
      { title, publishedAt, summary, images, content, link, team, image },
      { fallbackToFilesystem: !isSupabaseConfigured() },
    );

    return NextResponse.json({ success: true, slug: updated.slug });
  } catch (error) {
    console.error("Error updating project:", error);
    const message = error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const routeParams = await params;
  const slug = routeParams.slug;

  try {
    console.log("DELETE /api/modify/projects slug param:", slug);
    await deleteProject(slug, { fallbackToFilesystem: !isSupabaseConfigured() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    const baseMessage = error instanceof Error ? error.message : "Failed to delete project";
    const notFound = baseMessage.includes("Project not found");
    const message = notFound ? baseMessage : baseMessage;
    const status = notFound ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
