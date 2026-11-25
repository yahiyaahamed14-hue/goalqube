"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown } from "lucide-react";
import { getStandingsSeasons, type StandingsLeague } from "@/app/services/standings";

export default function StandingsSeasonPicker({ league, selected, currentYear }: {
  league: StandingsLeague;
  selected: number;
  currentYear: number;
}) {
  const router = useRouter();
  const seasons = getStandingsSeasons(league, currentYear);

  return (
    <label className="md-season-picker">
      <span className="md-season-picker-icon"><CalendarDays size={17} aria-hidden="true" /></span>
      <span className="md-season-picker-copy">
        <small>CHOOSE SEASON</small>
        <select
          aria-label="Choose a season"
          value={selected}
          onChange={(event) => router.push(`/standings?league=${encodeURIComponent(league)}&season=${event.currentTarget.value}`)}
        >
          {seasons.map((year) => <option key={year} value={year}>{year}–{String((year + 1) % 100).padStart(2, "0")}</option>)}
        </select>
      </span>
      <ChevronDown className="md-season-picker-chevron" size={17} aria-hidden="true" />
    </label>
  );
}
