"use client";

import Form from "next/form";

export default function WorldCupFilters({ year, years, view, filter, options }: {
  year: string;
  years: string[];
  view: "road" | "journey" | "archive";
  filter: string;
  options: string[];
}) {
  const filterName = view === "journey" ? "team" : "round";

  return (
    <Form action="/worldcup" className="my-4 flex flex-wrap items-end gap-3">
      <input type="hidden" name="view" value={view} />
      <label className="grid gap-1 text-sm font-bold">
        Edition
        <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-medium" name="year" key={year} defaultValue={year}
          onChange={(event) => {
            const form = event.currentTarget.form;
            const field = form?.elements.namedItem(filterName);
            if (field instanceof HTMLSelectElement) field.disabled = true;
            form?.requestSubmit();
          }}>
          {years.map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
      </label>
      {view !== "road" && (
        <label className="grid gap-1 text-sm font-bold">
          {view === "journey" ? "National team" : "Round"}
          <select className="max-w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-medium"
            name={filterName} key={`${year}-${filter}`} defaultValue={filter}
            onChange={(event) => event.currentTarget.form?.requestSubmit()}>
            {view === "archive" && <option value="">All rounds</option>}
            {options.map((option) => <option value={option} key={option}>{option}</option>)}
          </select>
        </label>
      )}
      <button className="md-score cursor-pointer px-3 py-2 text-sm font-bold">
        {view === "road" ? "Show bracket" : view === "journey" ? "View journey" : "Show matches"}
      </button>
    </Form>
  );
}
