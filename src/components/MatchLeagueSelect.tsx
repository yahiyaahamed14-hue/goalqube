"use client";

import { useRouter } from "next/navigation";

export default function MatchLeagueSelect({ view, league, options }: {
  view: string;
  league?: string;
  options: [string, string][];
}) {
  const router = useRouter();

  return (
    <label className="mt-5 flex w-fit max-w-full flex-wrap items-center gap-2 text-sm font-bold">
      League
      <select
        className="max-w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-medium"
        value={league ?? ""}
        onChange={(event) => {
          const params = new URLSearchParams({ view });
          if (event.target.value) params.set("league", event.target.value);
          router.push(`/matches?${params}`, { scroll: false });
        }}
      >
        <option value="">All leagues</option>
        {options.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>
    </label>
  );
}
