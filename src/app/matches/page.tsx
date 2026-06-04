import AutoRefresh from "@/components/AutoRefresh";

import Navbar from "@/components/Navbar";

import { getLiveMatches } from "../services/footballApi";

export default async function MatchesPage() {

  const matches = await getLiveMatches();

  return (
    <main className="min-h-screen bg-black text-white">

      <AutoRefresh />

      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FOOTBALL MATCHES
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          LATEST MATCHES
        </h1>

      </section>

      {/* Matches */}
      <section className="px-6 lg:px-16 pb-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {matches.slice(0, 10).map((match: any) => (

            <div
              key={match.idEvent}
              className="bg-white/5 border border-white/10 rounded-[30px] p-8"
            >

              {/* League */}
              <p className="text-yellow-400 font-bold">
                {match.strLeague}
              </p>

              {/* Teams */}
              <div className="mt-8">

                <h2 className="text-3xl font-black">
                  {match.strHomeTeam}
                </h2>

                <h2 className="text-3xl font-black mt-4">
                  {match.strAwayTeam}
                </h2>

              </div>

              {/* Score */}
              <div className="mt-8">

                <h1 className="text-5xl font-black text-yellow-400">

                  {match.intHomeScore ?? 0}
                  {" : "}
                  {match.intAwayScore ?? 0}

                </h1>

              </div>

              {/* Date */}
              <p className="mt-6 text-zinc-400">
                {match.dateEvent}
              </p>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}