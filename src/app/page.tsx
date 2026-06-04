import Link from "next/link";

import Navbar from "@/components/Navbar";

export default function HomePage() {

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center px-6 lg:px-16 overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1508098682722-e99c643e7485?q=80&w=1800&auto=format&fit=crop"
            alt="football stadium"
            className="w-full h-full object-cover opacity-30"
          />

        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl">

          <p className="text-yellow-400 font-black tracking-[6px] text-lg">

            LIVE FOOTBALL STREAMING PLATFORM

          </p>

          <h1 className="text-7xl lg:text-[120px] font-black leading-none mt-8">

            WATCH
            <br />

            <span className="text-yellow-400">
              FOOTBALL
            </span>

            <br />

            LIVE.

          </h1>

          <p className="text-zinc-300 text-2xl leading-relaxed mt-10 max-w-3xl">

            Stream football matches, explore clubs,
            track trophies, follow live scores,
            and stay updated with football news.

          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-6 mt-14">

            <Link
              href="/watch"
              className="bg-yellow-400 text-black px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition"
            >

              ▶ WATCH LIVE

            </Link>

            <Link
              href="/matches"
              className="border border-white/20 px-10 py-5 rounded-full font-black text-lg hover:bg-white/10 transition"
            >

              VIEW MATCHES

            </Link>

          </div>

        </div>

      </section>

      {/* FEATURE CARDS */}
      <section className="px-6 lg:px-16 py-24">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {[
            {
              title: "LIVE MATCHES",
              link: "/watch",
            },

            {
              title: "FOOTBALL NEWS",
              link: "/news",
            },

            {
              title: "FAVORITE CLUBS",
              link: "/favorites",
            },

            {
              title: "TROPHIES",
              link: "/trophies",
            },
          ].map((item, index) => (

            <Link
              key={index}
              href={item.link}
              className="bg-white/5 border border-white/10 rounded-[35px] p-10 hover:bg-white/10 transition"
            >

              <h2 className="text-4xl font-black leading-tight">

                {item.title}

              </h2>

            </Link>

          ))}

        </div>

      </section>

      <section className="px-6 lg:px-16 py-12">

        <h2 className="text-4xl font-black mb-8">
          QUICK ACCESS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link
            href="/news"
            className="bg-white/5 p-8 rounded-3xl"
          >
            📰 Latest News
          </Link>

          <Link
            href="/standings"
            className="bg-white/5 p-8 rounded-3xl"
          >
            🏆 League Tables
          </Link>

          <Link
            href="/favorites"
            className="bg-white/5 p-8 rounded-3xl"
          >
            ❤️ Fan Votes
          </Link>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="px-6 lg:px-16 py-16 border-t border-white/10">

        <h2 className="text-4xl font-black">
          GOALQUBE
        </h2>

        <p className="text-zinc-400 text-lg mt-6">

          The ultimate football streaming &
          community experience.

        </p>

      </footer>

    </main>
  );
}