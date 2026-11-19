"use client";

import Form from "next/form";

export default function RoadSeasonSelect({ season, options }: {
  season: number;
  options: { year: number; label: string }[];
}) {
  return (
    <Form action="/tournaments" className="my-4 flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 text-sm font-bold">
        Season
        <select
          name="season"
          key={season}
          defaultValue={season}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-medium"
        >
          {options.map(({ year, label }) => <option key={year} value={year}>{label}</option>)}
        </select>
      </label>
      <button className="md-score cursor-pointer px-3 py-2 text-sm font-bold">Show bracket</button>
    </Form>
  );
}
