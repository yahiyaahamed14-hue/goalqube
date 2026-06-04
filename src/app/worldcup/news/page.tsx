import Navbar from "@/components/Navbar";

const news = [
  {
    title: "Argentina prepare for World Cup 2026",
    source: "FIFA",
  },
  {
    title: "Brazil announce preliminary squad",
    source: "ESPN",
  },
  {
    title: "France among tournament favourites",
    source: "BBC Sport",
  },
  {
    title: "USA ready to host World Cup matches",
    source: "FIFA",
  },
];

export default function WorldCupNewsPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FIFA WORLD CUP 2026
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          WORLD CUP NEWS
        </h1>

      </section>

      <section className="px-6 lg:px-16 pb-24">

        <div className="space-y-6">

          {news.map((item, index) => (

            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[30px] p-8"
            >

              <p className="text-yellow-400 font-bold">
                {item.source}
              </p>

              <h2 className="text-3xl font-black mt-3">
                {item.title}
              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}