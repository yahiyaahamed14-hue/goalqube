import Navbar from "@/components/Navbar";

const channels = [
  {
    name: "FIFA+",
    description:
      "Official FIFA content and highlights",
    link: "https://www.fifa.com/fifaplus",
  },
  {
    name: "JioHotstar",
    description:
      "World Cup streaming in India",
    link: "https://www.jiohotstar.com",
  },
  {
    name: "Sony LIV",
    description:
      "Football coverage and highlights",
    link: "https://www.sonyliv.com",
  },
];

export default function WorldCupWatchPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FIFA WORLD CUP 2026
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          WATCH WORLD CUP
        </h1>

      </section>

      <section className="px-6 lg:px-16 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {channels.map((channel) => (

            <div
              key={channel.name}
              className="bg-white/5 border border-white/10 rounded-[30px] p-8"
            >

              <h2 className="text-3xl font-black">
                {channel.name}
              </h2>

              <p className="text-zinc-400 mt-4">
                {channel.description}
              </p>

              <a
                href={channel.link}
                target="_blank"
                className="inline-block mt-6 bg-yellow-400 text-black px-6 py-3 rounded-full font-black"
              >
                ▶ OPEN
              </a>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}