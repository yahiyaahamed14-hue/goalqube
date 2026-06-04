"use client";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";



import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";

type Team = {
  idTeam: string;
  strTeam: string;
  strBadge: string;
};

export default function FavoritesPage() {

  const [teams, setTeams] = useState<Team[]>([]);

  const [votes, setVotes] = useState<{
    [key: string]: number;
  }>({});

  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    async function fetchTeams() {

      const response = await fetch(
        "/api/teams"
      );

      const data = await response.json();

      setTeams(data);

      const loadedVotes: {
        [key: string]: number;
      } = {};

      for (const team of data) {

        const ref = doc(
          db,
          "votes",
           team.idTeam
        );

        const snap = await getDoc(ref);

        loadedVotes[team.idTeam] =
          snap.exists()
            ? snap.data().count || 0
            : 0;
      }

      setVotes(loadedVotes);
    }

    fetchTeams();

  }, []);

  const voteTeam = async (
    id: string,
    teamName: string
  ) => {

    if (!userId) {
      alert("Please login first");
      return;
    }

    const userVoteRef = doc(
      db,
      "userVotes",
      userId
    );

    const userVoteSnap =
      await getDoc(userVoteRef);

    if (userVoteSnap.exists()) {

      alert(
        `You already selected ${userVoteSnap.data().teamName} as your favorite club`
      );

      return;
    }

    const voteRef = doc(
      db,
      "votes",
      id
    );

    const voteSnap =
      await getDoc(voteRef);

    let currentVotes = 0;

    if (voteSnap.exists()) {
      currentVotes =
        voteSnap.data().count || 0;
    }

    const newVotes =
      currentVotes + 1;

    await setDoc(voteRef, {
      count: newVotes,
    });

    await setDoc(userVoteRef, {
      teamId: id,
      teamName,
      userId,
    });

    setVotes((prev) => ({
      ...prev,
      [id]: newVotes,
    }));

    alert(
      `${teamName} selected as your favorite club`
    );
  };

  const filteredTeams = teams.filter((team) =>
    team.strTeam
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalVotes = Object.values(votes)
    .reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Header */}
      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FAN COMMUNITY
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          FAVORITE TEAMS
        </h1>

      </section>

      {/* Search */}
      <section className="px-6 lg:px-16">

        <div className="bg-white/5 border border-white/10 rounded-[30px] p-6">

          <input
            type="text"
            placeholder="Search football clubs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-transparent outline-none text-2xl text-white placeholder:text-zinc-500"
          />

        </div>

      </section>

      {/* Teams */}
      <section className="px-6 lg:px-16 py-16">

        <div className="space-y-8">

          {filteredTeams.map((team) => {

            const teamVotes =
              votes[team.idTeam] || 0;

            const percentage =
              totalVotes > 0
                ? (
                    (teamVotes / totalVotes) *
                    100
                  ).toFixed(1)
                : 0;

            return (

              <div
                key={team.idTeam}
                className="bg-white/5 border border-white/10 rounded-[30px] p-8"
              >

                {/* Top */}
                <div className="flex items-center justify-between gap-6">

                  <div className="flex items-center gap-5">

                    <img
                      src={team.strBadge}
                      alt={team.strTeam}
                      className="w-20 h-20 object-contain"
                    />

                    <h2 className="text-3xl font-black">
                      {team.strTeam}
                    </h2>

                  </div>

                  <p className="text-yellow-400 font-black text-2xl">
                    {percentage}%
                  </p>

                </div>

                {/* Progress */}
                <div className="w-full h-5 bg-white/10 rounded-full mt-6 overflow-hidden">

                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between mt-6">

                  <p className="text-zinc-400">
                    {teamVotes} Fans
                  </p>

                  <button
                    onClick={() =>
                      voteTeam(
                        team.idTeam,
                        team.strTeam
                      )
                    }
                    className="bg-yellow-400 text-black px-6 py-3 rounded-full font-black hover:scale-105 transition"
                  >

                    ❤️ Vote

                  </button>

                </div>

              </div>

            );
          })}

        </div>

      </section>

    </main>
  );
}