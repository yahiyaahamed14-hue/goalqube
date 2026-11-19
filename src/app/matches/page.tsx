import Link from "next/link";
import AutoRefresh from "@/components/AutoRefresh";
import Navbar from "@/components/Navbar";
import MatchLeagueSelect from "@/components/MatchLeagueSelect";
import MatchClub from "@/components/MatchClub";
import { getMatchListing, isLeague, kickoff, leagues, matchScore, matchTeams, type MatchView } from "../services/matchCentre";

const views = [
  ["previous", "Previous Matches"],
  ["live", "Live Matches"],
  ["upcoming", "Upcoming Matches"],
] as const;

export default async function MatchesPage({ searchParams }: {
  searchParams: Promise<{ view?: string; league?: string }>;
}) {
  const query = await searchParams;
  const view: MatchView = views.find(([value]) => value === query.view)?.[0] ?? "previous";
  const league = typeof query.league === "string" && isLeague(query.league) ? query.league : undefined;
  const selected = league ? [league] : Object.keys(leagues).filter(isLeague);
  const feeds = await Promise.all(selected.map((competition) => getMatchListing(competition, view)));
  const matches = feeds.flatMap((feed) => feed.matches).sort((a, b) =>
    (view === "upcoming" ? 1 : -1) * (Date.parse(a.match.date) - Date.parse(b.match.date))
  );
  const incomplete = feeds.some((feed) => feed.incomplete);
  const href = (tab: MatchView, competition?: string) => `/matches?view=${tab}${competition ? `&league=${competition}` : ""}`;

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      {view === "live" && <AutoRefresh intervalMs={30000} />}
      <section className="md-inner-content" aria-labelledby="matches-title">
        <h1 id="matches-title" className="text-5xl font-black sm:text-7xl">Match Centre</h1>
        <nav className="md-match-tabs" aria-label="Match status">
          {views.map(([value, label]) => (
            <Link key={value} href={href(value, league)} aria-current={value === view ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <MatchLeagueSelect view={view} league={league} options={Object.entries(leagues)} />
        {incomplete && <p role="status" className="mt-4 text-sm text-zinc-400">Some match data is temporarily unavailable.</p>}
        {matches.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-400">
            {incomplete ? "No matches could be loaded for this view." : `No ${view} matches in this view.`}
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 lg:grid-cols-2">
            {matches.map(({ id, league, match }) => {
              const { home, away } = matchTeams(match);
              return (
                <li key={id} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
                  <p className="text-sm font-bold text-yellow-400">{leagues[league]}</p>
                  <h2 className="mt-3 text-xl font-bold">
                    <Link className="md-match-detail-link" href={`/match/${id}?league=${league}`}>
                      <span className="md-match-pair"><MatchClub team={home?.team} /><span className="md-match-versus">vs</span><MatchClub team={away?.team} /></span>
                    </Link>
                  </h2>
                  <p className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    {matchScore(match) && view !== "upcoming" && <strong className="md-score">{matchScore(match)}</strong>}
                    {view === "live"
                      ? <strong className="text-yellow-400">Live · {match.status.type.shortDetail || match.status.displayClock || "Minute unavailable"}</strong>
                      : <time dateTime={match.date}>{kickoff(match)}</time>}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
