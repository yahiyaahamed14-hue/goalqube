import Navbar from "@/components/Navbar";

import { getRealFootballNews } from "../services/footballApi";

export default async function NewsPage() {

  const news = await getRealFootballNews();

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Header */}
      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          LIVE FOOTBALL NEWS
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          BREAKING HEADLINES
        </h1>

      </section>

      {/* News Grid */}
      <section className="px-6 lg:px-16 pb-24">

        {Array.isArray(news) && news.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {news.map((item: any, index: number) => (

              <a
                key={index}
                href={item.link}
                target="_blank"
                className="group overflow-hidden rounded-[35px] border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >

                {/* Image */}
                <img
                  src={
                   item.images?.[0]?.url ||
                   "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={item.title}
                  className="w-full h-[320px] object-cover group-hover:scale-110 transition duration-700"
                />

                {/* Content */}
                <div className="p-8">

                  <p className="text-yellow-400 font-bold">
                    {item.source_id || "Football News"}
                  </p>

                  <h2 className="text-3xl font-black mt-4 leading-tight">
                    {item.title}
                  </h2>

                  <p className="text-sm text-zinc-500 mt-2">
                    ESPN Football
                  </p>

                  <p className="text-zinc-400 mt-6 line-clamp-3">
                    {item.description || "Latest football updates and breaking headlines."}
                  </p>

                </div>

                <div className="mt-6">

                  <span className="text-yellow-400 font-bold">
                    Read More →
                  </span>
  
                </div>

              </a>

            ))}

          </div>

        ) : (

          <div className="text-zinc-400 text-2xl">
            Loading football news...
          </div>

        )}

      </section>

    </main>
  );
}