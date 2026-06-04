import Navbar from "@/components/Navbar";
import {
  getLiveMatches,
  getTodayMatches,
} from "@/app/services/footballApi";

export default async function WatchPage() {

  const liveMatches = await getLiveMatches();
  const todayMatches = await getTodayMatches();

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Header */}
      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          GOALQUBE WATCH CENTER
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          WATCH FOOTBALL
        </h1>

      </section>

      {/* Recent Matches */}
      <section className="px-6 lg:px-16 pb-16">

        <h2 className="text-4xl font-black mb-8">
          🔴 RECENT MATCHES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {liveMatches.slice(0, 6).map((match: any) => (

            <div
              key={match.idEvent}
              className="bg-white/5 border border-white/10 rounded-[35px] p-8"
            >

              <p className="text-yellow-400 font-bold">
                {match.strLeague}
              </p>

              <h2 className="text-3xl font-black mt-6">

                {match.strHomeTeam}

                <span className="text-yellow-400">
                  {" "}vs{" "}
                </span>

                {match.strAwayTeam}

              </h2>

              <p className="text-zinc-400 mt-4">
                {match.dateEvent}
              </p>

              <div className="mt-8">

                <p className="text-green-400 font-bold mb-4">
                  📺 Official Broadcaster
                </p>

                <a
                  href="https://www.jiohotstar.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-full font-black hover:scale-105 transition"
                >
                  WATCH NOW
                </a>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Today's Matches */}
      <section className="px-6 lg:px-16 pb-24">

        <h2 className="text-4xl font-black mb-8">
          📅 TODAY'S MATCHES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {todayMatches.slice(0, 8).map((match: any) => (

            <div
              key={match.idEvent}
              className="bg-white/5 border border-white/10 rounded-[35px] p-8"
            >

              <p className="text-yellow-400 font-bold">
                {match.strLeague}
              </p>

              <h2 className="text-3xl font-black mt-6">

                {match.strHomeTeam}

                <span className="text-yellow-400">
                  {" "}vs{" "}
                </span>

                {match.strAwayTeam}

              </h2>

              <p className="text-zinc-400 mt-4">
                {match.dateEvent}
              </p>

              <div className="mt-8">

                <p className="text-green-400 font-bold mb-4">
                  📺 Official Broadcaster
                </p>

                <a
                  href="https://www.jiohotstar.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-full font-black hover:scale-105 transition"
                >
                  WATCH NOW
                </a>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}