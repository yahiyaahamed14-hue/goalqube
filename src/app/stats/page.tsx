import Navbar from "@/components/Navbar";

const stats = [
  {
    title: "TOTAL CLUBS",
    value: "120+",
  },

  {
    title: "TOTAL FAN VOTES",
    value: "25K+",
  },

  {
    title: "TOP CLUB",
    value: "Real Madrid",
  },

  {
    title: "MOST ACTIVE LEAGUE",
    value: "Premier League",
  },
];

export default function StatsPage() {

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Header */}
      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FOOTBALL ANALYTICS
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          GOALQUBE STATS
        </h1>

      </section>

      {/* Stats Grid */}
      <section className="px-6 lg:px-16 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {stats.map((item, index) => (

            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[35px] p-10 hover:bg-white/10 transition"
            >

              <p className="text-yellow-400 font-bold text-lg">
                {item.title}
              </p>

              <h2 className="text-5xl font-black mt-6">
                {item.value}
              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}