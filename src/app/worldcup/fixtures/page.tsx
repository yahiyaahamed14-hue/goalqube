import Navbar from "@/components/Navbar";

const groups = [
  {
    name: "Group A",
    teams: [
      "Mexico",
      "South Africa",
      "Korea Republic",
      "Czechia",
    ],
  },
  {
    name: "Group B",
    teams: [
      "Canada",
      "Romania",
      "Qatar",
      "Switzerland",
    ],
  },
  {
    name: "Group C",
    teams: [
      "Brazil",
      "Morocco",
      "Haiti",
      "Scotland",
    ],
  },
  {
    name: "Group D",
    teams: [
      "USA",
      "Paraguay",
      "Australia",
      "Türkiye",
    ],
  },
  {
    name: "Group E",
    teams: [
      "Germany",
      "Curacao",
      "Côte d'Ivoire",
      "Ecuador",
    ],
  },
  {
    name: "Group F",
    teams: [
      "Netherlands",
      "Japan",
      "Sweden",
      "Tunisia",
    ],
  },
  {
    name: "Group G",
    teams: [
      "Belgium",
      "Egypt",
      "IR Iran",
      "New Zealand",
    ],
  },
  {
    name: "Group H",
    teams: [
      "Spain",
      "Cape Verde",
      "Saudi Arabia",
      "Uruguay",
    ],
  },
  {
    name: "Group I",
    teams: [
      "France",
      "Senegal",
      "Iraq",
      "Norway",
    ],
  },
  {
    name: "Group J",
    teams: [
      "Argentina",
      "Algeria",
      "Austria",
      "Jordan",
    ],
  },
  {
    name: "Group K",
    teams: [
      "Portugal",
      "Congo DR",
      "Uzbekistan",
      "Colombia",
    ],
  },
  {
    name: "Group L",
    teams: [
      "England",
      "Croatia",
      "Ghana",
      "Panama",
    ],
  },
];

export default function FixturesPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FIFA WORLD CUP 2026
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          GROUP STAGE
        </h1>

      </section>

      <section className="px-6 lg:px-16 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {groups.map((group) => (

            <div
              key={group.name}
              className="bg-white/5 border border-white/10 rounded-[30px] p-8"
            >

              <h2 className="text-3xl font-black text-yellow-400">
                {group.name}
              </h2>

              <div className="mt-6 space-y-3">

                {group.teams.map((team) => (

                  <div
                    key={team}
                    className="bg-black/40 rounded-xl p-3"
                  >
                    {team}
                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}