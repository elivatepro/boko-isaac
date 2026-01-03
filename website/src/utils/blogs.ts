import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost, Database } from "@/types";
import { getSupabaseClient, isSupabaseConfigured } from "@/utils/supabaseClient";

const blogsDir = path.join(process.cwd(), "src", "app", "blog", "posts");

function ensureDir() {
  if (!fs.existsSync(blogsDir)) {
    throw new Error("Blog posts directory not found");
  }
}

function mapRowToBlog(row: Database["public"]["Tables"]["blogs"]["Row"]): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? "",
    summary: row.summary ?? "",
    image: row.image ?? "",
    publishedAt: row.published_at ?? "",
    tag: row.tag ?? "",
    content: row.content ?? "",
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  };
}

function fileBlogPosts(): BlogPost[] {
  ensureDir();
  const files = fs.readdirSync(blogsDir).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((file) => {
    const filePath = path.join(blogsDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const slug = path.basename(file, path.extname(file));
    return {
      slug,
      title: data.title || "",
      subtitle: data.subtitle || "",
      summary: data.summary || "",
      image: data.image || "",
      publishedAt: data.publishedAt || "",
      tag: data.tag || "",
      content,
    };
  });
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function fileBlogPost(slug: string): BlogPost | null {
  ensureDir();
  const filePath = path.join(blogsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || "",
    subtitle: data.subtitle || "",
    summary: data.summary || "",
    image: data.image || "",
    publishedAt: data.publishedAt || "",
    tag: data.tag || "",
    content,
  };
}

function createFileBlog(post: BlogPost): BlogPost {
  ensureDir();
  const filePath = path.join(blogsDir, `${post.slug}.mdx`);
  if (fs.existsSync(filePath)) {
    throw new Error("A blog post with this slug already exists");
  }
  const mdx = matter.stringify(post.content || "", {
    title: post.title,
    subtitle: post.subtitle,
    summary: post.summary,
    image: post.image,
    publishedAt: post.publishedAt,
    tag: post.tag,
  });
  fs.writeFileSync(filePath, mdx);
  return post;
}

function updateFileBlog(slug: string, payload: Partial<BlogPost>): BlogPost {
  ensureDir();
  const filePath = path.join(blogsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error("Blog post not found");
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const updated: BlogPost = {
    slug,
    title: payload.title ?? data.title ?? "",
    subtitle: payload.subtitle ?? data.subtitle ?? "",
    summary: payload.summary ?? data.summary ?? "",
    image: payload.image ?? data.image ?? "",
    publishedAt: payload.publishedAt ?? data.publishedAt ?? "",
    tag: payload.tag ?? data.tag ?? "",
    content: payload.content ?? content ?? "",
  };

  const mdx = matter.stringify(updated.content || "", {
    title: updated.title,
    subtitle: updated.subtitle,
    summary: updated.summary,
    image: updated.image,
    publishedAt: updated.publishedAt,
    tag: updated.tag,
  });

  fs.writeFileSync(filePath, mdx);
  return updated;
}

function deleteFileBlog(slug: string) {
  ensureDir();
  const filePath = path.join(blogsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error("Blog post not found");
  }
  fs.unlinkSync(filePath);
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) {
      throw new Error(`Failed to fetch blogs from Supabase: ${error.message}`);
    }
    return (data || []).map(mapRowToBlog);
  }
  return fileBlogPosts();
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to fetch blog from Supabase: ${error.message}`);
    }
    return data ? mapRowToBlog(data) : null;
  }
  return fileBlogPost(slug);
}

export async function createBlog(post: BlogPost, options: { fallbackToFilesystem?: boolean } = {}) {
  if (!isSupabaseConfigured()) {
    if (options.fallbackToFilesystem) return createFileBlog(post);
    throw new Error("Supabase is not configured. Set environment variables to enable blog storage.");
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("blogs")
    .insert({
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle ?? null,
      summary: post.summary,
      image: post.image ?? null,
      published_at: post.publishedAt,
      tag: post.tag ?? null,
      content: post.content,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A blog post with this slug already exists");
    }
    throw new Error(`Failed to create blog in Supabase: ${error.message}`);
  }

  return mapRowToBlog(data);
}

export async function updateBlog(
  slug: string,
  payload: Partial<BlogPost>,
  options: { fallbackToFilesystem?: boolean } = {},
) {
  if (!isSupabaseConfigured()) {
    if (options.fallbackToFilesystem) return updateFileBlog(slug, payload);
    throw new Error("Supabase is not configured. Set environment variables to enable blog storage.");
  }

  const supabase = getSupabaseClient();
  const existing = await supabase.from("blogs").select("*").eq("slug", slug).maybeSingle();
  if (existing.error && existing.error.code !== "PGRST116") {
    throw new Error(`Failed to read blog from Supabase: ${existing.error.message}`);
  }
  if (!existing.data) {
    throw new Error("Blog post not found");
  }

  const updatedPayload = {
    title: payload.title ?? existing.data.title,
    subtitle: payload.subtitle ?? existing.data.subtitle,
    summary: payload.summary ?? existing.data.summary,
    image: payload.image ?? existing.data.image,
    published_at: payload.publishedAt ?? existing.data.published_at,
    tag: payload.tag ?? existing.data.tag,
    content: payload.content ?? existing.data.content,
  };

  const { data, error } = await supabase
    .from("blogs")
    .update(updatedPayload)
    .eq("slug", slug)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update blog in Supabase: ${error.message}`);
  }

  return mapRowToBlog(data);
}

export async function deleteBlog(
  slug: string,
  options: { fallbackToFilesystem?: boolean } = {},
): Promise<void> {
  if (!isSupabaseConfigured()) {
    if (options.fallbackToFilesystem) {
      deleteFileBlog(slug);
      return;
    }
    throw new Error("Supabase is not configured. Set environment variables to enable blog storage.");
  }

  const supabase = getSupabaseClient();
  const { error, count } = await supabase
    .from("blogs")
    .delete()
    .eq("slug", slug)
    .select("slug", { count: "exact", head: true });

  if (error) {
    throw new Error(`Failed to delete blog from Supabase: ${error.message}`);
  }

  if (!count) {
    throw new Error(`Blog post not found: ${slug || "(missing slug)"}`);
  }
}
