import { NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { insertIdea, toIdeaSubmission, uploadIdeaFiles } from "@/lib/ideas";

export const runtime = "nodejs";

const ideaSchema = z.object({
  title: z.string().trim().min(1),
  problemStatement: z.string().trim().min(1),
  suggestion: z.string().trim().min(1),
  impact: z.string().trim().min(1),
  location: z.string().trim().optional(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export async function GET(request: Request) {
  try {
    const limit = Math.min(Number(new URL(request.url).searchParams.get("limit") ?? 100), 100);
    const ideas = await sql`
      SELECT id, title, problem_statement, suggestion, impact, location, latitude, longitude,
             image_urls, document_urls, status, created_at
      FROM ideas ORDER BY created_at DESC LIMIT ${limit}
    `;
    return NextResponse.json({ ideas: ideas.map(toIdeaSubmission) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load ideas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const idea = ideaSchema.parse({
      title: formData.get("title"),
      problemStatement: formData.get("problemStatement"),
      suggestion: formData.get("suggestion"),
      impact: formData.get("expectedImpact"),
      location: formData.get("location") || undefined,
      latitude: toNullableNumber(formData.get("latitude")),
      longitude: toNullableNumber(formData.get("longitude")),
    });
    const files = formData.getAll("files").filter((file): file is File => file instanceof File);
    if (files.some((file) => !file.type.startsWith("image/") && file.type !== "application/pdf")) {
      return NextResponse.json({ error: "Files must be JPG, PNG, or PDF" }, { status: 400 });
    }
    const imageUrls = await uploadIdeaFiles(files.filter((file) => file.type.startsWith("image/")), "idea-image");
    const documentUrls = await uploadIdeaFiles(files.filter((file) => file.type === "application/pdf"), "idea-document");
    const [saved] = await insertIdea({ ...idea, imageUrls, documentUrls });
    return NextResponse.json({ idea: toIdeaSubmission(saved) }, { status: 201 });
  } catch (error) {
    console.error("Idea save error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to submit idea" }, { status: 400 });
  }
}

function toNullableNumber(value: FormDataEntryValue | null) {
  return value === null || value === "" ? null : Number(value);
}
