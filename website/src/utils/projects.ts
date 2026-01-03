import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Project, ProjectPayload, TeamMember, Database } from "@/types";
import { getPosts } from "@/utils/utils";
import { getSupabaseClient, isSupabaseConfigured } from "@/utils/supabaseClient";

const projectsDir = path.join(process.cwd(), "src", "app", "work", "projects");

export const DEFAULT_TEAM: TeamMember[] = [
  {
    name: "Boko Isaac",
    role: "Systems Architect & Automation Engineer",
    avatar: "/images/boko-avatar-new.png",
    linkedIn: "https://www.linkedin.com/in/boko-isaac/",
  },
];

type NormalizedProjectPayload = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  images: string[];
  publishedAt: string;
  link?: string;
  team: TeamMember[];
  image?: string;
};

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function normalizePayload(payload: Partial<ProjectPayload>, existing?: Project): NormalizedProjectPayload {
  const base = existing || {
    slug: payload.slug || "",
    title: payload.title || "",
    summary: payload.summary || "",
    content: payload.content || "",
    images: payload.images || [],
    publishedAt: payload.publishedAt || today(),
    link: payload.link,
    team: payload.team || DEFAULT_TEAM,
    image: payload.image,
  };

  const images = (payload.images ?? base.images ?? []).map((img) => img.trim()).filter(Boolean);

  return {
    slug: (payload.slug ?? base.slug).trim().toLowerCase(),
    title: (payload.title ?? base.title).trim(),
    summary: (payload.summary ?? base.summary).trim(),
    content: payload.content ?? base.content ?? "",
    images,
    publishedAt: payload.publishedAt ?? base.publishedAt ?? today(),
    link: payload.link?.trim() ?? base.link,
    team: payload.team?.length ? payload.team : base.team?.length ? base.team : DEFAULT_TEAM,
    image: payload.image?.trim() ?? base.image ?? images[0],
  };
}

function ensureRequiredFields(payload: NormalizedProjectPayload) {
  if (!payload.slug) throw new Error("Slug is required");
  if (!payload.title) throw new Error("Title is required");
}

function mapRowToProject(row: Database["public"]["Tables"]["projects"]["Row"]): Project {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    content: row.content ?? "",
    images: row.images ?? [],
    publishedAt: row.published_at ?? "",
    link: row.link ?? "",
    team: row.team && row.team.length ? row.team : DEFAULT_TEAM,
    image: row.image ?? row.images?.[0],
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}

function mapMdxPostToProject(post: ReturnType<typeof getPosts>[number]): Project {
  return {
    slug: post.slug,
    title: post.metadata.title,
    summary: post.metadata.summary,
    images: post.metadata.images || [],
    content: post.content,
    publishedAt: post.metadata.publishedAt,
    link: post.metadata.link || "",
    team: post.metadata.team?.length ? post.metadata.team : DEFAULT_TEAM,
    image: post.metadata.image || post.metadata.images?.[0],
  };
}

function normalizedToProject(payload: NormalizedProjectPayload): Project {
  return {
    slug: payload.slug,
    title: payload.title,
    summary: payload.summary,
    content: payload.content,
    images: payload.images,
    publishedAt: payload.publishedAt,
    link: payload.link,
    team: payload.team,
    image: payload.image ?? payload.images[0],
  };
}

function toDatabasePayload(payload: NormalizedProjectPayload): Database["public"]["Tables"]["projects"]["Insert"] {
  return {
    slug: payload.slug,
    title: payload.title,
    summary: payload.summary,
    content: payload.content,
    images: payload.images,
    published_at: payload.publishedAt,
    link: payload.link || null,
    team: payload.team,
    image: payload.image || null,
  };
}

