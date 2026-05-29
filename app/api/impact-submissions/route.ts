import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const missionId = String(formData.get("mission_id") ?? "").trim();
    const caption = String(formData.get("caption") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const file = formData.get("file");

    if (!missionId) {
      return NextResponse.json({ error: "Mission is required" }, { status: 400 });
    }

    if (!caption) {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }

    await ensureImpactSubmissionsTable();

    const uploaded = await uploadToCloudinary(file, "photo");

    const [submission] = await sql`
      INSERT INTO impact_submissions (
        mission_id,
        caption,
        description,
        image_url,
        thumbnail_url
      )
      VALUES (
        ${missionId},
        ${caption},
        ${description},
        ${uploaded.contentUrl},
        ${uploaded.thumbnailUrl}
      )
      RETURNING id, mission_id, caption, description, image_url, thumbnail_url, created_at
    `;

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error("Impact submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save impact submission" },
      { status: 500 }
    );
  }
}

async function ensureImpactSubmissionsTable() {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  await sql`
    CREATE TABLE IF NOT EXISTS impact_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      mission_id TEXT NOT NULL,
      caption TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      thumbnail_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS impact_submissions_mission_created_at_idx
    ON impact_submissions (mission_id, created_at DESC)
  `;
}
