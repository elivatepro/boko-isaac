import { NextRequest, NextResponse } from "next/server";
import { deleteReview, fetchReviewBySlug, updateReview } from "@/utils/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookies = request.cookies;
  const authToken = cookies.get("authToken");
  return authToken?.value === "authenticated";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const review = await fetchReviewBySlug(slug);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json(review);
  } catch (error) {
    console.error("Error reading review:", error);
    const message = error instanceof Error ? error.message : "Failed to read review";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, role, company, content, rating, avatar } = body;

    const updated = await updateReview(slug, {
      name,
      role,
      company,
      content,
      rating: Number(rating),
      avatar,
    });

    return NextResponse.json({ success: true, slug: updated.slug });
  } catch (error) {
    console.error("Error updating review:", error);
    const message = error instanceof Error ? error.message : "Failed to update review";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    await deleteReview(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    const message = error instanceof Error ? error.message : "Failed to delete review";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
