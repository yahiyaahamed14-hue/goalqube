import { NextResponse } from "next/server";

const BASE_URL =
  "https://www.thesportsdb.com/api/v1/json/3";

export async function GET() {

  try {

    const leagues = [
      "Indian Super League",
      "English Premier League",
      "French Ligue 1",
      "Spanish La Liga",
      "UEFA Champions League",
      "German Bundesliga",
      "Italian Serie A",
      "Dutch Eredivisie",
      "Portuguese Primeira Liga",
      "Saudi Pro League",
      "American Major League Soccer",
    ];

    let allTeams: any[] = [];

    for (const league of leagues) {

      const response = await fetch(
        `${BASE_URL}/search_all_teams.php?l=${encodeURIComponent(league)}`
      );

      const data = await response.json();

      if (data.teams) {

        allTeams = [
          ...allTeams,
          ...data.teams,
        ];
      }
    }

    return NextResponse.json(allTeams);

  } catch (error) {

    console.log("Teams Route Error:", error);

    return NextResponse.json([]);
  }
}
