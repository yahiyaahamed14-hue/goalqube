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
      <section className="md-inner-content md-match-dashboard">
        <Link className="md-match-detail-link md-match-dashboard-back" href={`/matches?view=${tab}${validLeague ? `&league=${validLeague}` : ""}`}><span aria-hidden="true">←</span> Back to Match Centre</Link>
        {!match || !validLeague ? (
          <h1 className="mt-6 text-3xl font-black">Match details are unavailable</h1>
        ) : (
          <>
            <article className="md-match-dashboard-scoreboard">
              <div className="md-match-dashboard-topline">
                <span className="md-match-league-pill">{leagues[validLeague]}</span>
                <span className={`md-match-status-pill ${state === "in" ? "is-live" : state === "pre" ? "is-upcoming" : ""}`}>
                  {state === "in" && <i aria-hidden="true"/>}{match.status.type.detail || match.status.displayClock || "Match centre"}
                </span>
              </div>
              <div className="md-match-dashboard-teams">
                <div className="md-match-dashboard-team md-home-team"><MatchClub team={home?.team}/></div>
                <div className="md-match-dashboard-score">
                  {state !== "pre" && matchScore(match) ? <strong>{matchScore(match)}</strong> : <strong className="md-match-kickoff-score">VS</strong>}
                  <span><time dateTime={match.date}>{kickoff(match)}</time></span>
                </div>
                <div className="md-match-dashboard-team md-away-team"><MatchClub team={away?.team}/></div>
              </div>
              <div className="md-match-dashboard-meta">
                <span>{[venue?.fullName ?? match.venue?.fullName, venue?.address?.city, venue?.address?.country].filter(Boolean).join(" · ") || "Venue unavailable"}</span>
                {!!summary?.gameInfo?.attendance && <span>Attendance {summary.gameInfo.attendance.toLocaleString("en-IN")}</span>}
                {!!summary?.gameInfo?.officials?.length && <span>{summary.gameInfo.officials.map((official) => [official.position?.displayName, official.displayName].filter(Boolean).join(" ")).join(" · ")}</span>}
              </div>
            </article>
            <div className="md-match-dashboard-grid">
              <section className="md-details-card md-match-events-card">
                <div className="md-dashboard-card-heading"><div><span className="md-dashboard-eyebrow">MATCHDAY</span><h2>Match events</h2></div>{state === "in" && <span className="md-card-live-tag"><i/> LIVE</span>}</div>
                {timeline.length ? <ol className="md-match-event-list">{timeline.map((event) => (
                  <li key={event.id}><span className="md-match-event-minute">{event.clock?.displayValue || "—"}</span><span className="md-match-event-copy">{event.text || event.shortText || event.type?.text}</span></li>
                ))}</ol> : <p>{state === "pre" ? "Events will appear once play begins." : "Match events are unavailable."}</p>}
              </section>
              <section className="md-details-card md-match-stats-card">
                <div className="md-dashboard-card-heading"><div><span className="md-dashboard-eyebrow">THE NUMBERS</span><h2>Team statistics</h2></div><span className="md-stats-icon" aria-hidden="true">%</span></div>
                {stats.some(({ statistics }) => statistics?.length) ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {stats.map(({ team, statistics = [] }) => (
                      <div key={team.displayName} className="md-match-stat-team">
                        <h3>{team.displayName}</h3>
                        <dl>{statistics.map((stat) => <div key={stat.name}><dt>{stat.label || stat.name}</dt><dd>{stat.displayValue}</dd></div>)}</dl>
                      </div>
                    ))}
                  </div>
                ) : <p>Team statistics are unavailable.</p>}
              </section>
              <section className="md-details-card md-match-lineups-card">
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
              {!!commentary.length && <details className="md-details-card md-match-commentary-card">
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
