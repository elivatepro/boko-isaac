import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost, Database } from "@/types";
import { getSupabaseClient, isSupabaseConfigured } from "@/utils/supabaseClient";

const blogsDir = path.join(process.cwd(), "src", "app", "blog", "posts");

function ensureDir(): boolean {
  if (fs.existsSync(blogsDir)) {
    return true;
  }
  return false;
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
    displayOrder: row.display_order ?? undefined,
  };
}

function fileBlogPosts(): BlogPost[] {
  if (!ensureDir()) return [];
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
  if (!ensureDir()) return null;
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
  if (!ensureDir()) {
    fs.mkdirSync(blogsDir, { recursive: true });
  }
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
  if (!ensureDir()) {
    throw new Error("Blog post not found");
  }
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

    // Try with display_order first, fallback to just published_at if column doesn't exist
    let result = await supabase
      .from("blogs")
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("published_at", { ascending: false });

    // If display_order column doesn't exist, retry without it
    if (result.error?.message?.includes("display_order")) {
      result = await supabase
        .from("blogs")
        .select("*")
        .order("published_at", { ascending: false });
    }

    if (result.error) {
      throw new Error(`Failed to fetch blogs from Supabase: ${result.error.message}`);
    }

    return (result.data || []).map(mapRowToBlog);
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
  const payload: Database["public"]["Tables"]["blogs"]["Insert"] = {
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle ?? null,
    summary: post.summary,
    image: post.image ?? null,
    published_at: post.publishedAt,
    tag: post.tag ?? null,
    content: post.content,
  };

  const { data, error } = await supabase.from("blogs").insert(payload as any).select().single();

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
    .update(updatedPayload as any)
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
  const { error, count } = await supabase.from("blogs").delete().eq("slug", slug).select("slug");

  if (error) {
    throw new Error(`Failed to delete blog from Supabase: ${error.message}`);
  }

  if (!count) {
    throw new Error(`Blog post not found: ${slug || "(missing slug)"}`);
  }
}

export async function updateBlogsOrder(
  items: { slug: string; order: number }[],
): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Reordering requires database storage.");
  }

  const supabase = getSupabaseClient();

  for (const item of items) {
    const { error } = await supabase
      .from("blogs")
      .update({ display_order: item.order } as any)
      .eq("slug", item.slug);

    if (error) {
      throw new Error(`Failed to update order for blog ${item.slug}: ${error.message}`);
    }
  }
}
