"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Shield, Trophy } from "lucide-react";
import type { ClubHistory } from "@/app/services/teamDirectory";

type WikipediaSearch = { pages?: { title?: string; key?: string }[] };
type WikipediaSummary = { title?: string; extract?: string; content_urls?: { desktop?: { page?: string } } };

async function wikipediaHistory(teamName: string, signal: AbortSignal): Promise<ClubHistory | null> {
  const searchUrl = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(`${teamName} football club`)}&limit=5`;
  const searchResponse = await fetch(searchUrl, { signal });
  if (!searchResponse.ok) return null;
  const search = await searchResponse.json() as WikipediaSearch;
  const normalize = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const match = search.pages?.find((page) => page.title && normalize(page.title).includes(normalize(teamName))) ?? search.pages?.[0];
  if (!match?.key) return null;
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(match.key)}`;
  const summaryResponse = await fetch(summaryUrl, { signal });
  if (!summaryResponse.ok) return null;
  const summary = await summaryResponse.json() as WikipediaSummary;
  if (!summary.extract) return null;
  return {
    id: match.key,
    name: summary.title ?? teamName,
    description: summary.extract,
    historySource: "Wikipedia",
    historyUrl: summary.content_urls?.desktop?.page,
  };
}

export default function ClubHistoryDetails({ teamName, league, badge }: { teamName: string; league: string; badge?: string }) {
  const [history, setHistory] = useState<ClubHistory | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      let record: ClubHistory | null = null;
      try {
        const response = await fetch(`/api/club-history?team=${encodeURIComponent(teamName)}`, {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(6000)]),
        });
        if (response.ok) record = await response.json() as ClubHistory;
      } catch { /* Fall back to the browser-accessible Wikipedia summary. */ }
      if (!record?.description && !controller.signal.aborted) {
        try { record = await wikipediaHistory(teamName, controller.signal); } catch { /* Show an honest unavailable state below. */ }
      }
      if (controller.signal.aborted) return;
      setHistory(record);
      setState(record ? "ready" : "unavailable");
    }
    void load();
    return () => controller.abort();
  }, [teamName]);

  const name = history?.name ?? teamName;
  const badgeUrl = badge || history?.badge;
  const paragraphs = history?.description?.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean) ?? [];

  return (
    <>
      <section className="gq-club-facts" aria-label={`${name} club facts`}>
        <div className="gq-club-identity">
          <span className="gq-club-badge">{badgeUrl ? <img src={badgeUrl} alt={`${name} badge`} referrerPolicy="no-referrer" /> : <Shield size={42} />}</span>
          <div><span className="gq-team-kicker">THE CLUB</span><h2>{name}</h2><p>{history?.country || "Football club"}{history?.league || league ? ` · ${history?.league || league}` : ""}</p></div>
        </div>
        <div className="gq-club-fact"><CalendarDays size={18} /><span><small>Founded</small><strong>{history?.founded || (state === "loading" ? "Loading details…" : "Not listed")}</strong></span></div>
        <div className="gq-club-fact"><Trophy size={18} /><span><small>Competition</small><strong>{history?.league || league || "Club profile"}</strong></span></div>
        <div className="gq-club-fact"><MapPin size={18} /><span><small>Home ground</small><strong>{history?.stadium || (state === "loading" ? "Loading details…" : "Not listed")}{history?.stadiumLocation ? ` · ${history.stadiumLocation}` : ""}</strong></span></div>
      </section>

      <section className="gq-club-story" aria-labelledby="club-story-title" aria-live="polite">
        <p className="gq-team-kicker">THE STORY SO FAR</p>
        <h2 id="club-story-title">A club with its own story.</h2>
        {state === "loading" ? <p className="gq-club-empty">Loading this club’s history…</p> : paragraphs.length ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>) : (
          <p className="gq-club-empty">A written history is not available for this club yet. The club name and competition remain searchable above.</p>
        )}
        {history?.historySource && <p className="gq-club-history-source">History source: {history.historySource}{history.historyUrl ? <> · <a href={history.historyUrl} target="_blank" rel="noreferrer">Read the full article</a></> : ""}</p>}
      </section>
      {state === "unavailable" && <p className="gq-club-source-note">Club history sources are temporarily unavailable. Please try again later.</p>}
    </>
  );
}
