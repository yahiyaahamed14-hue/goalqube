import Link from "next/link";
import MatchClub from "@/components/MatchClub";
import { getCompetitionMatches, matchScore, matchTeams, type Team } from "../services/matchCentre";
import ArchiveFilters from "./ArchiveFilters";
import { currentSeason, historicalMatches, qualifyingRounds, seasonLabel } from "./archiveData";

type ArchiveMatch = {
  stage: string;
  date: string;
  home: Team;
  away: Team;
  score: string;
  penalties?: string;
  extraTime?: string;
  href?: string;
};

const seasons = Array.from({ length: currentSeason - 1955 + 1 }, (_, index) => {
  const year = currentSeason - index;
  return { year, label: seasonLabel(year) };
});

const dateLabel = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "UTC" });

export default async function SeasonArchive({ season, round, leagueDates, knockoutDates }: {
  season?: string;
  round?: string;
  leagueDates: string[];
  knockoutDates: string[];
}) {
  const year = seasons.find((option) => String(option.year) === season)?.year ?? currentSeason;
  const isCurrent = year === currentSeason;
  let incomplete = false;
  let matches: ArchiveMatch[];

  if (isCurrent) {
    const today = new Date().toISOString().slice(0, 10);
    const [qualifying, main] = await Promise.all([
      getCompetitionMatches("uefa.champions_qual", qualifyingRounds.flatMap(({ dates }) => dates)),
      getCompetitionMatches("uefa.champions", [...leagueDates, ...knockoutDates].filter((date) => date <= today)),
    ]);
    incomplete = qualifying.incomplete || main.incomplete;
    matches = [...qualifying.matches, ...main.matches].flatMap(({ id, match }) => {
      const date = match.date.slice(0, 10);
      const { home, away } = matchTeams(match);
      const score = matchScore(match);
      if (!home || !away || !score || match.status.type.state !== "post") return [];
      const qualifier = qualifyingRounds.find(({ dates }) => dates.includes(date));
      const leagueRound = leagueDates.includes(date) ? "League phase" : "Knockout phase";
      return [{ stage: qualifier?.label ?? leagueRound, date, home: home.team, away: away.team, score, href: qualifier ? undefined : `/match/${id}?league=uefa.champions` }];
    });
  } else {
    matches = (historicalMatches[year] ?? []).map(([stage, date, home, away, score, penalties, extraTime]) => ({
      stage: stage.split(" | ")[0].replace(/^Finals, /, ""),
      date,
      home: { displayName: home },
      away: { displayName: away },
      score,
      penalties,
      extraTime,
    }));
  }

  const rounds = [...new Set(matches.map((match) => match.stage))];
  const selectedRound = typeof round === "string" && rounds.includes(round) ? round : "";
  const results = matches.filter((match) => !selectedRound || match.stage === selectedRound)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="mt-6" aria-labelledby="archive-title">
      <h2 id="archive-title" className="text-2xl font-black">Season Archive</h2>
      <p className="mt-2 text-sm text-zinc-400">European Cup results from 1955/56 and Champions League results from 1992/93 onward.</p>
      <ArchiveFilters year={year} seasons={seasons} round={selectedRound} rounds={rounds} />
      {incomplete && <p role="status" className="mt-3 text-sm text-zinc-400">Some current-season results could not be loaded.</p>}
      <div className="md-details-card mt-5">
        <h3 className="text-xl font-bold">{seasonLabel(year)} · {results.length} results</h3>
        {results.length ? (
          <ol className="mt-2 divide-y divide-[#e7e9e2]">
            {results.map(({ stage, date, home, away, score, penalties, extraTime, href }) => {
              const teams = (
                <span className="md-match-pair font-bold">
                  <MatchClub team={home} />
                  <strong className="md-score text-sm">{score.replace(/\s*-\s*/g, " – ")}</strong>
                  <MatchClub team={away} />
                </span>
              );
              return (
                <li key={`${date}-${home.displayName}-${away.displayName}`} className="py-3">
                  <p className="mb-1 text-xs font-bold text-zinc-400">
                    {stage} · <time dateTime={date}>{dateLabel.format(new Date(date))}</time>
                  </p>
                  {href ? <Link href={href} className="md-match-detail-link inline-block">{teams}</Link> : teams}
                  {(penalties || extraTime) && <p className="mt-1 text-xs text-zinc-400">
                    {[extraTime && `After extra time ${extraTime}`, penalties && `Penalties ${penalties}`].filter(Boolean).join(" · ")}
                  </p>}
                </li>
              );
            })}
          </ol>
        ) : <p className="mt-3 text-zinc-400">No results available for this selection.</p>}
      </div>
      <p className="mt-3 text-sm text-zinc-400">
        {isCurrent ? "Current-season results from ESPN." : <>Historical results from <a className="underline" href="https://github.com/footballcsv/europe-champions-league">footballcsv</a> and <a className="underline" href="https://github.com/openfootball/champions-league">openfootball</a>. Qualifying coverage varies by season.</>}
      </p>
    </section>
  );
}
