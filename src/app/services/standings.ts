export const standingsLeagues = {
  "eng.1": "Premier League",
  "esp.1": "La Liga",
  "fra.1": "Ligue 1",
  "ind.1": "Indian Super League",
  "uefa.champions": "UEFA Champions League",
  "ger.1": "Bundesliga",
  "ita.1": "Serie A",
  "ned.1": "Eredivisie",
  "por.1": "Primeira Liga",
  "ksa.1": "Saudi Pro League",
  "usa.1": "Major League Soccer (MLS)",
} as const;

export type StandingsLeague = keyof typeof standingsLeagues;

export const standingsFirstSeason: Record<StandingsLeague, number> = {
  "eng.1": 2000,
  "esp.1": 2000,
  "fra.1": 2000,
  "ind.1": 2014,
  "uefa.champions": 2000,
  "ger.1": 2000,
  "ita.1": 2000,
  "ned.1": 2000,
  "por.1": 2000,
  "ksa.1": 2008,
  "usa.1": 2000,
};

export function getStandingsSeasons(league: StandingsLeague, currentYear: number) {
  return Array.from(
    { length: Math.max(0, currentYear - standingsFirstSeason[league] + 1) },
    (_, index) => currentYear - index,
  );
}
