"use client";

import { useEffect, useState } from "react";

const leagues = [
  {
    name: "Premier League",
    id: "4328",
  },
  {
    name: "La Liga",
    id: "4335",
  },
  {
    name: "Bundesliga",
    id: "4331",
  },
  {
    name: "Serie A",
    id: "4332",
  },
  {
    name: "Ligue 1",
    id: "4334",
  },
];

export default function LeagueStandings() {

  const [leagueId, setLeagueId] =
    useState("4328");

  const [table, setTable] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadTable() {

      setLoading(true);

      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${leagueId}&s=2025-2026`
      );

      const data = await response.json();
      console.log(data);
      console.log(data.table?.length);

      setTable(
        data.table ||
        data.league ||
        []
      );
      console.log(
        "Teams Loaded:", 
        (data.table || data.league || []).length
      );

      setLoading(false);
    }

    loadTable();

  }, [leagueId]);

  return (

    <section className="px-6 lg:px-16 pb-24">

      {/* League Selector */}
      <div className="mb-8">

        <select
          value={leagueId}
          onChange={(e) =>
            setLeagueId(e.target.value)
          }
          className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3"
        >

          {leagues.map((league) => (

            <option
              key={league.id}
              value={league.id}
            >
              {league.name}
            </option>

          ))}

        </select>

      </div>

      {loading ? (

        <p className="text-zinc-400">
          Loading standings...
        </p>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-white/10">

                <th className="py-4 text-left">
                  POS
                </th>

                <th className="py-4 text-left">
                  TEAM
                </th>

                <th className="py-4 text-left">
                  PTS
                </th>

                <th className="py-4 text-left">
                  PLAYED
                </th>

                <th className="py-4 text-left">
                  W
                </th>

                <th className="py-4 text-left">
                  D
                </th>

                <th className="py-4 text-left">
                  L
                </th>

              </tr>

            </thead>

            <tbody>

              {table.map((team: any) => (

                <tr
                  key={team.idTeam}
                  className="border-b border-white/5"
                >

                  <td className="py-4">
                    {team.intRank}
                  </td>

                  <td className="py-4 font-bold">
                    {team.strTeam}
                  </td>

                  <td className="py-4 text-yellow-400 font-bold">
                    {team.intPoints}
                  </td>

                  <td className="py-4">
                    {team.intPlayed}
                  </td>

                  <td className="py-4">
                    {team.intWin}
                  </td>

                  <td className="py-4">
                    {team.intDraw}
                  </td>

                  <td className="py-4">
                    {team.intLoss}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}