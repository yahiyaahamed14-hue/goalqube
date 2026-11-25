import Link from "next/link";
import Navbar from "@/components/Navbar";
import MatchClub from "@/components/MatchClub";
import { isLeague, leagues, type League, type Team } from "@/app/services/matchCentre";

type Leader = {
  value: number;
  athlete: { id: string; displayName: string; headshot?: string; team?: Team };
};
type Category = { name: string; displayName: string; leaders: Leader[] };
type Statistics = { stats?: Category[] };

async function getLeaders(league: League): Promise<Category[]> {
  try {
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/statistics`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return [];
    return (await response.json() as Statistics).stats ?? [];
  } catch {
    return [];
  }
}

function categoryTitle(category: Category) {
  if (category.name === "goalsLeaders") return "Top scorers";
  if (category.name === "assistsLeaders") return "Most assists";
  return category.displayName || category.name;
}

export default async function StatsPage({ searchParams }: {
  searchParams: Promise<{ league?: string }>;
}) {
  const params = await searchParams;
  const selected = params.league && isLeague(params.league) ? params.league : "eng.1";
  const categories = (await getLeaders(selected)).filter((category) => category.leaders?.length);

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      <section className="md-inner-content" aria-labelledby="player-stats-title">
        <p className="text-xs font-bold tracking-[.22em] text-zinc-500">THE NUMBERS BEHIND THE GAME</p>
        <h1 id="player-stats-title" className="mt-3 text-5xl font-black sm:text-7xl">Player Stats</h1>
        <p className="mt-3 max-w-2xl text-zinc-500">Compare the leading players across your leagues, from goals and assists to the rest of the season numbers.</p>

        <nav className="md-match-tabs" aria-label="Choose league">
          {(Object.entries(leagues) as [League, string][]).map(([code, name]) => (
            <Link key={code} href={`/stats?league=${encodeURIComponent(code)}`} aria-current={selected === code ? "page" : undefined}>
              {name.replace(" (MLS)", "")}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold tracking-[.16em] text-zinc-500">CURRENT LEAGUE</span>
            <h2 className="mt-1 text-2xl font-bold">{leagues[selected]}</h2>
          </div>
          <Link className="text-sm font-bold text-yellow-400" href={`/standings?league=${encodeURIComponent(selected)}`}>View league table ↗</Link>
        </div>

        {categories.length ? (
          <div className="mt-5 grid items-start gap-4 lg:grid-cols-2">
            {categories.map((category) => (
              <section key={category.name} className="md-details-card min-w-0">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h2>{categoryTitle(category)}</h2>
                  <span className="text-xs text-zinc-500">{category.displayName}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-zinc-500">
                        <th scope="col" className="py-2 pr-3">#</th>
                        <th scope="col" className="py-2 pr-3">Player</th>
                        <th scope="col" className="py-2 pr-3">Club</th>
                        <th scope="col" className="py-2 text-right">{category.displayName}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.leaders.map(({ athlete, value }, index) => (
                        <tr key={`${category.name}-${athlete.id}`} className="border-t border-white/10">
                          <td className="py-3 pr-3 text-zinc-500">{index + 1}</td>
                          <th scope="row" className="py-3 pr-3 text-left font-semibold">{athlete.displayName}</th>
                          <td className="py-3 pr-3">{athlete.team ? <MatchClub team={athlete.team} /> : "—"}</td>
                          <td className="py-3 text-right font-bold tabular-nums">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <section className="md-details-card mt-5">
            <h2>Stats are temporarily unavailable</h2>
            <p className="text-zinc-500">We couldn’t load the player statistics for {leagues[selected]} right now. Please try again in a little while.</p>
          </section>
        )}
      </section>
    </main>
  );
}
