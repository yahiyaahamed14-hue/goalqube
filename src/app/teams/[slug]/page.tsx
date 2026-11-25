import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import TeamSearch from "../TeamSearch";
import ClubHistoryDetails from "../ClubHistoryDetails";
import { slugifyTeam } from "@/app/services/teamDirectory";

export default async function TeamHistoryPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ name?: string; league?: string; logo?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const requestedName = typeof query.name === "string" && slugifyTeam(query.name) === slug ? query.name : slug.replaceAll("-", " ");
  const fallbackLeague = typeof query.league === "string" ? query.league : "";
  let directoryLogo: string | undefined;
  try {
    const candidate = new URL(query.logo ?? "");
    if (candidate.protocol === "https:" || candidate.protocol === "http:") directoryLogo = candidate.href;
  } catch { /* The provider badge is used when no directory logo is supplied. */ }
  const name = requestedName.replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      <article className="md-inner-content gq-club-profile">
        <Link className="gq-club-back" href="/search"><ArrowLeft size={16} /> All teams</Link>
        <header className="gq-club-profile-heading">
          <div>
            <p className="gq-team-kicker">CLUB HISTORY {fallbackLeague ? `· ${fallbackLeague}` : ""}</p>
            <h1>{name}</h1>
          </div>
        </header>

        <TeamSearch />

        <ClubHistoryDetails teamName={requestedName} league={fallbackLeague} badge={directoryLogo} />
      </article>
    </main>
  );
}
