import { Suspense } from "react";
import PremierLeagueOverview from "@/components/PremierLeagueOverview";
import Navbar from "@/components/Navbar";
import LeagueStandings from "@/components/LeagueStandings";
import StandingsLeaguePicker from "@/components/StandingsLeaguePicker";
import StandingsSeasonPicker from "@/components/StandingsSeasonPicker";
import { standingsFirstSeason, standingsLeagues, type StandingsLeague } from "@/app/services/standings";

export default async function StandingsPage({ searchParams }: {
  searchParams: Promise<{ league?: string; season?: string }>;
}) {
  const { league, season } = await searchParams;
  const selected = typeof league === "string" && Object.hasOwn(standingsLeagues, league)
    ? league as StandingsLeague
    : "eng.1";
  const currentYear = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Calcutta", year: "numeric" }).format(new Date()));
  const requestedSeason = typeof season === "string" ? Number(season) : currentYear;
  const seasonYear = Number.isInteger(requestedSeason) && requestedSeason >= standingsFirstSeason[selected] && requestedSeason <= currentYear
    ? requestedSeason
    : currentYear;
  const isCurrentSeason = seasonYear === currentYear;

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      <section className="md-inner-content" aria-labelledby="standings-title">
        <h1 id="standings-title" className="text-5xl font-black sm:text-7xl">League Standings</h1>
        <div className="md-standings-controls">
          <StandingsLeaguePicker selected={selected} />
          <StandingsSeasonPicker league={selected} selected={seasonYear} currentYear={currentYear} />
        </div>
        {selected === "eng.1" && isCurrentSeason && (
          <nav className="md-match-tabs" aria-label="Premier League overview">
            <a href="#league-table">League table</a>
            <a href="#player-leaders">Top scorers and assists</a>
            <a href="#league-matches">Results and fixtures</a>
          </nav>
        )}
        <div id="league-table" className="scroll-mt-5">
          <LeagueStandings league={selected} season={seasonYear} />
        </div>
        {selected === "eng.1" && isCurrentSeason && (
          <Suspense fallback={<p className="mt-6 text-zinc-400">Loading Premier League stats and fixtures…</p>}>
            <PremierLeagueOverview />
          </Suspense>
        )}
      </section>
    </main>
  );
}
