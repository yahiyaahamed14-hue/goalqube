import Link from "next/link";
import MatchClub from "@/components/MatchClub";
import { getMatchListing, kickoff, matchScore, matchTeams, type Team } from "@/app/services/matchCentre";

type Leader = {
  value: number;
  athlete: { id: string; displayName: string; team?: Team };
};

type Statistics = {
  stats?: { name: string; displayName: string; leaders: Leader[] }[];
};

async function getSeasonLeaders() {
  try {
    const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/statistics", {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? (await response.json() as Statistics).stats ?? [] : [];
  } catch {
    return [];
  }
}

export default async function PremierLeagueOverview() {
  const [leaders, previous, upcoming] = await Promise.all([
    getSeasonLeaders(),
    getMatchListing("eng.1", "previous"),
    getMatchListing("eng.1", "upcoming"),
  ]);
  const matchSections = [
    { title: "Recent results", view: "previous", feed: previous, direction: -1 },
    { title: "Upcoming fixtures", view: "upcoming", feed: upcoming, direction: 1 },
  ] as const;

  return (
    <>
      <section id="player-leaders" className="mt-10 scroll-mt-5" aria-labelledby="player-leaders-title">
        <h2 id="player-leaders-title" className="text-3xl font-black text-yellow-400">Season leaders</h2>
        {leaders.length ? (
          <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
            {leaders.filter((category) => category.leaders?.length).map((category) => (
              <section key={category.name} className="md-details-card">
                <h3 className="mb-3 text-xl font-bold">
                  {category.name === "goalsLeaders" ? "Top scorers" : category.name === "assistsLeaders" ? "Top assists" : category.displayName}
                </h3>
                <div className="max-h-96 overflow-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-zinc-400">
                      <th scope="col" className="py-2 pr-2">#</th>
                      <th scope="col" className="py-2 pr-2">Player</th>
                      <th scope="col" className="py-2 pr-2">Club</th>
                      <th scope="col" className="py-2 text-right">{category.displayName}</th>
                    </tr></thead>
                    <tbody>
                      {category.leaders.map(({ athlete, value }, index) => (
                        <tr key={athlete.id} className="border-t border-white/10">
                          <td className="py-2 pr-2">{category.leaders.findIndex((leader) => leader.value === value) + 1 || index + 1}</td>
                          <th scope="row" className="py-2 pr-2 text-left">{athlete.displayName}</th>
                          <td className="py-2 pr-2">{athlete.team ? <MatchClub team={athlete.team} /> : "–"}</td>
                          <td className="py-2 text-right font-bold tabular-nums">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        ) : <p className="md-details-card mt-4">Season leaders are temporarily unavailable.</p>}
      </section>

      <section id="league-matches" className="mt-10 grid scroll-mt-5 items-start gap-4 lg:grid-cols-2" aria-label="Premier League matches">
        {matchSections.map(({ title, view, feed, direction }) => (
          <section key={view} className="md-details-card">
            <h2>{title}</h2>
            {feed.matches.length ? (
              <ul className="divide-y divide-[#e7e9e2]">
                {feed.matches.sort((a, b) => direction * (Date.parse(a.match.date) - Date.parse(b.match.date))).slice(0, 5).map(({ id, league, match }) => {
                  const { home, away } = matchTeams(match);
                  return <li key={id} className="py-3">
                    <Link className="md-match-detail-link" href={`/match/${id}?league=${league}`}>
                      <span className="md-match-pair">
                        <MatchClub team={home?.team} />
                        <strong className="md-score">{(view === "previous" && matchScore(match)) || "vs"}</strong>
                        <MatchClub team={away?.team} />
                      </span>
                      <time dateTime={match.date} className="mt-1 block text-sm text-zinc-400">{kickoff(match)}</time>
                    </Link>
                  </li>;
                })}
              </ul>
            ) : <p className="text-zinc-400">{feed.incomplete ? "Match data is temporarily unavailable." : "No matches in this view."}</p>}
            <Link className="md-match-detail-link mt-3 inline-block font-bold text-yellow-400" href={`/matches?view=${view}&league=eng.1`}>View all {title.toLowerCase()}</Link>
          </section>
        ))}
      </section>
    </>
  );
}
