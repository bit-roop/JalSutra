import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ error: "Search query is required" }, { status: 400 });

  try {
    const params = new URLSearchParams({ q: query, format: "jsonv2", limit: "1" });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "JalSutra ecological report form",
      },
    });

    if (!response.ok) throw new Error("Location search failed");
    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Location search failed" },
      { status: 502 }
    );
  }
}
