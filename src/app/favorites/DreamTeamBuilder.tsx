"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, Check, LoaderCircle, Plus, RotateCcw, Save, Search, Shield, Users, X } from "lucide-react";
import { leagues, type League } from "@/app/services/matchCentre";

type Formation = "4-3-3" | "4-4-2" | "3-5-2";
type Slot = { role: string; x: number; y: number };
type DirectoryPlayer = {
  id: string; name: string; position: string; nationality: string; jersey?: string;
  photo?: string; team: string; teamId: string; teamLogo?: string; leagues: string[]; leagueCodes: League[];
};
type SavedDreamTeam = { formation: Formation; players: string[]; name?: string };

const storageKey = "goalqube-dream-team-v1";
const formations: Record<Formation, Slot[]> = {
  "4-3-3": [
    { role: "GK", x: 50, y: 88 },
    { role: "LB", x: 17, y: 70 }, { role: "CB", x: 39, y: 73 }, { role: "CB", x: 61, y: 73 }, { role: "RB", x: 83, y: 70 },
    { role: "CM", x: 30, y: 51 }, { role: "CM", x: 50, y: 56 }, { role: "CM", x: 70, y: 51 },
    { role: "LW", x: 18, y: 29 }, { role: "ST", x: 50, y: 24 }, { role: "RW", x: 82, y: 29 },
  ],
  "4-4-2": [
    { role: "GK", x: 50, y: 88 },
    { role: "LB", x: 17, y: 70 }, { role: "CB", x: 39, y: 73 }, { role: "CB", x: 61, y: 73 }, { role: "RB", x: 83, y: 70 },
    { role: "LM", x: 17, y: 49 }, { role: "CM", x: 39, y: 54 }, { role: "CM", x: 61, y: 54 }, { role: "RM", x: 83, y: 49 },
    { role: "ST", x: 39, y: 28 }, { role: "ST", x: 61, y: 28 },
  ],
  "3-5-2": [
    { role: "GK", x: 50, y: 88 },
    { role: "CB", x: 25, y: 73 }, { role: "CB", x: 50, y: 76 }, { role: "CB", x: 75, y: 73 },
    { role: "LWB", x: 12, y: 51 }, { role: "CM", x: 31, y: 56 }, { role: "CM", x: 50, y: 59 }, { role: "CM", x: 69, y: 56 }, { role: "RWB", x: 88, y: 51 },
    { role: "ST", x: 39, y: 29 }, { role: "ST", x: 61, y: 29 },
  ],
};

const positionFilters = ["All positions", "Goalkeeper", "Defender", "Midfielder", "Forward"];
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
function roleMatches(role: string, position: string) {
  const kind = position.toLowerCase();
  if (role === "GK") return kind.includes("goalkeeper");
  if (["LB", "CB", "RB", "LWB", "RWB"].includes(role)) return kind.includes("defend");
  if (["CM", "LM", "RM"].includes(role)) return kind.includes("midfield");
  if (["LW", "ST", "RW"].includes(role)) return kind.includes("forward") || kind.includes("striker");
  return false;
}

function PlayerOption({ player, selected, onSelect }: { player: DirectoryPlayer; selected: boolean; onSelect: () => void }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  return (
    <button className={`gq-picker-player${selected ? " is-selected" : ""}`} type="button" onClick={onSelect} disabled={selected}>
      <span className="gq-picker-avatar"><b>{initials(player.name)}</b>{player.photo && !photoFailed && <img src={player.photo} alt="" loading="lazy" onError={() => setPhotoFailed(true)} />}</span>
      <span className="gq-picker-info"><strong>{player.name}</strong><small>{player.team} · {player.position}</small></span>
      {player.teamLogo && <img className="gq-picker-crest" src={player.teamLogo} alt="" loading="lazy" />}
      <span className="gq-picker-add">{selected ? <Check size={15} /> : <Plus size={15} />}</span>
    </button>
  );
}

