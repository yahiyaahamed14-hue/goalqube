import Navbar from "@/components/Navbar";

type Props = {
  params: {
    id: string;
  };
};

export default function MatchDetailsPage({
  params,
}: Props) {

  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      {/* Hero */}
      <section className="px-6 lg:px-16 py-20">

        <p className="text-yellow-400 font-bold tracking-[5px]">
          MATCH DETAILS
        </p>

        <h1 className="text-5xl lg:text-7xl font-black mt-6">
          Arsenal vs Chelsea
        </h1>

        <p className="text-zinc-400 text-2xl mt-6">
          Emirates Stadium • Premier League
        </p>

      </section>

      {/* Score Card */}
      <section className="px-6 lg:px-16 pb-24">

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-12">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* Team 1 */}
            <div className="text-center">

              <img
                src="https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg"
                alt="Arsenal"
                className="w-32 h-32 object-contain mx-auto"
              />

              <h2 className="text-4xl font-black mt-6">
                Arsenal
              </h2>

            </div>

            {/* Score */}
            <div className="text-center">

              <h1 className="text-8xl font-black text-yellow-400">
                2 - 1
              </h1>

              <p className="text-zinc-400 text-xl mt-6">
                FULL TIME
              </p>

            </div>

            {/* Team 2 */}
            <div className="text-center">

              <img
                src="https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg"
                alt="Chelsea"
                className="w-32 h-32 object-contain mx-auto"
              />

              <h2 className="text-4xl font-black mt-6">
                Chelsea
              </h2>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}