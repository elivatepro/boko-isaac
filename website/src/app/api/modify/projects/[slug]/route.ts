import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDir = path.join(process.cwd(), "src/app/work/projects");

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
    const filePath = path.join(projectsDir, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return NextResponse.json({
      slug,
      title: data.title || "",
      publishedAt: data.publishedAt || "",
      summary: data.summary || "",
      images: data.images || [],
      content: content,
    });
  } catch (error) {
    console.error("Error reading project:", error);
    return NextResponse.json({ error: "Failed to read project" }, { status: 500 });
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
    const filePath = path.join(projectsDir, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, publishedAt, summary, images, content } = body;

    // Read existing file to preserve team data
    const existingContent = fs.readFileSync(filePath, "utf-8");
    const { data: existingData } = matter(existingContent);

    // Create updated MDX content
    const frontmatter = {
      title,
      publishedAt,
      summary,
      images: images.filter((img: string) => img.trim() !== ""),
      team: existingData.team || [
        {
          name: "Boko Isaac",
          role: "Systems Architect & Automation Engineer",
          avatar: "/images/boko-avatar-new.png",
          linkedIn: "https://www.linkedin.com/in/boko-isaac/",
        },
      ],
    };

    const mdxContent = matter.stringify(content || "", frontmatter);
    fs.writeFileSync(filePath, mdxContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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

  try {
    const { slug } = await params;
    const filePath = path.join(projectsDir, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
