import data from "./worldcup-history.json";
import type { Team } from "@/app/services/matchCentre";

type ScoreLine = [number, number];
type Goal = { name: string; minute: string; owngoal?: boolean };
export type WorldCupMatch = {
  round: string;
  date: string;
  team1: string;
  team2: string;
  group?: string;
  ground?: string;
  status?: string;
  score?: ScoreLine | { ft?: ScoreLine; et?: ScoreLine; p?: ScoreLine };
  goals1?: Goal[];
  goals2?: Goal[];
};

export const editions = data as unknown as Record<string, WorldCupMatch[]>;
export const years = Object.keys(editions).sort((a, b) => Number(b) - Number(a));

const flags: Record<string, string> = {
  Algeria: "dz", Angola: "ao", Argentina: "ar", Australia: "au", Austria: "at", Belgium: "be", Bolivia: "bo",
  "Bosnia & Herzegovina": "ba", "Bosnia-Herzegovina": "ba", Brazil: "br", Bulgaria: "bg", Cameroon: "cm",
  Canada: "ca", "Cape Verde": "cv", Chile: "cl", China: "cn", Colombia: "co", "Costa Rica": "cr", Croatia: "hr",
  Cuba: "cu", Curaçao: "cw", "Czech Republic": "cz", "Côte d'Ivoire": "ci", "DR Congo": "cd", Denmark: "dk",
  Ecuador: "ec", Egypt: "eg", "El Salvador": "sv", England: "gb-eng", France: "fr", Germany: "de", Ghana: "gh",
  Greece: "gr", Haiti: "ht", Honduras: "hn", Hungary: "hu", Iceland: "is", Iran: "ir", Iraq: "iq", Ireland: "ie",
  Israel: "il", Italy: "it", "Ivory Coast": "ci", Jamaica: "jm", Japan: "jp", Jordan: "jo", Kuwait: "kw", Mexico: "mx",
  Morocco: "ma", Netherlands: "nl", "New Zealand": "nz", Nigeria: "ng", "North Korea": "kp", "Northern Ireland": "gb",
  Norway: "no", Panama: "pa", Paraguay: "py", Peru: "pe", Poland: "pl", Portugal: "pt", Qatar: "qa", Romania: "ro",
  Russia: "ru", "Saudi Arabia": "sa", Scotland: "gb-sct", Senegal: "sn", Serbia: "rs", Slovakia: "sk", Slovenia: "si",
  "South Africa": "za", "South Korea": "kr", Spain: "es", Sweden: "se", Switzerland: "ch", Togo: "tg",
  "Trinidad and Tobago": "tt", Tunisia: "tn", Turkey: "tr", USA: "us", Ukraine: "ua", "United Arab Emirates": "ae",
  "United States": "us", Uruguay: "uy", Uzbekistan: "uz", Wales: "gb-wls", "West Germany": "de",
};

export function nationalTeam(displayName: string): Team {
  const flag = flags[displayName];
  return { displayName, logo: flag ? `https://flagcdn.com/w80/${flag}.png` : undefined };
}

export function finalScore(match: WorldCupMatch) {
  if (Array.isArray(match.score)) return { score: match.score };
  return { score: match.score?.et ?? match.score?.ft, penalties: match.score?.p, extraTime: !!match.score?.et };
}

export function normalizedRound(round: string) {
  if (/^Quarter-?finals?/.test(round)) return "Quarter-finals";
  if (/^Semi-?finals?$/.test(round)) return "Semi-finals";
  if (/third.?place/i.test(round)) return "Third-place match";
  if (round === "Final Round") return "Final round";
  return round.replace(/, Replays$/, "");
}
