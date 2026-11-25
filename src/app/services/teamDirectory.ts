import { leagues, type League } from "./matchCentre";

const espnBase = "https://site.api.espn.com/apis/site/v2/sports/soccer";
const sportsDbBase = "https://www.thesportsdb.com/api/v1/json/3";
const sportsDbLeagueNames: Partial<Record<League, string>> = {
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

type TeamLogo = { href?: string; url?: string };
type ESPNTeam = {
  id?: string;
  displayName?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  logo?: string;
  logos?: TeamLogo[];
};
type ESPNTeamsResponse = {
  sports?: { leagues?: { teams?: { team?: ESPNTeam }[] }[] }[];
  leagues?: { teams?: { team?: ESPNTeam }[] }[];
  teams?: ESPNTeam[];
};
type SportsDBTeam = { idTeam?: string; strTeam?: string; strBadge?: string; strLeague?: string };

export type DirectoryTeam = {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  abbreviation?: string;
  logo?: string;
  leagues: string[];
};

export function slugifyTeam(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function safeImage(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function normalize(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function loadEspnTeams(league: League): Promise<DirectoryTeam[]> {
  const response = await fetch(`${espnBase}/${league}/teams?limit=1000`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Team directory returned ${response.status}`);
  const data = await response.json() as ESPNTeamsResponse;
  const rows = data.sports?.[0]?.leagues?.[0]?.teams ?? data.leagues?.[0]?.teams ?? data.teams?.map((team) => ({ team })) ?? [];
  return rows.flatMap(({ team }) => {
    const name = team?.displayName;
    if (!name) return [];
    return [{
      id: team?.id ?? slugifyTeam(name),
      slug: slugifyTeam(name),
      name,
      shortName: team?.shortDisplayName,
      abbreviation: team?.abbreviation,
      logo: safeImage(team?.logos?.[0]?.href ?? team?.logo),
      leagues: [leagues[league]],
    }];
  });
}

async function loadSportsDbTeams(league: League): Promise<DirectoryTeam[]> {
  const leagueName = sportsDbLeagueNames[league];
  if (!leagueName) return [];
  const response = await fetch(`${sportsDbBase}/search_all_teams.php?l=${encodeURIComponent(leagueName)}`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return [];
  const data = await response.json() as { teams?: SportsDBTeam[] };
  return (data.teams ?? []).flatMap((team) => {
    const name = team.strTeam;
    if (!name) return [];
    return [{
      id: team.idTeam ?? slugifyTeam(name),
      slug: slugifyTeam(name),
      name,
      logo: safeImage(team.strBadge),
      leagues: [leagues[league]],
    }];
  });
}

export async function getLeagueTeamDirectory(league: League): Promise<DirectoryTeam[]> {
  try {
    const teams = await loadEspnTeams(league);
    return teams.length ? teams : await loadSportsDbTeams(league);
  } catch {
    try { return await loadSportsDbTeams(league); } catch { return []; }
  }
}

export async function getTeamDirectory(): Promise<DirectoryTeam[]> {
  const entries = Object.keys(leagues) as League[];
  const feeds = await Promise.all(entries.map(getLeagueTeamDirectory));
  const byName = new Map<string, DirectoryTeam>();
  for (const team of feeds.flat()) {
    const key = normalize(team.name);
    const existing = byName.get(key);
    if (existing) {
      existing.leagues = [...new Set([...existing.leagues, ...team.leagues])];
      existing.logo ??= team.logo;
    } else {
      byName.set(key, team);
    }
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export type ClubHistory = {
  id: string;
  name: string;
  badge?: string;
  country?: string;
  league?: string;
  founded?: string;
  stadium?: string;
  stadiumLocation?: string;
  description?: string;
  website?: string;
  historySource?: string;
  historyUrl?: string;
};

export async function getClubHistory(teamName: string): Promise<ClubHistory | null> {
  let sportsDbRecord: ClubHistory | null = null;
  try {
    const response = await fetch(`${sportsDbBase}/searchteams.php?t=${encodeURIComponent(teamName)}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
    });
    if (response.ok) {
      const data = await response.json() as { teams?: {
        idTeam?: string; strTeam?: string; strBadge?: string; strCountry?: string; strLeague?: string;
        intFormedYear?: string; strStadium?: string; strStadiumLocation?: string; strDescriptionEN?: string; strWebsite?: string;
      }[] };
      const exact = (data.teams ?? []).find((item) => item.strTeam && normalize(item.strTeam) === normalize(teamName));
      const team = exact ?? data.teams?.[0];
      if (team?.strTeam) sportsDbRecord = {
        id: team.idTeam ?? slugifyTeam(team.strTeam),
        name: team.strTeam,
        badge: safeImage(team.strBadge),
        country: team.strCountry || undefined,
        league: team.strLeague || undefined,
        founded: team.intFormedYear || undefined,
        stadium: team.strStadium || undefined,
        stadiumLocation: team.strStadiumLocation || undefined,
        description: team.strDescriptionEN?.trim() || undefined,
        website: team.strWebsite?.startsWith("http") ? team.strWebsite : undefined,
      };
      if (sportsDbRecord?.description) return { ...sportsDbRecord, historySource: "TheSportsDB" };
    }
  } catch {
    // Try Wikipedia for the club's historical introduction if the team feed is unavailable.
  }

  try {
    const search = await fetch(`https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(`${teamName} football club`)}&limit=5`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
      headers: { "Api-User-Agent": "Goalqube/1.0 (club history pages)" },
    });
    if (!search.ok) return sportsDbRecord;
    const matches = await search.json() as { pages?: { title?: string; key?: string }[] };
    const page = matches.pages?.find((result) => result.title && normalize(result.title).includes(normalize(teamName))) ?? matches.pages?.[0];
    if (!page?.title) return sportsDbRecord;
    const summary = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(6000),
      headers: { "Api-User-Agent": "Goalqube/1.0 (club history pages)" },
    });
    if (!summary.ok) return sportsDbRecord;
    const article = await summary.json() as { title?: string; extract?: string; content_urls?: { desktop?: { page?: string } } };
    if (!article.extract) return sportsDbRecord;
    return {
      ...sportsDbRecord,
      id: page.key ?? slugifyTeam(teamName),
      name: sportsDbRecord?.name ?? article.title ?? teamName,
      description: article.extract,
      historySource: "Wikipedia",
      historyUrl: article.content_urls?.desktop?.page,
    };
  } catch {
    return sportsDbRecord;
  }
}
