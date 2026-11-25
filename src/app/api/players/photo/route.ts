import { NextResponse } from "next/server";
import type { League } from "@/app/services/matchCentre";

const sportsDbBase = "https://www.thesportsdb.com/api/v1/json/123";
const sportsDbLeague: Record<League, string> = {
  "ind.1": "Indian Super League",
  "eng.1": "English Premier League",
  "fra.1": "French Ligue 1",
  "esp.1": "Spanish La Liga",
  "uefa.champions": "UEFA Champions League",
  "ger.1": "German Bundesliga",
  "ita.1": "Italian Serie A",
  "ned.1": "Dutch Eredivisie",
  "por.1": "Portuguese Primeira Liga",
  "ksa.1": "Saudi Pro League",
  "usa.1": "American Major League Soccer",
};
type SportsDbTeam = { idTeam?: string; idESPN?: string; strTeam?: string; strTeamAlternate?: string };
type SportsDbPlayer = { strPlayer?: string; strCutout?: string; strThumb?: string; strTeam?: string };

function normalize(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const league = params.get("league") as League | null;
  const teamId = params.get("teamId");
  const teamName = params.get("team");
  const playerName = params.get("name");
  if (!league || !sportsDbLeague[league] || !teamId || !teamName || !playerName) {
    return NextResponse.json({ photo: null }, { status: 400 });
  }

  try {
    const wanted = normalize(playerName);
    const searchResponse = await fetch(`${sportsDbBase}/searchplayers.php?p=${encodeURIComponent(playerName)}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (searchResponse.ok) {
      const searchData = await searchResponse.json() as { player?: SportsDbPlayer[] };
      const found = (searchData.player ?? []).find((entry) => entry.strPlayer && normalize(entry.strPlayer) === wanted)
        ?? (searchData.player ?? []).find((entry) => entry.strPlayer && (normalize(entry.strPlayer).includes(wanted) || wanted.includes(normalize(entry.strPlayer))));
      const foundPhoto = found?.strCutout ?? found?.strThumb;
      if (foundPhoto?.startsWith("https://")) {
        return NextResponse.json({ photo: foundPhoto }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
      }
    }

    const teamsResponse = await fetch(`${sportsDbBase}/search_all_teams.php?l=${encodeURIComponent(sportsDbLeague[league])}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!teamsResponse.ok) return NextResponse.json({ photo: null }, { status: 502 });
    const teamsData = await teamsResponse.json() as { teams?: SportsDbTeam[] };
    const team = (teamsData.teams ?? []).find((entry) => entry.idESPN === teamId)
      ?? (teamsData.teams ?? []).find((entry) => normalize(`${entry.strTeam ?? ""} ${entry.strTeamAlternate ?? ""}`).includes(normalize(teamName)) || normalize(teamName).includes(normalize(entry.strTeam ?? "")));
    if (!team?.idTeam) return NextResponse.json({ photo: null }, { status: 404 });

    const rosterResponse = await fetch(`${sportsDbBase}/lookup_all_players.php?id=${encodeURIComponent(team.idTeam)}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    const rosterData = rosterResponse.ok ? await rosterResponse.json() as { player?: SportsDbPlayer[] } : {};
    let player = (rosterData.player ?? []).find((entry) => entry.strPlayer && normalize(entry.strPlayer) === wanted)
      ?? (rosterData.player ?? []).find((entry) => entry.strPlayer && (normalize(entry.strPlayer).includes(wanted) || wanted.includes(normalize(entry.strPlayer))));

    const photo = player?.strCutout ?? player?.strThumb;
    if (!photo || !photo.startsWith("https://")) return NextResponse.json({ photo: null }, { status: 404 });
    return NextResponse.json({ photo }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return NextResponse.json({ photo: null }, { status: 502 });
  }
}
