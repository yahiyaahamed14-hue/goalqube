import Link from "next/link";
import MatchClub from "@/components/MatchClub";
import archiveCrests from "./champions-crests.json";
import { historicalMatches, seasonLabel, type HistoricalMatch } from "./archiveData";

const crests: Record<string, string> = archiveCrests;

const roundOrder = [
  "Preliminary round", "Round 1", "Round 2", "Knockout play-offs",
  "Round of 16", "Quarter-finals", "Semi-finals", "Final",
];

function roundName(stage: string) {
  const name = stage.split(" | ")[0].replace(/^Finals, /, "");
  if (name.startsWith("Playoffs, Matchday")) return "Knockout play-offs";
  if (name === "Prelim. Round") return "Preliminary round";
  if (name === "Quarterfinals") return "Quarter-finals";
  if (name === "Semifinals") return "Semi-finals";
  return name;
}

function scoreText(value: string) {
  return value.replace(/(\d)\s*-\s*(\d)/g, "$1 – $2");
}

function tieScore(tie: HistoricalMatch[]) {
  const [first, second] = tie;
  if (tie.length === 1) return scoreText(first[4]);
  if (tie.length !== 2 || first[2] !== second[3] || first[3] !== second[2]) return undefined;
  const scores = tie.map((match) => (match[6] || match[4]).match(/^(\d+)\s*-\s*(\d+)/));
  const [legOne, legTwo] = scores;
  if (!legOne || !legTwo) return undefined;
  return `Agg. ${Number(legOne[1]) + Number(legTwo[2])} – ${Number(legOne[2]) + Number(legTwo[1])}`;
}

const dateLabel = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

export default function HistoricalRoad({ season }: { season: number }) {
  const rounds = new Map<string, Map<string, HistoricalMatch[]>>();
  for (const match of historicalMatches[season] ?? []) {
    const round = roundName(match[0]);
    if (!roundOrder.includes(round)) continue;

    const pair = JSON.stringify([match[2], match[3]].sort());
    const ties = rounds.get(round) ?? new Map<string, HistoricalMatch[]>();
    const legs = ties.get(pair) ?? [];
    legs.push(match);
    ties.set(pair, legs);
    rounds.set(round, ties);
  }

  const stages = roundOrder.filter((stage) => rounds.has(stage));
  return (
    <>
      {stages.length ? (
        <div className="md-bracket-scroll" role="region" aria-label={`${seasonLabel(season)} knockout bracket. Scroll horizontally to see all rounds.`} tabIndex={0}>
          <ol className="md-tournament-rounds" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(9.5rem, 1fr))`, minWidth: `${stages.length * 11}rem` }}>
            {stages.map((stage) => (
              <li key={stage} className="md-bracket-round">
                <div className="md-bracket-heading"><h3>{stage}</h3></div>
                <ol className="md-bracket-slots">
                  {[...(rounds.get(stage)?.entries() ?? [])].map(([pair, legs]) => {
                    const tie = [...legs].sort((a, b) => a[1].localeCompare(b[1]));
                    const [, , home, away] = tie[0];
                    const score = tieScore(tie);
                    return (
                      <li className="md-bracket-slot" key={pair}>
                        <details>
                          <summary>
                            <MatchClub team={{ displayName: home, logo: crests[home] }} />
                            <MatchClub team={{ displayName: away, logo: crests[away] }} />
                            {score && <span className="md-score mt-1 inline-block">{score}</span>}
                          </summary>
                          <ul className="mt-2 space-y-2 text-xs">
                            {tie.map(([, date, home, away, score, penalties, extraTime], index) => (
                              <li className="border-t border-white/10 pt-2" key={`${date}-${index}`}>
                                <time dateTime={date} className="block text-zinc-400">{dateLabel.format(new Date(date))}</time>
                                <p>{home} <strong>{scoreText(score)}</strong> {away}</p>
                                {extraTime && <p>Extra time {scoreText(extraTime)}</p>}
                                {penalties && <p>Penalties {scoreText(penalties)}</p>}
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      ) : <p className="md-details-card mt-4">No knockout results available for this season.</p>}
      <Link className="md-match-detail-link mt-4 inline-block text-sm font-bold" href={`/tournaments?view=archive&season=${season}`}>
        All {seasonLabel(season)} results
      </Link>
    </>
  );
}