function getFilesystemProjects(): Project[] {
  const posts = getPosts(["src", "app", "work", "projects"]);
  const projects = posts.map(mapMdxPostToProject);
  return projects.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function createFilesystemProject(payload: NormalizedProjectPayload): Project {
  ensureRequiredFields(payload);
  const filePath = path.join(projectsDir, `${payload.slug}.mdx`);

  if (fs.existsSync(filePath)) {
    throw new Error("A project with this slug already exists");
  }

  const mdxContent = matter.stringify(payload.content || "", {
    title: payload.title,
    publishedAt: payload.publishedAt,
    summary: payload.summary,
    images: payload.images,
    team: payload.team,
    link: payload.link,
    image: payload.image,
  });

  fs.writeFileSync(filePath, mdxContent);
  return normalizedToProject(payload);
}

function updateFilesystemProject(slug: string, payload: Partial<ProjectPayload>): Project {
  const filePath = path.join(projectsDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error("Project not found");
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const existing = mapMdxPostToProject({
    slug,
    metadata: data as any,
    content,
  });

  const normalized = normalizePayload(payload, existing);
  ensureRequiredFields(normalized);

  const mdxContent = matter.stringify(normalized.content || "", {
    title: normalized.title,
    publishedAt: normalized.publishedAt,
    summary: normalized.summary,
    images: normalized.images,
    team: normalized.team,
    link: normalized.link,
    image: normalized.image,
  });

  fs.writeFileSync(filePath, mdxContent);
  return normalizedToProject(normalized);
}

function deleteFilesystemProject(slug: string) {
  const filePath = path.join(projectsDir, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error("Project not found");
  }

  fs.unlinkSync(filePath);
}

export async function fetchProjects(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch projects from Supabase: ${error.message}`);
    }

    return (data || []).map(mapRowToProject);
  }

  return getFilesystemProjects();
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to fetch project from Supabase: ${error.message}`);
    }

    return data ? mapRowToProject(data) : null;
  }

  const project = getFilesystemProjects().find((item) => item.slug === slug);
  return project || null;
}

export async function createProject(
  payload: ProjectPayload,
  options: { fallbackToFilesystem?: boolean } = {},
): Promise<Project> {
  const normalized = normalizePayload(payload);
  ensureRequiredFields(normalized);

  if (!isSupabaseConfigured()) {
    if (options.fallbackToFilesystem) {
      return createFilesystemProject(normalized);
    }
    throw new Error("Supabase is not configured. Set environment variables to enable project storage.");
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(toDatabasePayload(normalized) as any)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A project with this slug already exists");
    }
    throw new Error(`Failed to create project in Supabase: ${error.message}`);
  }

  return mapRowToProject(data);
}

export async function updateProject(
  slug: string,
  payload: Partial<ProjectPayload>,
  options: { fallbackToFilesystem?: boolean } = {},
): Promise<Project> {
  if (!isSupabaseConfigured()) {
    if (options.fallbackToFilesystem) {
      return updateFilesystemProject(slug, payload);
    }
    throw new Error("Supabase is not configured. Set environment variables to enable project storage.");
  }

  const supabase = getSupabaseClient();
  const existingResult = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();

  if (existingResult.error && existingResult.error.code !== "PGRST116") {
    throw new Error(`Failed to read project from Supabase: ${existingResult.error.message}`);
  }

  if (!existingResult.data) {
    throw new Error("Project not found");
  }

  const existingProject = mapRowToProject(existingResult.data);
  const normalized = normalizePayload(payload, existingProject);
  ensureRequiredFields(normalized);

  const { data, error } = await supabase
    .from("projects")
    .update(toDatabasePayload(normalized) as any)
    .eq("slug", slug)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update project in Supabase: ${error.message}`);
  }

  return mapRowToProject(data);
}

export async function deleteProject(
  slug: string,
  options: { fallbackToFilesystem?: boolean } = {},
): Promise<void> {
  if (!isSupabaseConfigured()) {
    if (options.fallbackToFilesystem) {
      deleteFilesystemProject(slug);
      return;
    }
    throw new Error("Supabase is not configured. Set environment variables to enable project storage.");
  }

  const supabase = getSupabaseClient();
  const { error, count } = await supabase
    .from("projects")
    .delete()
    .eq("slug", slug)
    .select("slug");

  if (error) {
    throw new Error(`Failed to delete project from Supabase: ${error.message}`);
  }

  if (!count) {
    throw new Error(`Project not found: ${slug || "(missing slug)"}`);
  }
}
