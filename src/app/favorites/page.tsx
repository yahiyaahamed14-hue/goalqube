"use client";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";



import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import DreamTeamBuilder from "./DreamTeamBuilder";

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
    <main className="md-page md-inner-page min-h-screen">

      <Navbar />

      <section className="gq-favorite-hero">
        <span>FAN COMMUNITY · YOUR LINEUP</span>
        <h1>Favorite Team</h1>
        <p>Choose your formation. Pick your players. Make the pitch yours.</p>
      </section>

      <section className="gq-favorite-builder" aria-label="Create your dream team">
        <DreamTeamBuilder />
      </section>

      <section className="gq-favorite-clubs" aria-labelledby="favorite-clubs-title">
        <div className="gq-favorite-clubs-head">
          <div><span>BACK YOUR CLUB</span><h2 id="favorite-clubs-title">Favorite clubs</h2><p>Choose a club to show your support.</p></div>
          <label className="gq-favorite-search"><span className="sr-only">Search football clubs</span><input type="search" placeholder="Search clubs..." value={search} onChange={(event) => setSearch(event.target.value)} /><span>{filteredTeams.length} clubs</span></label>
        </div>
        <div className="gq-favorite-club-grid">
          {filteredTeams.map((team) => {
            const teamVotes = votes[team.idTeam] || 0;
            const percentage = totalVotes > 0 ? Number(((teamVotes / totalVotes) * 100).toFixed(1)) : 0;
            return (
              <article className="gq-favorite-club-card" key={team.idTeam}>
                <div className="gq-favorite-club-top"><span>FAN PICK</span><strong>{percentage}%</strong></div>
                <div className="gq-favorite-club-info"><span className="gq-favorite-crest"><img src={team.strBadge} alt="" loading="lazy" /></span><h3>{team.strTeam}</h3></div>
                <div className="gq-favorite-meter"><i style={{ width: `${percentage}%` }} /></div>
                <div className="gq-favorite-club-bottom"><span>{teamVotes} fans</span><button type="button" onClick={() => voteTeam(team.idTeam, team.strTeam)}>❤️ Vote</button></div>
              </article>
            );
          })}
          {!filteredTeams.length && <p className="gq-favorite-no-results">No clubs match that search.</p>}
        </div>
      </section>

    </main>
  );
}
