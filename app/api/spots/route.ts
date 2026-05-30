import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const spots = await sql`
      SELECT id, name, category, description, latitude, longitude, location, city,
             district, status, verified, image_url, created_by, support_count, created_at
      FROM spots
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ spots });
  } catch (error) {
    console.error("Spots DB error:", error);
    return NextResponse.json({ error: "Failed to fetch ecological spots" }, { status: 500 });
  }
}
