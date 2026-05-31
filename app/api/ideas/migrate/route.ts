import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { insertIdea, uploadIdeaFiles } from "@/lib/ideas";

export const runtime = "nodejs";

type LegacyIdea = {
  id?: string; title?: string; problemStatement?: string; suggestion?: string; impact?: string; location?: string;
  coordinates?: { lat?: number; lng?: number }; uploadedImages?: string[]; uploadedDocuments?: string[];
  createdAt?: string; status?: string;
};

export async function POST(request: Request) {
  try {
    const ideas = await request.json() as LegacyIdea[];
    if (!Array.isArray(ideas)) return NextResponse.json({ error: "Invalid migration payload" }, { status: 400 });
    for (const idea of ideas) {
      if (!idea.title || !idea.problemStatement || !idea.suggestion || !idea.impact) continue;
      const exists = idea.id ? await sql`SELECT id FROM ideas WHERE id = ${idea.id}::uuid` : [];
      if (exists.length) continue;
      const imageUrls = await migrateUrls(idea.uploadedImages ?? [], "idea-image");
      const documentUrls = await migrateUrls(idea.uploadedDocuments ?? [], "idea-document");
      await insertIdea({
        id: idea.id, title: idea.title, problemStatement: idea.problemStatement, suggestion: idea.suggestion,
        impact: idea.impact, location: idea.location, latitude: idea.coordinates?.lat ?? null,
        longitude: idea.coordinates?.lng ?? null, imageUrls, documentUrls, createdAt: idea.createdAt,
        status: idea.status ?? "Under Review",
      });
    }
    return NextResponse.json({ migrated: true });
  } catch (error) {
    console.error("Idea migration error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to migrate ideas" }, { status: 400 });
  }
}

async function migrateUrls(values: string[], type: string) {
  const urls = values.filter((value) => /^https?:\/\//.test(value));
  const files = await Promise.all(values.filter((value) => value.startsWith("data:")).map(dataUrlToFile));
  return [...urls, ...await uploadIdeaFiles(files, type)];
}

async function dataUrlToFile(dataUrl: string) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], `legacy-${crypto.randomUUID()}`, { type: blob.type });
}
