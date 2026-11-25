import { NextResponse } from "next/server";
import { getLeagueTeamDirectory, type DirectoryTeam } from "@/app/services/teamDirectory";
import { leagues, type League } from "@/app/services/matchCentre";

export const revalidate = 21600;

type ESPNPlayer = {
  id?: string;
  fullName?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  position?: string | { displayName?: string; name?: string };
  nationality?: string;
  jersey?: string;
  headshot?: string | { href?: string };
};
type RosterGroup = { position?: string; items?: ESPNPlayer[]; athletes?: ESPNPlayer[] };
type RosterResponse = { athletes?: (ESPNPlayer | RosterGroup)[] };
type DirectoryPlayer = {
  id: string;
  name: string;
  position: string;
  nationality: string;
  jersey?: string;
  photo?: string;
  team: string;
  teamId: string;
  teamLogo?: string;
  leagues: string[];
  leagueCodes: League[];
};

function isRosterGroup(value: ESPNPlayer | RosterGroup): value is RosterGroup {
  return "items" in value || "athletes" in value;
}

function photoUrl(value: ESPNPlayer["headshot"]): string | undefined {
  const url = typeof value === "string" ? value : value?.href;
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.href : undefined;
  } catch { return undefined; }
}

async function getRoster(team: DirectoryTeam, leagueCodes: League[]): Promise<DirectoryPlayer[]> {
  const leagueNames = leagueCodes.map((league) => leagues[league]);
  try {
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueNames[0] ? leagueKey(leagueNames[0]) : "eng.1"}/teams/${team.id}/roster`, {
      next: { revalidate },
      signal: AbortSignal.timeout(9000),
    });
    if (!response.ok) return [];
    const data = await response.json() as RosterResponse;
    const players = (data.athletes ?? []).flatMap((entry) => {
      if (isRosterGroup(entry)) {
        return (entry.items ?? entry.athletes ?? []).map((player) => ({ player, groupPosition: entry.position }));
      }
      return [{ player: entry, groupPosition: undefined }];
    });
    const mapped = players.flatMap(({ player, groupPosition }) => {
      const name = player.displayName ?? player.fullName ?? [player.firstName, player.lastName].filter(Boolean).join(" ");
      if (!name) return [];
      const position = typeof player.position === "string"
        ? player.position
        : player.position?.displayName ?? player.position?.name ?? groupPosition ?? "Player";
      return [{
        id: player.id ?? `${team.id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name,
        position,
        nationality: player.nationality ?? "",
        jersey: player.jersey,
        photo: photoUrl(player.headshot) ?? (player.id ? `https://a.espncdn.com/i/headshots/soccer/players/full/${encodeURIComponent(player.id)}.png` : undefined),
        team: team.name,
        teamId: team.id,
        teamLogo: team.logo,
        leagues: leagueNames,
        leagueCodes,
      }];
    });
    return mapped;
  } catch {
    return [];
  }
}

function leagueKey(name: string): League {
  return (Object.entries(leagues).find(([, label]) => label === name)?.[0] ?? "eng.1") as League;
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const result: R[] = Array(items.length);
  let nextIndex = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      result[index] = await worker(items[index]);
    }
  }));
  return result;
}

export async function GET(request: Request) {
  const selected = new URL(request.url).searchParams.get("league") ?? "all";
  const selectedLeagues = (Object.keys(leagues) as League[]).filter((league) => selected === "all" || selected === league);
  if (!selectedLeagues.length) return NextResponse.json({ players: [], leagues: [] }, { status: 400 });

  const directories = await Promise.all(selectedLeagues.map(async (league) => ({
    league,
    teams: await getLeagueTeamDirectory(league),
  })));
  const teamMap = new Map<string, { team: DirectoryTeam; leagueKeys: League[] }>();
  for (const { league, teams } of directories) {
    for (const team of teams) {
      const previous = teamMap.get(team.id);
      if (previous) previous.leagueKeys = [...new Set([...previous.leagueKeys, league])];
      else teamMap.set(team.id, { team, leagueKeys: [league] });
    }
  }

  const teams = [...teamMap.values()];
  const rosters = await mapWithConcurrency(teams, 12, ({ team, leagueKeys }) =>
    getRoster(team, leagueKeys)
  );
  const players = new Map<string, DirectoryPlayer>();
  for (const player of rosters.flat()) {
    const existing = players.get(player.id);
    if (existing) {
      existing.leagues = [...new Set([...existing.leagues, ...player.leagues])];
      existing.leagueCodes = [...new Set([...existing.leagueCodes, ...player.leagueCodes])];
    }
    else players.set(player.id, player);
  }

  return NextResponse.json({
    players: [...players.values()].sort((a, b) => a.name.localeCompare(b.name)),
    leagues: selectedLeagues.map((league) => ({ id: league, name: leagues[league] })),
    teamCount: teams.length,
  }, {
    headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" },
  });
}
