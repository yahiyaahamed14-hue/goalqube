"use client";

import Form from "next/form";

export default function ArchiveFilters({ year, seasons, round, rounds }: {
  year: number;
  seasons: { year: number; label: string }[];
  round: string;
  rounds: string[];
}) {
  return (
    <Form action="/tournaments" className="mt-4 flex flex-wrap items-end gap-3">
      <input type="hidden" name="view" value="archive" />
      <label className="grid gap-1 text-sm font-bold">
        Season
        <select
          name="season"
          key={year}
          defaultValue={year}
          onChange={(event) => {
            const form = event.currentTarget.form;
            const roundField = form?.elements.namedItem("round");
            if (roundField instanceof HTMLSelectElement) roundField.value = "";
            form?.requestSubmit();
          }}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-medium"
        >
          {seasons.map((season) => <option key={season.year} value={season.year}>{season.label}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Round
        <select
          name="round"
          key={`${year}-${round}`}
          defaultValue={round}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className="max-w-64 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-medium"
        >
          <option value="">All rounds</option>
          {rounds.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
        </select>
      </label>
      <button className="md-score cursor-pointer px-4 py-2 text-sm font-bold">Show results</button>
    </Form>
  );
}
