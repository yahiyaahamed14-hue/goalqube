import MatchClub from "@/components/MatchClub";
import type { Team } from "@/app/services/matchCentre";
import type { StandingsLeague } from "@/app/services/standings";
type Entry = { team: Team & { id: string }; stats: { name: string; displayValue: string }[] };
type Standings = {
  season?: { displayName: string };
  children?: { id: string; name: string; standings?: { entries: Entry[] } }[];
};

const columns = [
  ["gamesPlayed", "P", "Played"],
  ["wins", "W", "Won"],
  ["ties", "D", "Drawn"],
  ["losses", "L", "Lost"],
  ["pointsFor", "GF", "Goals for"],
  ["pointsAgainst", "GA", "Goals against"],
  ["pointDifferential", "GD", "Goal difference"],
  ["points", "Pts", "Points"],
] as const;

export default async function LeagueStandings({ league, season }: { league: StandingsLeague; season: number }) {
  let data: Standings | undefined;
  try {
    const response = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${league}/standings?season=${season}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) data = await response.json();
  } catch {
    // A temporary provider failure shouldn't break the standings page.
  }

  if (!data) return <p role="status" className="md-details-card mt-6">Standings are temporarily unavailable. Please check again shortly.</p>;

  const tables = data.children?.filter((group) => group.standings?.entries.length) ?? [];
  if (!tables.length) return <p className="md-details-card mt-6">No standings have been published for this competition yet.</p>;

  return (
    <>
      <p className="mt-6 text-zinc-400">{data.season?.displayName || `${season}–${String((season + 1) % 100).padStart(2, "0")}`}</p>
      {tables.map((group) => (
        <div key={group.id} className="md-standings-panel" tabIndex={0} role="region" aria-label={group.name}>
          <table className="md-standings-table">
            <caption>{group.name}</caption>
            <thead>
              <tr>
                <th scope="col" aria-label="Position">#</th>
                <th scope="col">Club</th>
                {columns.map(([name, shortLabel, label]) => <th key={name} scope="col" aria-label={label}>{shortLabel}</th>)}
              </tr>
            </thead>
            <tbody>
              {group.standings?.entries.map(({ team, stats }, index) => {
                const values = Object.fromEntries(stats.map(({ name, displayValue }) => [name, displayValue]));
                return (
                  <tr key={team.id}>
                    <td>{values.rank || index + 1}</td>
                    <th scope="row"><MatchClub team={team} /></th>
                    {columns.map(([name]) => <td key={name}>{values[name] || "–"}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}
