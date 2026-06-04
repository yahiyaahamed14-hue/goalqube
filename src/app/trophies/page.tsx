import Navbar from "@/components/Navbar";

const trophies = [
  {
    title: "UEFA Champions League",
    winner: "Real Madrid",
    count: "15 Titles",
    image:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "FIFA World Cup",
    winner: "Argentina",
    count: "3 Titles",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Ballon d'Or",
    winner: "Lionel Messi",
    count: "8 Awards",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Premier League",
    winner: "Manchester United",
    count: "20 Titles",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c643e7485?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function TrophiesPage() {

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Header */}
      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FOOTBALL HISTORY
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          TROPHIES & LEGENDS
        </h1>

      </section>

      {/* Trophy Cards */}
      <section className="px-6 lg:px-16 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {trophies.map((item, index) => (

            <div
              key={index}
              className="overflow-hidden rounded-[35px] border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >

              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[320px] object-cover"
              />

              <div className="p-8">

                <p className="text-yellow-400 font-bold">
                  {item.title}
                </p>

                <h2 className="text-4xl font-black mt-4">
                  {item.winner}
                </h2>

                <p className="text-zinc-400 text-xl mt-4">
                  {item.count}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}