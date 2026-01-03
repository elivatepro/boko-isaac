import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Force Node.js runtime for file system operations
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const projectsDir = path.join(process.cwd(), "src/app/work/projects");

// Check authentication
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookies = request.cookies;
  const authToken = cookies.get("authToken");
  return authToken?.value === "authenticated";
}

// GET - List all projects
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));

    const projects = files.map((file) => {
      const filePath = path.join(projectsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace(".mdx", ""),
        title: data.title || "",
        publishedAt: data.publishedAt || "",
        summary: data.summary || "",
        images: data.images || [],
        content: content,
      };
    });

    // Sort by date, newest first
    projects.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error reading projects:", error);
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, publishedAt, summary, images, content } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    // Check if slug already exists
    const filePath = path.join(projectsDir, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 400 });
    }

    // Create MDX content
    const frontmatter = {
      title,
      publishedAt,
      summary,
      images: images.filter((img: string) => img.trim() !== ""),
      team: [
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

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
