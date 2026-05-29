import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const alerts = await sql`
      SELECT id, title, category, location, created_at
      FROM alerts
      ORDER BY created_at DESC
      LIMIT 10
    `;
    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, category, location } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [alert] = await sql`
      INSERT INTO alerts (title, category, location)
      VALUES (${title}, ${category ?? "general"}, ${location ?? "Patna, Bihar"})
      RETURNING *
    `;

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
