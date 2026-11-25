"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search, Users } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { leagues, type League } from "@/app/services/matchCentre";

type Player = {
  id: string;
  name: string;
  position: string;
  nationality: string;
  jersey?: string;
  photo?: string;
  team: string;
  teamId: string;
  teamLogo?: string;
  leagues: string[];
  leagueCodes: League[];
};
type Feed = { players?: Player[]; teamCount?: number };
const leagueFilters: { id: "all" | League; label: string }[] = [
  { id: "all", label: "All leagues" },
  ...Object.entries(leagues).map(([id, label]) => ({ id: id as League, label })),
];
const positions = ["All positions", "Goalkeeper", "Defender", "Midfielder", "Forward"];
const dreamTeamKey = "goalqube-dream-team-v1";
const pageSize = 72;

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function PlayerPortrait({ player }: { player: Player }) {
  const [photo, setPhoto] = useState(player.photo ?? "");
  const [fallbackTried, setFallbackTried] = useState(false);

  useEffect(() => {
    setPhoto(player.photo ?? "");
    setFallbackTried(false);
  }, [player.id, player.photo]);

  async function loadAlternatePhoto() {
    if (fallbackTried) return;
    setFallbackTried(true);
    const league = player.leagueCodes?.[0] ?? "eng.1";
    try {
      const params = new URLSearchParams({ league, teamId: player.teamId, team: player.team, name: player.name });
      const response = await fetch(`/api/players/photo?${params.toString()}`);
      if (!response.ok) return;
      const data = await response.json() as { photo?: string | null };
      if (data.photo) setPhoto(data.photo);
    } catch { /* Keep the initials visible if an alternate portrait is unavailable. */ }
  }

  return (
    <div className="relative flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#f5e6e9] to-[#edf0e9] text-sm font-black text-[#9c1f3a]">
      <span>{initials(player.name)}</span>
      {photo && <img src={photo} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover" onError={() => { setPhoto(""); if (!fallbackTried) void loadAlternatePhoto(); }} />}
    </div>
  );
}

export default function PlayersPage() {
  const [league, setLeague] = useState<"all" | League>("all");
  const [position, setPosition] = useState("All positions");
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/players?league=${league}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Player list is unavailable right now.");
        return response.json() as Promise<Feed>;
      })
      .then((data) => setPlayers(data.players ?? []))
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Could not load players.");
        setPlayers([]);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [league]);

  useEffect(() => { setVisibleCount(pageSize); }, [league, position, search]);

  const filteredPlayers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return players.filter((player) => {
      const inPosition = position === "All positions" || player.position.toLowerCase().includes(position.toLowerCase());
      const searchable = `${player.name} ${player.nationality} ${player.position} ${player.team}`.toLowerCase();
      return inPosition && (!query || searchable.includes(query));
    });
  }, [players, position, search]);

  function addToDreamTeam(player: Player) {
    try {
      const saved = localStorage.getItem(dreamTeamKey);
      const team = saved ? JSON.parse(saved) as { formation?: string; players?: string[] } : {};
      const lineup = Array.from({ length: 11 }, (_, index) => team.players?.[index] ?? "");
      const emptySlot = lineup.findIndex((name) => !name.trim());
      if (emptySlot === -1) {
        setNotice("Your Dream Team is full. Clear a slot before adding another player.");
        return;
      }
      lineup[emptySlot] = player.name;
      localStorage.setItem(dreamTeamKey, JSON.stringify({ formation: team.formation ?? "4-3-3", players: lineup }));
      setNotice(`${player.name} added to your Dream Team.`);
    } catch {
      setNotice("Could not save this player on this device. Please try again.");
    }
  }

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />

      <section className="px-6 py-12 lg:px-16 lg:py-14">
        <p className="text-yellow-400 font-bold tracking-[5px]">THE PLAYER DIRECTORY</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-5xl font-black lg:text-7xl">PLAYERS</h1>
            <p className="mt-3 max-w-xl text-lg text-zinc-500">Browse the squads across your leagues, or find a player by name, team, or position.</p>
          </div>
          <Link href="/favorites" className="inline-flex items-center gap-3 rounded-full bg-yellow-400 px-5 py-3 font-bold text-black transition hover:brightness-95">
            <Users size={17} /> Dream Team <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="px-6 lg:px-16" aria-label="Search and filter players">
        <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm sm:px-5">
          <Search size={19} className="shrink-0 text-zinc-500" />
          <span className="sr-only">Search players</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search player, team, country, or position" className="w-full bg-transparent text-base outline-none placeholder:text-zinc-400" />
          <span className="shrink-0 text-sm text-zinc-500">{loading ? "Loading" : `${filteredPlayers.length} players`}</span>
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Filter by league">
          {leagueFilters.map((item) => (
            <button key={item.id} type="button" onClick={() => setLeague(item.id)} aria-pressed={league === item.id} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${league === item.id ? "border-[#9c1f3a] bg-[#9c1f3a] text-white" : "border-black/10 bg-white text-zinc-700 hover:border-[#9c1f3a]"}`}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-zinc-600">
            Position
            <select value={position} onChange={(event) => setPosition(event.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-800">
              {positions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <span className="text-sm text-zinc-500">Player cards are compact; all loaded players are searchable.</span>
        </div>
        {notice && <p role="status" className="mt-4 rounded-xl border border-[#e7e9e2] bg-white px-4 py-3 text-sm">{notice}</p>}
      </section>

      <section className="px-6 py-8 lg:px-16 lg:py-10" aria-label="Players">
        {loading ? (
          <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-zinc-500">Loading league squads…</div>
        ) : error ? (
          <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
            <h2 className="text-xl font-bold">Player squads could not load</h2>
            <p className="mt-2 text-zinc-500">{error}</p>
          </div>
        ) : filteredPlayers.length ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredPlayers.slice(0, visibleCount).map((player) => (
                <article key={`${player.id}-${player.team}`} className="flex min-w-0 items-center gap-4 rounded-2xl border border-black/10 bg-white p-3 shadow-sm transition hover:border-[#9c1f3a]/40 hover:shadow-md">
                  <PlayerPortrait player={player} />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[15px] font-bold leading-tight" title={player.name}>{player.name}</h2>
                    <p className="mt-1 truncate text-xs text-zinc-500" title={`${player.team} · ${player.position}`}>{player.team} · {player.position}{player.jersey ? ` · #${player.jersey}` : ""}</p>
                    <button type="button" onClick={() => addToDreamTeam(player)} className="mt-1 text-xs font-bold text-[#9c1f3a] hover:underline">Add to Dream Team</button>
                  </div>
                  {player.teamLogo && <img src={player.teamLogo} alt={`${player.team} logo`} loading="lazy" className="h-6 w-6 shrink-0 object-contain" />}
                </article>
              ))}
            </div>
            {visibleCount < filteredPlayers.length && (
              <div className="mt-7 text-center">
                <button type="button" onClick={() => setVisibleCount((count) => count + pageSize)} className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-bold transition hover:border-[#9c1f3a] hover:text-[#9c1f3a]">
                  Show more players ({filteredPlayers.length - visibleCount} left)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
            <h2 className="text-xl font-bold">No players found</h2>
            <p className="mt-2 text-zinc-500">Try another search or league.</p>
          </div>
        )}
      </section>
    </main>
  );
}
