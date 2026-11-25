import { NextResponse } from "next/server";
import { getMatchListing, leagues, type League } from "@/app/services/matchCentre";

export async function GET() {
  const competitions = Object.keys(leagues) as League[];
  const liveFeeds = await Promise.allSettled(competitions.map(async (league) => {
    const result = await getMatchListing(league, "live");
    return result.matches.map((entry) => ({ ...entry, league }));
  }));
  let matches = liveFeeds.flatMap((feed) => feed.status === "fulfilled" ? feed.value : []);
  const liveCount = matches.length;
  let mode: "live" | "upcoming" = "live";
  let incomplete = liveFeeds.some((feed) => feed.status === "rejected");

  if (matches.length <= 1) {
    const upcomingFeeds = await Promise.allSettled(competitions.map(async (league) => {
      const result = await getMatchListing(league, "upcoming");
      return result.matches.map((entry) => ({ ...entry, league }));
    }));
    const upcoming = upcomingFeeds.flatMap((feed) => feed.status === "fulfilled" ? feed.value : [])
      .sort((a, b) => a.match.date.localeCompare(b.match.date));
    if (liveCount === 0) {
      mode = "upcoming";
      matches = upcoming;
    } else {
      matches = [...matches, ...upcoming.slice(0, 5)];
    }
    incomplete = incomplete || upcomingFeeds.some((feed) => feed.status === "rejected");
  }

  return NextResponse.json({ matches, incomplete, mode, liveCount }, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" },
  });
}
