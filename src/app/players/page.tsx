import Navbar from "@/components/Navbar";

const players = [
  {
    name: "Lionel Messi",
    club: "Inter Miami",
    country: "Argentina",
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Cristiano Ronaldo",
    club: "Al Nassr",
    country: "Portugal",
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Kylian Mbappé",
    club: "Real Madrid",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Erling Haaland",
    club: "Manchester City",
    country: "Norway",
    image:
      "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function PlayersPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Header */}
      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FOOTBALL PLAYERS
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          STAR PLAYERS
        </h1>

      </section>

      {/* Player Cards */}
      <section className="px-6 lg:px-16 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {players.map((player, index) => (

            <div
              key={index}
              className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >

              <img
                src={player.image}
                alt={player.name}
                className="w-full h-[350px] object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-black">
                  {player.name}
                </h2>

                <p className="text-yellow-400 font-bold mt-3">
                  {player.club}
                </p>

                <p className="text-zinc-400 mt-1">
                  {player.country}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}