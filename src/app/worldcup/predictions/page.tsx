"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function PredictionsPage() {

  const [selected, setSelected] =
    useState("");

  const teams = [
    "Argentina",
    "Brazil",
    "France",
    "England",
    "Spain",
    "Portugal",
    "Germany",
    "Czechia",
    "Mexico",
    "South Africa",
    "South Korea",
    "Bosnia and Herzegovina",
    "Canada (Co-Host)",
    "Qatar",
    "Switzerland",

  ];

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FAN PREDICTION
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          WHO WILL WIN?
        </h1>

      </section>

      <section className="px-6 lg:px-16 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {teams.map((team) => (

            <button
              key={team}
              onClick={() =>
                setSelected(team)
              }
              className={`p-8 rounded-[30px] border transition text-2xl font-black
              ${
                selected === team
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              {team}
            </button>

          ))}

        </div>

        {selected && (

          <div className="mt-12 bg-yellow-400 text-black rounded-[30px] p-8 text-center">

            <h2 className="text-3xl font-black">

              🏆 Your Prediction

            </h2>

            <p className="text-2xl mt-4 font-bold">

              {selected}

            </p>

          </div>

        )}

      </section>

    </main>
  );
}