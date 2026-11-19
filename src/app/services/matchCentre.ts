const endpoint = "https://site.api.espn.com/apis/site/v2/sports/soccer";

export const leagues = {
  "ind.1": "Indian Super League",
  "eng.1": "Premier League",
  "fra.1": "Ligue 1",
  "esp.1": "La Liga",
  "uefa.champions": "UEFA Champions League",
};

export type League = keyof typeof leagues;
export type MatchView = "previous" | "live" | "upcoming";
export type Team = { id?: string; displayName: string; shortDisplayName?: string; abbreviation?: string; logo?: string; logos?: { href: string }[] };
type Competitor = { homeAway: string; team: Team; score?: string | { displayValue: string } };
export type Competition = {
  date: string;
  timeValid?: boolean;
  venue?: { fullName?: string };
  competitors: Competitor[];
  details?: {
    scoringPlay?: boolean;
    ownGoal?: boolean;
    shootout?: boolean;
    team?: { id: string };
    athletesInvolved?: { id: string; displayName: string }[];
  }[];
  status: { displayClock?: string; type: { state: string; detail?: string; shortDetail?: string } };
};

type Event = { id: string; competitions: Competition[] };
type Board = { leagues?: { calendar?: unknown[] }[]; events: Event[] };
type Play = { id: string; text?: string; shortText?: string; clock?: { displayValue: string }; type?: { text: string } };
type Summary = {
  header?: { competitions: Competition[] };
  gameInfo?: { venue?: { fullName?: string; address?: { city?: string; country?: string } }; attendance?: number; officials?: { displayName: string; position?: { displayName: string } }[] };
  keyEvents?: Play[];
  commentary?: Play[];
  boxscore?: { teams?: { team: Team; statistics?: { name: string; label?: string; displayValue: string }[] }[] };
  rosters?: { homeAway: string; team: Team; formation?: string; roster?: { starter?: boolean; played?: boolean; athlete: Team; jersey?: string }[] }[];
};

export function isLeague(value: string): value is League {
  return Object.hasOwn(leagues, value);
}

type CompetitionFeed = League | "uefa.champions_qual";

async function request<T>(league: CompetitionFeed, path: string, revalidate: number): Promise<T> {
  const response = await fetch(`${endpoint}/${league}/${path}`, {
    next: { revalidate },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Football feed returned ${response.status}`);
  return response.json() as Promise<T>;
}

export function matchTeams(match: Competition) {
  const home = match.competitors.find((team) => team.homeAway === "home");
  const away = match.competitors.find((team) => team.homeAway === "away");
  return { home, away };
}

export function matchScore(match: Competition) {
  const { home, away } = matchTeams(match);
  const score = (team?: Competitor) => typeof team?.score === "object" ? team.score.displayValue : team?.score;
  return score(home) != null && score(away) != null ? `${score(home)} – ${score(away)}` : undefined;
}

export function kickoff(match: Competition) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    ...(match.timeValid === false ? {} : { timeStyle: "short" as const }),
    timeZone: "Asia/Kolkata",
  }).format(new Date(match.date)) + (match.timeValid === false ? "" : " IST");
}

export async function getMatchListing(league: League, view: MatchView) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
  const state = { previous: "post", live: "in", upcoming: "pre" }[view];
  const board = view === "live" ? undefined : await request<Board>(league, "scoreboard", 600).catch(() => undefined);
  const dates = [...new Set((board?.leagues?.[0]?.calendar ?? []).flatMap((date) => typeof date === "string" ? [date.slice(0, 10)] : []))].sort();
  const nearby = view === "previous"
    ? dates.filter((date) => date < today).slice(-2)
    : dates.filter((date) => date > today).slice(0, 2);
  const yesterday = new Date(Date.parse(today + "T00:00:00Z") - 86400000).toISOString().slice(0, 10);
  // ESPN exposes Champions League stages instead of a list of match dates.
  const europeanDates = league === "uefa.champions" && view !== "live" && !nearby.length
    ? Array.from({ length: 28 }, (_, index) => {
      const offset = (index + 1) * (view === "previous" ? -1 : 1);
      return new Date(Date.parse(today + "T00:00:00Z") + offset * 86400000);
    }).filter((date) => [2, 3].includes(date.getUTCDay())).map((date) => date.toISOString().slice(0, 10))
    : [];
  const requestedDates = view === "live" ? [yesterday, today] : [today, ...nearby, ...europeanDates];
  const boards = await Promise.allSettled(requestedDates.map((date) =>
    request<Board>(league, `scoreboard?dates=${date.replaceAll("-", "")}`, view === "live" ? 30 : 300)
  ));
  const results = new Map<string, { id: string; league: League; match: Competition }>();
  for (const feed of [...boards.flatMap((result) => result.status === "fulfilled" ? [result.value] : []), ...(board ? [board] : [])]) {
    for (const event of feed.events ?? []) {
      const match = event.competitions[0];
      if (match?.status.type.state === state) results.set(event.id, { id: event.id, league, match });
    }
  }
  return {
    matches: [...results.values()],
    incomplete: boards.some((result) => result.status === "rejected") || (view !== "live" && !board),
  };
}

export async function getMatchSummary(league: League, id: string) {
  return request<Summary>(league, `summary?event=${id}`, 30);
}

export async function getCompetitionMatches(league: CompetitionFeed, dates: readonly string[]) {
  const feeds = await Promise.allSettled(dates.map((date) =>
    request<Board>(league, `scoreboard?dates=${date.replaceAll("-", "")}`, 600)
  ));
  const matches = new Map<string, { id: string; match: Competition }>();
  for (const feed of feeds) {
    if (feed.status !== "fulfilled") continue;
    for (const event of feed.value.events ?? []) {
      const match = event.competitions[0];
      if (match) matches.set(event.id, { id: event.id, match });
    }
  }
  return {
    matches: [...matches.values()].sort((a, b) => a.match.date.localeCompare(b.match.date)),
    incomplete: feeds.some((feed) => feed.status === "rejected"),
  };
}
