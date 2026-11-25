"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Trophy } from "lucide-react";
import { standingsLeagues, type StandingsLeague } from "@/app/services/standings";

export default function StandingsLeaguePicker({ selected }: { selected: StandingsLeague }) {
  const router = useRouter();

  return (
    <label className="md-league-picker">
      <span className="md-league-picker-icon"><Trophy size={17} aria-hidden="true" /></span>
      <span className="md-league-picker-copy">
        <small>CHOOSE A LEAGUE</small>
        <select
          aria-label="Choose a league"
          value={selected}
          onChange={(event) => router.push(`/standings?league=${encodeURIComponent(event.currentTarget.value)}`)}
        >
          {Object.entries(standingsLeagues).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </span>
      <ChevronDown className="md-league-picker-chevron" size={17} aria-hidden="true" />
    </label>
  );
}
