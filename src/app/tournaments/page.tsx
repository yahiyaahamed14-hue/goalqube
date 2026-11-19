import Link from "next/link";
import SeasonArchive from "./SeasonArchive";
import HistoricalRoad from "./HistoricalRoad";
import RoadSeasonSelect from "./RoadSeasonSelect";
import { currentSeason, historicalMatches, seasonLabel } from "./archiveData";
import Navbar from "@/components/Navbar";
import MatchClub from "@/components/MatchClub";
import { getCompetitionMatches, kickoff, matchScore, matchTeams, type Competition, type Team } from "../services/matchCentre";

const league = "uefa.champions";
const leagueDates = [
  "2026-09-08", "2026-09-09", "2026-09-10", "2026-10-13", "2026-10-14",
  "2026-10-20", "2026-10-21", "2026-11-03", "2026-11-04", "2026-11-24", "2026-11-25",
  "2026-12-08", "2026-12-09", "2027-01-19", "2027-01-20", "2027-01-27",
];

// UEFA 2026/27 match calendar. The feed supplies the confirmed opponents and scores.
const rounds = [
  { name: "Knockout play-offs", label: "16–24 February", dates: ["2027-02-16", "2027-02-17", "2027-02-23", "2027-02-24"] },
  { name: "Round of 16", label: "9–17 March", dates: ["2027-03-09", "2027-03-10", "2027-03-16", "2027-03-17"] },
  { name: "Quarter-finals", label: "6–14 April", dates: ["2027-04-06", "2027-04-07", "2027-04-13", "2027-04-14"] },
  { name: "Semi-finals", label: "27 April – 5 May", dates: ["2027-04-27", "2027-04-28", "2027-05-04", "2027-05-05"] },
  { name: "Final", label: "5 June · Madrid", dates: ["2027-06-05"] },
];
const knockoutDates = rounds.flatMap((round) => round.dates);
const roadSeasons = [currentSeason, ...Object.keys(historicalMatches).map(Number).sort((a, b) => b - a)]
  .map((year) => ({ year, label: seasonLabel(year) }));

type Fixture = { id: string; match: Competition };

function FixtureLink({ fixture }: { fixture: Fixture }) {
  const { home, away } = matchTeams(fixture.match);
  const score = fixture.match.status.type.state !== "pre" ? matchScore(fixture.match) : undefined;
  return (
    <Link className="md-match-detail-link block" href={`/match/${fixture.id}?league=${league}`}>
      <span className="md-match-pair font-bold">
        <MatchClub team={home?.team} />
        <span className="md-score text-sm">{score || "vs"}</span>
        <MatchClub team={away?.team} />
      </span>
      <time className="mt-2 block text-sm text-zinc-400" dateTime={fixture.match.date}>{kickoff(fixture.match)}</time>
    </Link>
  );
}

function groupTies(fixtures: Fixture[]) {
  const ties = new Map<string, Fixture[]>();
  for (const fixture of fixtures) {
    const key = fixture.match.competitors.map(({ team }) => team.id ?? team.displayName).sort().join(":");
    ties.set(key, [...(ties.get(key) ?? []), fixture]);
  }
  return [...ties.values()];
}

function aggregate(tie: Fixture[]) {
  if (tie.length !== 2 || tie.some(({ match }) => match.status.type.state !== "post")) return undefined;
  const teams = new Map<string, number>();
  for (const { match } of tie) {
    for (const { team, score } of match.competitors) {
      const value = typeof score === "object" ? score.displayValue : score;
      if (!value || !/^\d+$/.test(value)) return undefined;
      const key = team.id ?? team.displayName;
      teams.set(key, (teams.get(key) ?? 0) + Number(value));
    }
  }
  return [...teams.values()].join(" – ");
}