export default function DreamTeamBuilder() {
  const [formation, setFormation] = useState<Formation>("4-3-3");
  const [lineup, setLineup] = useState<string[]>(Array(11).fill(""));
  const [teamName, setTeamName] = useState("My Dream XI");
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [directory, setDirectory] = useState<DirectoryPlayer[]>([]);
  const [league, setLeague] = useState<"all" | League>("all");
  const [position, setPosition] = useState("All positions");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);
  const slots = formations[formation];
  const filled = lineup.filter((player) => player.trim()).length;
  const playerByName = useMemo(() => new Map(directory.map((player) => [player.name, player])), [directory]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const team = JSON.parse(saved) as SavedDreamTeam;
        if (team.formation in formations && Array.isArray(team.players)) {
          setFormation(team.formation);
          setLineup(Array.from({ length: 11 }, (_, index) => team.players[index] ?? ""));
          if (team.name) setTeamName(team.name);
        }
      }
    } catch { /* Start fresh if saved data is missing or invalid. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ formation, players: lineup, name: teamName })); }
    catch { /* The current lineup stays available in memory if storage is unavailable. */ }
  }, [formation, lineup, teamName, loaded]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch("/api/players?league=all", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Player directory is unavailable right now.");
        return response.json() as Promise<{ players?: DirectoryPlayer[] }>;
      })
      .then((data) => setDirectory(data.players ?? []))
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Could not load players.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return directory.filter((player) => {
      const leagueMatch = league === "all" || player.leagueCodes.includes(league);
      const positionMatch = position === "All positions" || player.position.toLowerCase().includes(position.toLowerCase());
      const searchText = `${player.name} ${player.team} ${player.position} ${player.nationality}`.toLowerCase();
      return leagueMatch && positionMatch && (!normalizedQuery || searchText.includes(normalizedQuery));
    });
  }, [directory, league, position, query]);

  function addPlayer(player: DirectoryPlayer) {
    if (lineup.includes(player.name)) {
      setNotice(`${player.name} is already in your XI.`);
      return;
    }
    const compatibleIndex = slots.findIndex((slot, index) => !lineup[index].trim() && roleMatches(slot.role, player.position));
    const availableIndex = activeSlot !== null && !lineup[activeSlot]
      ? activeSlot
      : compatibleIndex >= 0 ? compatibleIndex : lineup.findIndex((name) => !name.trim());
    if (availableIndex < 0) {
      setNotice("Your starting XI is full. Remove a player to make a change.");
      return;
    }
    setLineup((current) => current.map((name, index) => index === availableIndex ? player.name : name));
    setActiveSlot(null);
    setNotice(`${player.name} added to your ${slots[availableIndex].role} spot.`);
  }

  function removePlayer(index: number) {
    const removed = lineup[index];
    setLineup((current) => current.map((name, itemIndex) => itemIndex === index ? "" : name));
    setActiveSlot(index);
    if (removed) setNotice(`${removed} removed from your XI.`);
  }

  function clearTeam() {
    setLineup(Array(11).fill(""));
    setActiveSlot(null);
    setTeamName("My Dream XI");
    try { localStorage.removeItem(storageKey); } catch { /* The visible lineup is still cleared. */ }
    setNotice("Your lineup is clear. Start building your XI.");
  }

  return (
    <section className="gq-dream-builder" aria-labelledby="dream-team-title">
      <div className="gq-dream-heading">
        <div>
          <span className="gq-team-kicker">YOUR XI · YOUR PICKS</span>
          <h2 id="dream-team-title">Build your Dream Team</h2>
          <p>Choose a formation, then pick players from your leagues to fill the pitch.</p>
        </div>
        <span className="gq-dream-progress"><Users size={16} /> {filled} / 11 picked</span>
      </div>

      <div className="gq-dream-controls">
        <label className="gq-dream-name"><span>Team name</span><input value={teamName} onChange={(event) => setTeamName(event.target.value)} maxLength={32} aria-label="Your team name" /></label>
        <label htmlFor="dream-formation">Formation</label>
        <select id="dream-formation" value={formation} onChange={(event) => { setFormation(event.target.value as Formation); setActiveSlot(null); }}>
          {Object.keys(formations).map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <span className="gq-dream-save-note"><Save size={14} /> Saved on this device</span>
        <button type="button" onClick={clearTeam}><RotateCcw size={14} /> Start over</button>
      </div>

      {notice && <p className="gq-dream-notice" role="status"><Shield size={14} /> {notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><X size={13} /></button></p>}

      <div className="gq-dream-layout">
        <div className="gq-dream-board">
          <div className="gq-dream-board-title"><span>{teamName.trim() || "My Dream XI"}</span><small>{formation} · {filled} players</small></div>
          <div className="gq-dream-pitch" aria-label={`${formation} lineup preview`}>
            <span className="gq-dream-midline" /><span className="gq-dream-circle" /><span className="gq-dream-box gq-dream-box-top" /><span className="gq-dream-box gq-dream-box-bottom" />
            {slots.map((slot, index) => {
              const player = playerByName.get(lineup[index]);
              return (
                <button className={`gq-dream-player ${lineup[index] ? "has-player" : ""} ${activeSlot === index ? "is-active" : ""}`} key={`${formation}-${index}`} style={{ left: `${slot.x}%`, top: `${slot.y}%` }} title={`${slot.role}: ${lineup[index] || "Choose a player"}`} aria-label={`${slot.role}: ${lineup[index] || "empty slot"}`} onClick={() => { if (lineup[index]) removePlayer(index); else setActiveSlot(index); }}>
                  <b>{lineup[index] ? initials(lineup[index]) : <Plus size={14} />}</b>
                  {player?.photo && <img src={player.photo} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                  <small>{lineup[index] || slot.role}</small>
                </button>
              );
            })}
          </div>
          <div className="gq-dream-board-foot"><span><i /> Tap an empty spot to choose where your next player goes</span><span>{filled === 11 ? "XI COMPLETE" : `${11 - filled} SPOTS LEFT`}</span></div>
        </div>

        <div className="gq-dream-picker">
          <div className="gq-dream-picker-heading"><div><span>THE PLAYER POOL</span><h3>Choose your players</h3></div><span className="gq-dream-picker-count">{loading ? "…" : filteredPlayers.length}</span></div>
          <label className="gq-dream-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a player or club" aria-label="Search players and clubs" /><kbd>/</kbd></label>
          <div className="gq-dream-filters">
            <select aria-label="Filter players by league" value={league} onChange={(event) => setLeague(event.target.value as "all" | League)}><option value="all">All leagues</option>{Object.entries(leagues).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select>
            <select aria-label="Filter players by position" value={position} onChange={(event) => setPosition(event.target.value)}>{positionFilters.map((filter) => <option key={filter}>{filter}</option>)}</select>
          </div>
          <div className="gq-dream-pool" aria-label="Available players">
            {loading ? <p className="gq-dream-pool-empty"><LoaderCircle className="gq-dream-spin" size={17} /> Loading players from your leagues…</p>
              : error ? <p className="gq-dream-pool-empty">{error}</p>
              : filteredPlayers.length ? filteredPlayers.slice(0, 30).map((player) => <PlayerOption key={`${player.id}-${player.team}`} player={player} selected={lineup.includes(player.name)} onSelect={() => addPlayer(player)} />)
              : <p className="gq-dream-pool-empty">No players match that search. Try another name or league.</p>}
          </div>
          <p className="gq-dream-picker-hint"><ArrowDown size={13} /> Select a player to add them to the highlighted position.</p>
        </div>
      </div>

      <div className="gq-dream-roster" aria-label="Your starting eleven">
        {slots.map((slot, index) => {
          const player = playerByName.get(lineup[index]);
          return (
            <div className={`gq-dream-player-field ${activeSlot === index ? "is-active" : ""} ${lineup[index] ? "has-player" : ""}`} key={`${formation}-field-${index}`}>
              <button type="button" onClick={() => setActiveSlot(index)} aria-pressed={activeSlot === index}>
                <b>{slot.role}</b><span>{player?.name ?? (lineup[index] || "Choose player")}</span><small>{player?.team ?? (lineup[index] ? "Added from player directory" : "Open slot · tap to select")}</small>
              </button>
              {lineup[index] && <button className="gq-dream-remove" type="button" onClick={() => removePlayer(index)} aria-label={`Remove ${lineup[index]}`}><X size={14} /></button>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
