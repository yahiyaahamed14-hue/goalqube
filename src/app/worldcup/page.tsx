import Link from "next/link";
import Navbar from "@/components/Navbar";
import MatchClub from "@/components/MatchClub";
import WorldCupFilters from "./WorldCupFilters";
import { editions, finalScore, nationalTeam, normalizedRound, years, type WorldCupMatch } from "./worldCupData";

const dateLabel = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });
const knockoutOrder = ["Preliminary round", "First round", "Round of 32", "Round of 16", "Quarter-finals", "Semi-finals", "Final round", "Final"];

function MatchResult({ match }: { match: WorldCupMatch }) {
  const { score, penalties } = finalScore(match);
  return (
    <span className="md-score inline-block text-sm">
      {score?.join(" – ") ?? (match.status === "canceled" ? "Cancelled" : "Score unavailable")}
      {penalties && ` (${penalties.join(" – ")} pens)`}
    </span>
  );
}

function MatchInfo({ match }: { match: WorldCupMatch }) {
  const { extraTime } = finalScore(match);
  return (
    <div className="mt-2 space-y-1 text-xs text-zinc-400">
      <p><time dateTime={match.date}>{dateLabel.format(new Date(match.date))}</time>{extraTime && " · After extra time"}</p>
      {match.ground && <p>{match.ground}</p>}
      {([[match.team1, match.goals1], [match.team2, match.goals2]] as const).map(([team, goals]) =>
        goals?.length ? <p key={team}><strong>{team}</strong> {goals.map(({ name, minute, owngoal }) =>
          `${name} ${minute}′${owngoal ? " (og)" : ""}`
        ).join(", ")}</p> : null
      )}
    </div>
  );
}

function MatchList({ matches }: { matches: WorldCupMatch[] }) {
  return (
    <ol className="divide-y divide-[#e7e9e2]">
      {matches.map((match) => (
        <li className="py-3" key={`${match.date}-${match.team1}-${match.team2}`}>
          <p className="mb-1 text-xs font-bold text-zinc-400">{match.group ?? match.round}</p>
          <div className="md-match-pair font-bold">
            <MatchClub team={nationalTeam(match.team1)} />
            <MatchResult match={match} />
            <MatchClub team={nationalTeam(match.team2)} />
          </div>
          <MatchInfo match={match} />
        </li>
      ))}
    </ol>
  );
}

function Roadmap({ matches, year }: { matches: WorldCupMatch[]; year: string }) {
  const stages = knockoutOrder.map((name) => ({
    name,
    matches: matches.filter((match) => normalizedRound(match.round) === name && !match.group && match.status !== "canceled"),
  })).filter((round) => round.matches.length);

  return (
    <>
      <div className="md-bracket-scroll" role="region" aria-label={`${year} World Cup bracket. Scroll horizontally to see all rounds.`} tabIndex={0}>
        <ol className="md-tournament-rounds" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(10.5rem, 1fr))`, minWidth: `${stages.length * 12}rem` }}>
          {stages.map((stage) => (
            <li className="md-bracket-round" key={stage.name}>
              <div className="md-bracket-heading"><h3>{stage.name}</h3></div>
              <ol className="md-bracket-slots">
                {stage.matches.map((match) => (
                  <li className="md-bracket-slot" key={`${match.date}-${match.team1}-${match.team2}`}>
                    <details>
                      <summary>
                        <MatchClub team={nationalTeam(match.team1)} />
                        <MatchClub team={nationalTeam(match.team2)} />
                        <span className="mt-1 inline-block"><MatchResult match={match} /></span>
                      </summary>
                      <MatchInfo match={match} />
                    </details>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
      <Link className="md-match-detail-link mt-4 inline-block text-sm font-bold" href={`/worldcup?view=archive&year=${year}`}>All {year} matches</Link>
    </>
  );
}

export default async function WorldCupPage({ searchParams }: {
  searchParams: Promise<{ view?: string; year?: string; team?: string; round?: string }>;
}) {
  const query = await searchParams;
  const view = query.view === "journey" || query.view === "archive" ? query.view : "road";
  const year = typeof query.year === "string" && years.includes(query.year) ? query.year : years[0];
  const matches = [...editions[year]].sort((a, b) => a.date.localeCompare(b.date));
  const teams = [...new Set(matches.flatMap(({ team1, team2 }) => [team1, team2]))].sort((a, b) => a.localeCompare(b));
  const rounds = [...new Set(matches.map(({ round }) => normalizedRound(round)))];
  const selectedTeam = typeof query.team === "string" && teams.includes(query.team) ? query.team : teams[0];
  const selectedRound = typeof query.round === "string" && rounds.includes(query.round) ? query.round : "";
  const journey = matches.filter(({ team1, team2 }) => team1 === selectedTeam || team2 === selectedTeam);
  const results = selectedRound ? matches.filter(({ round }) => normalizedRound(round) === selectedRound) : matches;
  const headings = { road: "Road to the Final", journey: "Team Journey", archive: "Season Archive" };
  const goals = new Map<string, number>();
  for (const match of journey) {
    const scored = match.team1 === selectedTeam ? match.goals1 : match.goals2;
    for (const goal of scored ?? []) if (!goal.owngoal) goals.set(goal.name, (goals.get(goal.name) ?? 0) + 1);
  }
  const most = Math.max(0, ...goals.values());
  const top = [...goals].filter(([, count]) => count === most).map(([name]) => name);

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      <section className="md-inner-content">
        <p className="mb-3 font-bold text-yellow-400">{year} edition</p>
        <h1 className="text-4xl font-black sm:text-7xl">FIFA World Cup</h1>
        <nav className="md-match-tabs" aria-label="World Cup view">
          {Object.entries(headings).map(([name, label]) => (
            <Link key={name} href={`/worldcup?view=${name}&year=${year}`} aria-current={view === name ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <section className="mt-6" aria-labelledby="world-cup-view">
          <h2 id="world-cup-view" className="text-2xl font-black">{headings[view]}</h2>
          <WorldCupFilters year={year} years={years} view={view} filter={view === "journey" ? selectedTeam : selectedRound} options={view === "journey" ? teams : rounds} />
          {view === "road" ? <Roadmap matches={matches} year={year} /> : (
            <div className="md-details-card mt-5">
              {view === "journey" ? (
                <>
                  <h3 className="mb-3 text-xl font-bold"><MatchClub team={nationalTeam(selectedTeam)} /></h3>
                  {most > 0 && <p className="mb-3 text-sm text-zinc-400"><strong className="text-yellow-400">Top scorer in recorded match data</strong> · {top.join(", ")} · {most} {most === 1 ? "goal" : "goals"}</p>}
                  <MatchList matches={journey} />
                </>
              ) : (
                <>
                  <h3 className="mb-3 text-xl font-bold">{year} · {results.length} matches</h3>
                  <MatchList matches={results} />
                </>
              )}
            </div>
          )}
        </section>
        <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold">
          <Link className="md-match-detail-link" href="/tournaments">Champions League</Link>
          <a className="md-match-detail-link" href="https://github.com/openfootball/worldcup.json">World Cup match data</a>
        </div>
      </section>
    </main>
  );
}
