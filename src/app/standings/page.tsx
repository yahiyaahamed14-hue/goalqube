import Navbar from "@/components/Navbar";
import LeagueStandings from "@/components/LeagueStandings";

export default function StandingsPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          LIVE FOOTBALL TABLES
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          LEAGUE STANDINGS
        </h1>

      </section>

      <LeagueStandings />

    </main>
  );
}