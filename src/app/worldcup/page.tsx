"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";



export default function WorldCupPage() {
  const worldCupDate = new Date("2026-06-11T00:00:00");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();

      const distance =
        worldCupDate.getTime() - now;

      setTimeLeft({
        days: Math.ceil(
          distance / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
        ),
        
        minutes: Math.floor(
          (distance % (1000 * 60 * 60)) /
          (1000 * 60)
        ),
        seconds: Math.floor(
          (distance % (1000 * 60)) / 1000
        ),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Hero */}
      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FIFA WORLD CUP 2026
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          WORLD CUP HUB
        </h1>

        <p className="text-zinc-400 text-xl mt-6">
          USA 🇺🇸 • Canada 🇨🇦 • Mexico 🇲🇽
        </p>

      </section>

      {/* Countdown */}
      <section className="px-6 lg:px-16 pb-12">

        <div className="bg-yellow-400 text-black rounded-[30px] p-8 text-center">

          <p className="font-bold tracking-[4px]">
            WORLD CUP COUNTDOWN
          </p>

          <h2 className="text-6xl font-black mt-4">
            {timeLeft.days}
          </h2>

          <p className="text-xl font-bold mt-2">
            Days Remaining
          </p>

          <p className="text-lg font-semibold mt-4">
            {timeLeft.hours} Hours • {timeLeft.minutes} Minutes • {timeLeft.seconds} Seconds
          </p>

        </div>

      </section>

      {/* Host Nations */}
      <section className="px-6 lg:px-16 pb-12">

        <div className="bg-white/5 border border-white/10 rounded-[30px] p-8">

          <h2 className="text-3xl font-black">
            🌍 Host Nations
          </h2>

          <p className="text-zinc-400 mt-4">
            United States, Canada and Mexico
            will host the FIFA World Cup 2026.
          </p>

        </div>

      </section>

      {/* Navigation Cards */}
      <section className="px-6 lg:px-16 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          

          <Link
            href="/worldcup/fixtures"
            className="bg-white/5 border border-white/10 rounded-[30px] p-10 hover:bg-white/10 transition"
          >
            <h2 className="text-3xl font-black">
              📅 Fixtures
            </h2>

            <p className="text-zinc-400 mt-4">
              View World Cup schedule.
            </p>
          </Link>

          <Link
            href="/worldcup/predictions"
            className="bg-white/5 border border-white/10 rounded-[30px] p-10 hover:bg-white/10 transition"
          >
            <h2 className="text-3xl font-black">
              ❤️ Fan Prediction
            </h2>

            <p className="text-zinc-400 mt-4">
              Predict the World Cup winner.
            </p>
          </Link>

          <Link
            href="/worldcup/news"
            className="bg-white/5 border border-white/10 rounded-[30px] p-10 hover:bg-white/10 transition"
          >
            <h2 className="text-3xl font-black">
              📰 World Cup News
            </h2>

            <p className="text-zinc-400 mt-4">
              Latest World Cup updates.
            </p>
          </Link>

          <Link
            href="/worldcup/cities"
            className="bg-white/5 border border-white/10 rounded-[30px] p-10 hover:bg-white/10 transition"
          >
            <h2 className="text-3xl font-black">
              🏟 Host Cities
            </h2>

            <p className="text-zinc-400 mt-4">
              World Cup 2026 host cities & stadiums.
            </p>
          </Link>

          <Link
            href="/matches"
            className="bg-white/5 border border-white/10 rounded-[30px] p-10 hover:bg-white/10 transition"
          >
            <h2 className="text-3xl font-black">
              ⚽ Match Live Scores
            </h2>

            <p className="text-zinc-400 mt-4">
              View live scores, match statistics and real-time updates.
            </p>
          </Link>

          


        </div>

      </section>

    </main>
  );
}