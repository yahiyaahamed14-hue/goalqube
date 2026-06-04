import Navbar from "@/components/Navbar";

const cities = [
  {
    city: "New York",
    stadium: "MetLife Stadium",
  },
  {
    city: "Los Angeles",
    stadium: "SoFi Stadium",
  },
  {
    city: "Dallas",
    stadium: "AT&T Stadium",
  },
  {
    city: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
  },
  {
    city: "Toronto",
    stadium: "BMO Field",
  },
  {
    city: "Vancouver",
    stadium: "BC Place",
  },
  {
    city: "Mexico City",
    stadium: "Estadio Azteca",
  },
  {
    city: "Guadalajara",
    stadium: "Estadio Akron",
  },
  {
    city: "Monterrey",
    stadium: "Estadio BBVA",
  },
];

export default function CitiesPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="px-6 lg:px-16 py-16">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          FIFA WORLD CUP 2026
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-4">
          HOST CITIES
        </h1>

      </section>

      <section className="px-6 lg:px-16 pb-24">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {cities.map((item) => (

            <div
              key={item.city}
              className="bg-white/5 border border-white/10 rounded-[30px] p-8"
            >

              <h2 className="text-3xl font-black">
                {item.city}
              </h2>

              <p className="text-zinc-400 mt-4">
                🏟 {item.stadium}
              </p>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}