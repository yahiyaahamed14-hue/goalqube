import { NextResponse } from "next/server";
import { getTeamDirectory } from "@/app/services/teamDirectory";

export const revalidate = 3600;

export async function GET() {
  const teams = await getTeamDirectory();
  return NextResponse.json(teams, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
