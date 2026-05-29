import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { KnowledgeUploadType } from "@/lib/knowledge";

export const runtime = "nodejs";

const uploadTypes = new Set(["voice", "text", "photo", "video"]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadType = String(formData.get("upload_type") ?? "") as KnowledgeUploadType;
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const language = String(formData.get("language") ?? "Hindi").trim();
    const file = formData.get("file");

    if (!uploadTypes.has(uploadType)) {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    let contentUrl: string | null = null;
    let thumbnailUrl: string | null = null;

    if (uploadType !== "text") {
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Media file is required" }, { status: 400 });
      }

      const uploaded = await uploadToCloudinary(file, uploadType);
      contentUrl = uploaded.contentUrl;
      thumbnailUrl = uploaded.thumbnailUrl;
    }

    const [upload] = await sql`
      INSERT INTO uploads (
        title,
        description,
        type,
        language,
        thumbnail_url,
        file_url
      )
      VALUES (
        ${title},
        ${description},
        ${uploadType},
        ${language},
        ${thumbnailUrl},
        ${contentUrl}
      )
      RETURNING id, title, description, type, language, thumbnail_url, file_url, created_at
    `;

    return NextResponse.json({ upload }, { status: 201 });
  } catch (error) {
    console.error("Knowledge upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save upload" },
      { status: 500 }
    );
  }
}
