import Link from "next/link";
import { Suspense } from "react";
import PremierLeagueOverview from "@/components/PremierLeagueOverview";
import Navbar from "@/components/Navbar";
import LeagueStandings, { standingsLeagues } from "@/components/LeagueStandings";

export default async function StandingsPage({ searchParams }: {
  searchParams: Promise<{ league?: string }>;
}) {
  const { league } = await searchParams;
  const selected = typeof league === "string" && Object.hasOwn(standingsLeagues, league)
    ? league as keyof typeof standingsLeagues
    : "eng.1";

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      <section className="md-inner-content" aria-labelledby="standings-title">
        <h1 id="standings-title" className="text-5xl font-black sm:text-7xl">League Standings</h1>
        <nav className="md-match-filters" aria-label="Competition">
          {Object.entries(standingsLeagues).map(([code, name]) => (
            <Link key={code} href={`/standings?league=${code}`} aria-current={selected === code ? "page" : undefined}>{name}</Link>
          ))}
        </nav>
        {selected === "eng.1" && (
          <nav className="md-match-tabs" aria-label="Premier League overview">
            <a href="#league-table">League table</a>
            <a href="#player-leaders">Top scorers and assists</a>
            <a href="#league-matches">Results and fixtures</a>
          </nav>
        )}
        <div id="league-table" className="scroll-mt-5">
          <LeagueStandings league={selected} />
        </div>
        {selected === "eng.1" && (
          <Suspense fallback={<p className="mt-6 text-zinc-400">Loading Premier League stats and fixtures…</p>}>
            <PremierLeagueOverview />
          </Suspense>
        )}
      </section>
    </main>
  );
}
