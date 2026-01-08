import { testimonials as testimonialsContent } from "@/resources";
import { Review, Database } from "@/types";
import { getSupabaseClient, isSupabaseConfigured } from "@/utils/supabaseClient";

type NormalizedReviewPayload = {
  slug: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function clampRating(rating?: number): number {
  if (!rating || Number.isNaN(rating)) return 5;
  return Math.min(5, Math.max(1, Math.round(rating)));
}

function normalizePayload(payload: Partial<Review>, existing?: Review): NormalizedReviewPayload {
  const base = existing || {
    slug: payload.slug || slugify(payload.name || ""),
    name: payload.name || "",
    role: payload.role,
    company: payload.company,
    content: payload.content || "",
    rating: clampRating(payload.rating),
    avatar: payload.avatar,
  };

  const slug = (payload.slug || base.slug || slugify(payload.name || base.name || "")).trim();

  return {
    slug,
    name: payload.name?.trim() || base.name,
    role: payload.role?.trim() || base.role,
    company: payload.company?.trim() || base.company,
    content: payload.content ?? base.content,
    rating: clampRating(payload.rating ?? base.rating),
    avatar: payload.avatar?.trim() || base.avatar,
  };
}

function ensureRequiredFields(payload: NormalizedReviewPayload) {
  if (!payload.slug) throw new Error("Slug is required");
  if (!payload.name) throw new Error("Name is required");
  if (!payload.content) throw new Error("Content is required");
}

function mapRowToReview(row: Database["public"]["Tables"]["reviews"]["Row"]): Review {
  return {
    slug: row.slug,
    name: row.name,
    role: row.role ?? undefined,
    company: row.company ?? undefined,
    content: row.content,
    rating: row.rating,
    avatar: row.avatar ?? undefined,
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
    displayOrder: row.display_order ?? undefined,
  };
}

function toDatabasePayload(payload: NormalizedReviewPayload): Database["public"]["Tables"]["reviews"]["Insert"] {
  return {
    slug: payload.slug,
    name: payload.name,
    role: payload.role || null,
    company: payload.company || null,
    content: payload.content,
    rating: payload.rating,
    avatar: payload.avatar || null,
  };
}

export async function fetchReviews(): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();

    // Try with display_order first, fallback to just created_at if column doesn't exist
    let result = await supabase
      .from("reviews")
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    // If display_order column doesn't exist, retry without it
    if (result.error?.message?.includes("display_order")) {
      result = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
    }

    if (result.error) {
      throw new Error(`Failed to fetch reviews from Supabase: ${result.error.message}`);
    }

    return (result.data || []).map(mapRowToReview);
  }

  // Fallback to bundled testimonials content when Supabase is not configured
  return testimonialsContent.items.map((item) => ({
    slug: slugify(item.name),
    name: item.name,
    role: item.role,
    company: item.company,
    content: item.content,
    rating: item.rating,
    avatar: undefined,
  }));
}

export async function fetchReviewBySlug(slug: string): Promise<Review | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to fetch review from Supabase: ${error.message}`);
    }

    return data ? mapRowToReview(data) : null;
  }

  const fallback = testimonialsContent.items.find((item) => slugify(item.name) === slug);
  return fallback
    ? {
        slug,
        name: fallback.name,
        role: fallback.role,
        company: fallback.company,
        content: fallback.content,
        rating: fallback.rating,
      }
    : null;
}

export async function createReview(payload: Partial<Review>): Promise<Review> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set environment variables to enable review storage.");
  }

  const normalized = normalizePayload(payload);
  ensureRequiredFields(normalized);

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert(toDatabasePayload(normalized) as any)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A review with this slug already exists");
    }
    throw new Error(`Failed to create review in Supabase: ${error.message}`);
  }

  return mapRowToReview(data);
}

export async function updateReview(slug: string, payload: Partial<Review>): Promise<Review> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set environment variables to enable review storage.");
  }

  const supabase = getSupabaseClient();
  const existingResult = await supabase.from("reviews").select("*").eq("slug", slug).maybeSingle();

  if (existingResult.error && existingResult.error.code !== "PGRST116") {
    throw new Error(`Failed to read review from Supabase: ${existingResult.error.message}`);
  }

  if (!existingResult.data) {
    throw new Error("Review not found");
  }

  const existing = mapRowToReview(existingResult.data);
  const normalized = normalizePayload(payload, existing);
  ensureRequiredFields(normalized);

  const { data, error } = await supabase
    .from("reviews")
    .update(toDatabasePayload(normalized) as any)
    .eq("slug", slug)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update review in Supabase: ${error.message}`);
  }

  return mapRowToReview(data);
}

export async function deleteReview(slug: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set environment variables to enable review storage.");
  }

  const supabase = getSupabaseClient();
  const { error, count } = await supabase
    .from("reviews")
    .delete()
    .eq("slug", slug)
    .select("slug");

  if (error) {
    throw new Error(`Failed to delete review from Supabase: ${error.message}`);
  }

  if (!count) {
    throw new Error(`Review not found: ${slug || "(missing slug)"}`);
  }
}

export async function fetchReviewSummary() {
  const reviews = await fetchReviews();
  const totalReviews = reviews.length;

  const overallRating = totalReviews
    ? reviews.reduce((sum, review) => sum + clampRating(review.rating), 0) / totalReviews
    : 0;

  return {
    reviews,
    overallRating: Number.isFinite(overallRating) ? overallRating : 0,
    totalReviews,
  };
}

export async function updateReviewsOrder(
  items: { slug: string; order: number }[],
): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Reordering requires database storage.");
  }

  const supabase = getSupabaseClient();

  for (const item of items) {
    const { error } = await supabase
      .from("reviews")
      .update({ display_order: item.order } as any)
      .eq("slug", item.slug);

    if (error) {
      throw new Error(`Failed to update order for review ${item.slug}: ${error.message}`);
    }
  }
}
