import data from "./champions-history.json";

// Completed seasons use the CC0 footballcsv and openfootball results archives.
export type HistoricalMatch = [stage: string, date: string, home: string, away: string, score: string, penalties: string, extraTime: string];
export const historicalMatches = data as unknown as Record<string, HistoricalMatch[]>;

export const currentSeason = 2026;

export const qualifyingRounds = [
  { label: "First qualifying round", dates: ["2026-07-07", "2026-07-08", "2026-07-14", "2026-07-15"] },
  { label: "Second qualifying round", dates: ["2026-07-21", "2026-07-22", "2026-07-28", "2026-07-29"] },
  { label: "Third qualifying round", dates: ["2026-08-04", "2026-08-05", "2026-08-11"] },
  { label: "Qualifying play-offs", dates: ["2026-08-18", "2026-08-19", "2026-08-25", "2026-08-26"] },
];

export function seasonLabel(year: number) {
  return `${year}/${String(year + 1).slice(-2)}`;
}
