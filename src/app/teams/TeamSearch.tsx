"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search, Shield } from "lucide-react";
import { leagues } from "@/app/services/matchCentre";
import type { DirectoryTeam } from "@/app/services/teamDirectory";

const popularNames = ["Liverpool", "Arsenal", "Manchester City", "Manchester United", "Chelsea", "Barcelona", "Real Madrid", "Bayern Munich", "Paris Saint-Germain", "Inter Milan", "Kerala Blasters", "Mohun Bagan"];

export default function TeamSearch({ showResults = false, initialQuery = "" }: { showResults?: boolean; initialQuery?: string }) {
  const [teams, setTeams] = useState<DirectoryTeam[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [league, setLeague] = useState("All competitions");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/team-directory", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Team directory unavailable");
        return response.json() as Promise<DirectoryTeam[]>;
      })
      .then(setTeams)
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => teams.filter((team) => {
    const matchesName = team.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    const matchesLeague = league === "All competitions" || team.leagues.includes(league);
    return matchesName && matchesLeague;
  }), [league, query, teams]);
  const visible = useMemo(() => {
    if (query.trim()) return filtered;
    if (showResults) return filtered.slice(0, 12);
    const rank = new Map(popularNames.map((name, index) => [name.toLowerCase(), index]));
    return [...filtered]
      .sort((a, b) => (rank.get(a.name.toLowerCase()) ?? 100) - (rank.get(b.name.toLowerCase()) ?? 100) || a.name.localeCompare(b.name))
      .slice(0, 8);
  }, [filtered, query, showResults]);
  const resultsOpen = showResults || focused;

  return (
    <div className={`gq-team-search-wrap ${showResults ? "gq-team-search-full" : "gq-team-search-compact"}`}>
      <label className="gq-team-search">
        <Search size={19} aria-hidden="true" />
        <input
          type="search"
          aria-controls="gq-team-search-results"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 180)}
          placeholder="Search clubs across your leagues"
          aria-label="Search clubs across your leagues"
        />
        <span>{loading ? "Loading clubs…" : `${teams.length} clubs`}</span>
      </label>

      {showResults && (
        <div className="gq-team-leagues" aria-label="Filter clubs by competition">
          {["All competitions", ...Object.values(leagues)].map((name) => (
            <button key={name} type="button" aria-pressed={league === name} onClick={() => setLeague(name)}>{name}</button>
          ))}
        </div>
      )}

      {resultsOpen && (
        <div className="gq-team-results" id="gq-team-search-results" role="region" aria-label="Matching clubs" aria-live="polite">
          {!query.trim() && !showResults && <p className="gq-team-suggestion-label">Popular clubs · choose one or search all clubs</p>}
          {loading ? <p className="gq-team-empty">Loading clubs from your leagues…</p> : error ? (
            <p className="gq-team-empty">Club list is temporarily unavailable. Please try again.</p>
          ) : visible.length ? visible.map((team) => {
            const leagueLabel = team.leagues.join(" · ");
            const href = `/teams/${team.slug}?${new URLSearchParams({ name: team.name, league: leagueLabel, ...(team.logo ? { logo: team.logo } : {}) })}`;
            return (
              <Link className="gq-team-result" href={href} key={`${team.id}-${team.slug}`}>
                <span className="gq-team-result-badge">
                  {team.logo ? <img src={team.logo} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <Shield size={22} />}
                </span>
                <span className="gq-team-result-copy"><strong>{team.name}</strong><small>{leagueLabel}</small></span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            );
          }) : <p className="gq-team-empty">{query.trim() ? "No clubs found. Try another spelling." : "No clubs found for this competition."}</p>}
        </div>
      )}
    </div>
  );
}
