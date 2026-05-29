import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const tableCheck = await sql`
      SELECT to_regclass('public.uploads') AS table_name
    `;

    if (!tableCheck[0]?.table_name) {
      return NextResponse.json({ uploads: [] });
    }

    const uploads = await sql`
      SELECT id, title, description, type, language, thumbnail_url, file_url, created_at
      FROM uploads
      ORDER BY created_at DESC
      LIMIT 5
    `;

    return NextResponse.json({ uploads });
  } catch (error) {
    console.error("Knowledge uploads fetch error:", error);
    return NextResponse.json({ uploads: [] });
  }
}
