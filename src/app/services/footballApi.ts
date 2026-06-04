const BASE_URL =
  "https://www.thesportsdb.com/api/v1/json/3";

export async function getLiveMatches() {

  try {

    const response = await fetch(
      `${BASE_URL}/eventspastleague.php?id=4328`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    console.log(data);

    return data.events || [];

  } catch (error) {

    console.log("API Error:", error);

    return [];
  }
}

export async function getFootballNews() {

  try {

    const response = await fetch(
      `${BASE_URL}/eventspastleague.php?id=4328`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    return data.events || [];

  } catch (error) {

    console.log("News API Error:", error);

    return [];
  }
}

export async function getRealFootballNews() {

  try {

    const response = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/all/news",
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    console.log(data.articles?.[0]);

    return data.articles || [];

  } catch (error) {

    console.log("ESPN News Error:", error);

    return [];
  }
}

export async function getAllTeams() {

  try {

    const leagues = [
      "English Premier League",
      "Spanish La Liga",
      "Italian Serie A",
      "German Bundesliga",
      "French Ligue 1",
    ];

    let allTeams: any[] = [];

    for (const league of leagues) {

      const response = await fetch(
        `${BASE_URL}/search_all_teams.php?l=${encodeURIComponent(league)}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.teams) {

        allTeams = [
          ...allTeams,
          ...data.teams,
        ];
      }
    }

    return allTeams;

  } catch (error) {

    console.log("Teams API Error:", error);

    return [];
  }
}

export async function searchTeams(team: string) {

  try {

    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(team)}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    return data.teams || [];

  } catch (error) {

    console.log("Search Error:", error);

    return [];
  }
}

export async function getWorldCupMatches() {

  try {

    const response = await fetch(
      `${BASE_URL}/eventsseason.php?id=4986&s=2026`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    return data.events || [];

  } catch (error) {

    console.log("World Cup API Error:", error);

    return [];
  }
}

export async function getUpcomingMatches() {

  try {

    const response = await fetch(
      `${BASE_URL}/eventsnextleague.php?id=4328`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    console.log("Upcoming Matches API:", data);

    return data.events || [];

  } catch (error) {

    console.log("Upcoming API Error:", error);

    return [];
  }
}

export async function getTodayMatches() {

  try {

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const response = await fetch(
      `${BASE_URL}/eventsday.php?d=${today}&s=Soccer`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    console.log("Today Matches:", data);

    return data.events || [];

  } catch (error) {

    console.log("Today Matches Error:", error);

    return [];
  }
}