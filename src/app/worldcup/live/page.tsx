import Navbar from "@/components/Navbar";
import { getWorldCupMatches } from "@/app/services/footballApi";

export default async function WorldCupLivePage() {

  const matches = await getWorldCupMatches();

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FIFA WORLD CUP 2026
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          WORLD CUP MATCHES
        </h1>

      </section>

      <section className="px-6 lg:px-16 pb-24">

        {matches.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {matches.map((match: any) => (

              <div
                key={match.idEvent}
                className="bg-white/5 border border-white/10 rounded-[35px] p-8"
              >

                <p className="text-yellow-400 font-bold">
                  {match.strLeague}
                </p>

                <h2 className="text-3xl font-black mt-6">
                  {match.strHomeTeam}
                </h2>

                <h2 className="text-3xl font-black mt-2">
                  {match.strAwayTeam}
                </h2>

                <p className="text-zinc-400 mt-6">
                  {match.dateEvent}
                </p>

                <p className="text-zinc-400">
                  {match.strVenue}
                </p>

              </div>

            ))}

          </div>

        ) : (

          <div className="bg-white/5 border border-white/10 rounded-[35px] p-10">

            <h2 className="text-3xl font-black">
              World Cup Live Center
            </h2>

            <p className="text-zinc-400 mt-4">
              Live scores, match statistics and official streaming links will appear here when FIFA World Cup 2026 begins.
            </p>

            <p className="text-zinc-400 mt-4">
              Fixtures will appear here when available.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}

