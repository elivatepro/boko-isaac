import { NextRequest, NextResponse } from "next/server";
import { createReview, fetchReviewSummary } from "@/utils/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookies = request.cookies;
  const authToken = cookies.get("authToken");
  return authToken?.value === "authenticated";
}

// GET all reviews (with summary)
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await fetchReviewSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error reading reviews:", error);
    const message = error instanceof Error ? error.message : "Failed to read reviews";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create review
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, name, role, company, content, rating, avatar } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: "Slug and name are required" }, { status: 400 });
    }

    const review = await createReview({
      slug,
      name,
      role,
      company,
      content,
      rating: Number(rating),
      avatar,
    });

    return NextResponse.json({ success: true, slug: review.slug });
  } catch (error) {
    console.error("Error creating review:", error);
    const message = error instanceof Error ? error.message : "Failed to create review";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
