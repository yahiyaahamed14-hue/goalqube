"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";

export default function SearchPage() {

  const [query, setQuery] = useState("");
const teams = [
  {
    name: "Real Madrid",
    league: "La Liga",
  },
  {
    name: "Barcelona",
    league: "La Liga",
  },
  {
    name: "Manchester City",
    league: "Premier League",
  },
  {
    name: "Liverpool",
    league: "Premier League",
  },
  {
    name: "Arsenal",
    league: "Premier League",
  },
  {
    name: "Chelsea",
    league: "Premier League",
  },
];

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(query.toLowerCase())
);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FOOTBALL SEARCH
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          SEARCH CLUBS
        </h1>

      </section>

      {/* Search */}
      <section className="px-6 lg:px-16">

        <div className="bg-white/5 border border-white/10 rounded-[30px] p-6">

          <input
            type="text"
            placeholder="Search football clubs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-2xl text-white placeholder:text-zinc-500"
          />

        </div>

      </section>

      {/* Results */}
      <section className="px-6 lg:px-16 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredTeams.map((team, index) => (

            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[30px] p-8 hover:bg-white/10 transition"
            >

              <h2 className="text-3xl font-black">
                {team.name}
              </h2>

              <p className="text-zinc-400 mt-3">
                {team.league}
              </p>
            </div>

          ))}

        </div>

      </section>

    </main>
  );
}