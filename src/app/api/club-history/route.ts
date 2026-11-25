import { NextRequest, NextResponse } from "next/server";
import { getClubHistory } from "@/app/services/teamDirectory";

export async function GET(request: NextRequest) {
  const teamName = request.nextUrl.searchParams.get("team")?.trim().slice(0, 100);
  if (!teamName) return NextResponse.json({ error: "A club name is required." }, { status: 400 });
  try {
    const team = await getClubHistory(teamName);
    if (!team) return NextResponse.json({ error: "Club history is not available yet." }, { status: 404 });
    return NextResponse.json(team, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  } catch {
    return NextResponse.json({ error: "Club history could not be loaded." }, { status: 502 });
  }
}
