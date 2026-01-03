import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Check authentication
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const cookies = request.cookies;
  const authToken = cookies.get("authToken");
  return authToken?.value === "authenticated";
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is missing");
    return NextResponse.json(
      { error: "Storage token not configured. Please set BLOB_READ_WRITE_TOKEN." },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, GIF, or WebP." }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    // Generate filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
    const timestamp = Date.now();
    const filename = `images/${baseName}-${timestamp}.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      success: true,
      path: blob.url,
      filename: blob.pathname,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to upload file: ${errorMessage}` }, { status: 500 });
  }
}

// GET - List all images from Vercel Blob
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is missing");
    return NextResponse.json(
      { error: "Storage token not configured. Please set BLOB_READ_WRITE_TOKEN." },
      { status: 500 },
    );
  }

  try {
    const { blobs } = await list({ prefix: "images/", token: process.env.BLOB_READ_WRITE_TOKEN });

    const images = blobs.map((blob) => ({
      name: blob.pathname.replace("images/", ""),
      path: blob.url,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error listing images:", error);
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}
