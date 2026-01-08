import { NextRequest, NextResponse } from "next/server";
import { updateProjectsOrder } from "@/utils/projects";
import { updateBlogsOrder } from "@/utils/blogs";
import { updateReviewsOrder } from "@/utils/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookies = request.cookies;
  const authToken = cookies.get("authToken");
  return authToken?.value === "authenticated";
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, items } = body;

    if (!type || !["projects", "blogs", "reviews"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'projects', 'blogs', or 'reviews'" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array of { slug, order } objects" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (typeof item.slug !== "string" || typeof item.order !== "number") {
        return NextResponse.json(
          { error: "Each item must have a string 'slug' and number 'order'" },
          { status: 400 }
        );
      }
    }

    switch (type) {
      case "projects":
        await updateProjectsOrder(items);
        break;
      case "blogs":
        await updateBlogsOrder(items);
        break;
      case "reviews":
        await updateReviewsOrder(items);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    const message = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
