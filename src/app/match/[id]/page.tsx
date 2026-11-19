import Link from "next/link";
import Navbar from "@/components/Navbar";
import MatchClub from "@/components/MatchClub";
import AutoRefresh from "@/components/AutoRefresh";
import { getMatchSummary, isLeague, kickoff, leagues, matchScore, matchTeams } from "@/app/services/matchCentre";

export default async function MatchDetailsPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ league?: string }>;
}) {
  const [{ id }, { league }] = await Promise.all([params, searchParams]);
  const validLeague = typeof league === "string" && isLeague(league) ? league : undefined;
  const summary = validLeague && /^\d{1,12}$/.test(id)
    ? await getMatchSummary(validLeague, id).catch(() => undefined)
    : undefined;
  const match = summary?.header?.competitions?.[0];
  const state = match?.status.type.state;
  const tab = state === "in" ? "live" : state === "pre" ? "upcoming" : "previous";
  const venue = summary?.gameInfo?.venue;
  const stats = summary?.boxscore?.teams ?? [];
  const rosters = summary?.rosters ?? [];
  const timeline = summary?.keyEvents ?? [];
  const commentary = summary?.commentary ?? [];
  const { home, away } = match ? matchTeams(match) : {};

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      {state === "in" && <AutoRefresh intervalMs={30000} />}
      <section className="md-inner-content">
        <Link className="md-match-detail-link" href={`/matches?view=${tab}${validLeague ? `&league=${validLeague}` : ""}`}>Back to Match Centre</Link>
        {!match || !validLeague ? (
          <h1 className="mt-6 text-3xl font-black">Match details are unavailable</h1>
        ) : (
          <>
            <p className="mt-8 font-bold text-yellow-400">{leagues[validLeague]}</p>
            <h1 className="mt-2 text-4xl font-black sm:text-6xl"><span className="md-match-pair"><MatchClub team={home?.team} /><span className="md-match-versus">vs</span><MatchClub team={away?.team} /></span></h1>
            <p className="mt-5 flex flex-wrap items-center gap-3">
              {state !== "pre" && matchScore(match) && <strong className="md-score text-2xl">{matchScore(match)}</strong>}
              <strong>{match.status.type.detail || match.status.displayClock}</strong>
              <time dateTime={match.date}>{kickoff(match)}</time>
            </p>
            <p className="mt-3 text-zinc-400">{[venue?.fullName ?? match.venue?.fullName, venue?.address?.city, venue?.address?.country].filter(Boolean).join(" · ") || "Venue unavailable"}</p>
            {!!summary?.gameInfo?.attendance && <p className="mt-1 text-zinc-400">Attendance {summary.gameInfo.attendance.toLocaleString("en-IN")}</p>}
            {!!summary?.gameInfo?.officials?.length && <p className="mt-1 text-zinc-400">{summary.gameInfo.officials.map((official) => [official.position?.displayName, official.displayName].filter(Boolean).join(" ")).join(" · ")}</p>}
            <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">
              <section className="md-details-card">
                <h2>Match events</h2>
                {timeline.length ? <ol className="space-y-2">{timeline.map((event) => (
                  <li key={event.id}><strong>{event.clock?.displayValue}</strong> {event.text || event.shortText || event.type?.text}</li>
                ))}</ol> : <p>{state === "pre" ? "Events will appear once play begins." : "Match events are unavailable."}</p>}
              </section>
              <section className="md-details-card">
                <h2>Team statistics</h2>
                {stats.some(({ statistics }) => statistics?.length) ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {stats.map(({ team, statistics = [] }) => (
                      <div key={team.displayName}>
                        <h3 className="mb-2 font-bold">{team.displayName}</h3>
                        <dl>{statistics.map((stat) => <div key={stat.name} className="flex justify-between gap-3 py-1"><dt>{stat.label || stat.name}</dt><dd>{stat.displayValue}</dd></div>)}</dl>
                      </div>
                    ))}
                  </div>
                ) : <p>Team statistics are unavailable.</p>}
              </section>
              <section className="md-details-card">
                <h2>Lineups</h2>
                {rosters.some(({ roster }) => roster?.length) ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {rosters.map(({ team, formation, roster = [] }) => (
                      <div key={team.displayName}>
                        <h3 className="mb-2 font-bold">{team.displayName} {formation && <span>· {formation}</span>}</h3>
                        <ul>{roster.map((player, index) => (
                          <li key={index}>{player.jersey} {player.athlete?.displayName}{player.starter === false && <span className="text-zinc-400"> · Substitute</span>}</li>
                        ))}</ul>
                      </div>
                    ))}
                  </div>
                ) : <p>Lineups are unavailable.</p>}
              </section>
              {!!commentary.length && <details className="md-details-card">
                <summary className="cursor-pointer text-xl font-bold">Match commentary</summary>
                <ol className="mt-3 space-y-2">{commentary.map((event) => <li key={event.id}><strong>{event.clock?.displayValue}</strong> {event.text || event.shortText}</li>)}</ol>
              </details>}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
