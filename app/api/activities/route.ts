import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const activities = userId
      ? await sql`
          SELECT a.id, a.description, a.activity_type, a.created_at, u.name as user_name
          FROM activities a
          JOIN users u ON a.user_id = u.id
          WHERE a.user_id = ${userId}
          ORDER BY a.created_at DESC
          LIMIT 20
        `
      : await sql`
          SELECT a.id, a.description, a.activity_type, a.created_at, u.name as user_name
          FROM activities a
          JOIN users u ON a.user_id = u.id
          ORDER BY a.created_at DESC
          LIMIT 20
        `;

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