export default async function TournamentsPage({ searchParams }: {
  searchParams: Promise<{ view?: string; club?: string; season?: string; round?: string }>;
}) {
  const { view, club, season, round } = await searchParams;
  const archive = view === "archive";
  const journey = view === "journey";
  const roadSeason = roadSeasons.find(({ year }) => String(year) === season)?.year ?? currentSeason;
  const historicalRoad = !archive && !journey && roadSeason !== currentSeason;
  const [knockouts, phase] = await Promise.all([
    archive || historicalRoad ? { matches: [], incomplete: false } : getCompetitionMatches(league, knockoutDates),
    journey ? getCompetitionMatches(league, leagueDates) : undefined,
  ]);
  const fixtures = [...(phase?.matches ?? []), ...knockouts.matches];
  const clubs = new Map<string, Team>();
  if (journey) {
    for (const { match } of fixtures) {
      for (const { team } of match.competitors) {
        if (team.id) clubs.set(team.id, team);
      }
    }
  }
  const options = [...clubs].sort((a, b) => a[1].displayName.localeCompare(b[1].displayName));
  const selected = typeof club === "string" && clubs.has(club) ? club : options[0]?.[0];
  const timeline = fixtures.filter(({ match }) => match.competitors.some(({ team }) => team.id === selected));
  const next = timeline.find(({ match }) => match.status.type.state === "pre");
  const goals = new Map<string, { name: string; total: number }>();
  for (const { match } of timeline) {
    if (match.status.type.state !== "post") continue;
    for (const event of match.details ?? []) {
      const scorer = event.athletesInvolved?.[0];
      if (!scorer || !event.scoringPlay || event.ownGoal || event.shootout || event.team?.id !== selected) continue;
      goals.set(scorer.id, { name: scorer.displayName, total: (goals.get(scorer.id)?.total ?? 0) + 1 });
    }
  }
  const mostGoals = Math.max(0, ...[...goals.values()].map(({ total }) => total));
  const topScorers = [...goals.values()].filter(({ total }) => total === mostGoals).map(({ name }) => name);

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      <section className="md-inner-content">
        {!archive && <p className="mb-3 font-bold text-yellow-400">{seasonLabel(journey ? currentSeason : roadSeason)} season</p>}
        <h1 className="text-4xl font-black sm:text-7xl">UEFA Champions League</h1>
        <nav className="md-match-tabs" aria-label="Tournament view">
          <Link href="/tournaments" aria-current={!journey && !archive ? "page" : undefined}>Road to the Final</Link>
          <Link href="/tournaments?view=journey" aria-current={journey ? "page" : undefined}>Club Journey</Link>
          <Link href="/tournaments?view=archive" aria-current={archive ? "page" : undefined}>Season Archive</Link>
        </nav>
        {archive ? (
          <SeasonArchive season={season} round={round} leagueDates={leagueDates} knockoutDates={knockoutDates} />
        ) : journey ? (
          <section className="mt-6" aria-labelledby="journey-title">
            <h2 id="journey-title" className="text-2xl font-black">Club Journey</h2>
            {(phase?.incomplete || knockouts.incomplete) && <p className="mt-3 text-sm text-zinc-400">Some fixtures are temporarily unavailable.</p>}
            {options.length ? (
              <>
                <form action="/tournaments" className="mt-4 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="view" value="journey" />
                  <label className="grid gap-1 text-sm font-bold">
                    Club
                    <select key={selected} name="club" defaultValue={selected} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-medium">
                      {options.map(([id, team]) => <option key={id} value={id}>{team.displayName}</option>)}
                    </select>
                  </label>
                  <button className="md-score cursor-pointer px-4 py-2 font-bold">View journey</button>
                </form>
                <div className="md-details-card mt-5">
                  <h3 className="mb-4 text-xl font-bold"><MatchClub team={selected ? clubs.get(selected) : undefined} /></h3>
                  {mostGoals > 0 && <p className="mb-4 text-sm text-zinc-400">
                    <strong className="text-yellow-400">{topScorers.length > 1 ? "Joint top scorers" : "Top scorer"}</strong>
                    {" · "}{topScorers.join(", ")}{" · "}{mostGoals} {mostGoals === 1 ? "goal" : "goals"}
                  </p>}
                  <ol className="divide-y divide-[#e7e9e2]">
                    {timeline.map((fixture) => (
                      <li className="py-3" key={fixture.id}>
                        {fixture.id === next?.id && <p className="mb-2 text-sm font-bold text-yellow-400">Next match</p>}
                        <FixtureLink fixture={fixture} />
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            ) : <p className="md-details-card mt-4">Club fixtures are currently unavailable.</p>}
          </section>
        ) : (
          <section className="mt-6" aria-labelledby="road-title">
            <h2 id="road-title" className="text-2xl font-black">Road to the Final</h2>
            <RoadSeasonSelect season={roadSeason} options={roadSeasons} />
            {historicalRoad ? <HistoricalRoad season={roadSeason} /> : <>
            {knockouts.incomplete && <p className="mt-2 text-sm text-zinc-400">Some dates could not be checked for fixtures.</p>}
            <div className="md-bracket-scroll" role="region" aria-label="Knockout bracket. Scroll horizontally to see all rounds." tabIndex={0}>
              <ol className="md-tournament-rounds">
                {rounds.map((round, index) => {
                  const ties = groupTies(knockouts.matches.filter(({ match }) => round.dates.includes(match.date.slice(0, 10))));
                  const slots = [8, 8, 4, 2, 1][index];

                  return (
                    <li key={round.name} className="md-bracket-round">
                      <div className="md-bracket-heading">
                        <h3>{round.name}</h3>
                        <p>{round.label}</p>
                      </div>
                      <ol className="md-bracket-slots">
                        {Array.from({ length: Math.max(slots, ties.length) }, (_, position) => {
                          const tie = ties[position];
                          const score = tie && aggregate(tie);
                          const teams = tie && matchTeams(tie[0].match);

                          return (
                            <li className="md-bracket-slot" key={tie?.[0].id ?? position}>
                              {tie && teams ? (
                                <details>
                                  <summary>
                                    <MatchClub team={teams.home?.team} />
                                    <MatchClub team={teams.away?.team} />
                                  </summary>
                                  {score && <p className="mt-2 text-sm font-bold">Aggregate {score}</p>}
                                  <ul>{tie.map((fixture) => <li key={fixture.id} className="mt-3"><FixtureLink fixture={fixture} /></li>)}</ul>
                                </details>
                              ) : (
                                <div className="md-bracket-pending"><span>To be decided</span><span>To be decided</span></div>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </li>
                  );
                })}
              </ol>
            </div>
            </>}
          </section>
        )}
        <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold">
          <Link className="md-match-detail-link" href="/standings?league=uefa.champions">Champions League table</Link>
          <Link className="md-match-detail-link" href="/worldcup">World Cup 2026</Link>
          <a className="md-match-detail-link" href="https://www.uefa.com/uefachampionsleague/news/02a6-20d57cfcd03e-407c22a7f465-1000--2026-27-champions-league-teams-draws-format-final/">UEFA match calendar</a>
        </div>
      </section>
    </main>
  );
}
