import Navbar from "@/components/Navbar";
import TeamSearch from "@/app/teams/TeamSearch";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const initialQuery = typeof q === "string" ? q.slice(0, 120) : "";
  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      <section className="md-inner-content gq-team-directory" aria-labelledby="team-search-title">
        <p className="gq-team-kicker">YOUR FOOTBALL WORLD</p>
        <h1 id="team-search-title">Find your club.<br /><span>Know its story.</span></h1>
        <p className="gq-team-intro">Search the teams across the competitions on Goalqube, then explore their club history.</p>
        <TeamSearch showResults initialQuery={initialQuery} />
      </section>
    </main>
  );
}
