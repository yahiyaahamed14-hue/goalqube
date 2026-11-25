import Link from "next/link";
import Navbar from "@/components/Navbar";
import NewsStoryImage from "./NewsStoryImage";
import { getFootballHeadlines, newsSources, type NewsSource } from "../services/footballHeadlines";

const pageSize = 18;
const dateLabel = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

export default async function NewsPage({ searchParams }: {
  searchParams: Promise<{ source?: string; page?: string }>;
}) {
  const query = await searchParams;
  const source = typeof query.source === "string" && Object.hasOwn(newsSources, query.source)
    ? query.source as NewsSource : undefined;
  const { stories, unavailable } = await getFootballHeadlines();
  const urls = new Set<string>();
  const filtered = stories.filter((story) => {
    if (source && story.source !== source) return false;
    const key = new URL(story.url);
    key.search = "";
    key.hash = "";
    if (urls.has(key.href)) return false;
    urls.add(key.href);
    return true;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const requested = typeof query.page === "string" && /^\d+$/.test(query.page) ? Number(query.page) : 1;
  const page = Math.max(1, Math.min(pages, requested));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageUrl = (number: number) => `/news?${new URLSearchParams({ ...(source ? { source } : {}), page: String(number) })}`;

  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      <section className="md-inner-content" aria-labelledby="news-title">
        <h1 id="news-title" className="text-5xl font-black sm:text-7xl">Football News</h1>
        <nav className="md-match-filters" aria-label="News sources">
          <Link href="/news" aria-current={!source ? "page" : undefined}>All sources</Link>
          {(Object.entries(newsSources)).map(([key, item]) => (
            <Link key={key} href={`/news?source=${key}`} aria-current={source === key ? "page" : undefined}>{item.name}</Link>
          ))}
        </nav>
        {unavailable.length > 0 && !source && <p className="mt-4 text-sm text-zinc-400">Some sources are temporarily unavailable.</p>}
        {visible.length ? (
          <ul className="md-news-grid">
            {visible.map((story) => {
              const date = Date.parse(story.published ?? "");
              return (
                <li key={story.url}>
                  <a className="md-news-card" href={story.url}>
                    <div className="md-news-image">
                      <NewsStoryImage src={story.image} alt={story.title} />
                    </div>
                    <div className="md-news-body">
                      <div className="md-news-meta">
                        <span>{newsSources[story.source].name}</span>
                        {Number.isFinite(date) && <time dateTime={new Date(date).toISOString()}>{dateLabel.format(date)}</time>}
                      </div>
                      <h2>{story.title}</h2>
                      <span className="md-news-read">Read story</span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : <p className="md-details-card mt-6">Headlines are temporarily unavailable. Please check again shortly.</p>}
        {pages > 1 && (
          <nav className="md-news-pages" aria-label="News pages">
            {page > 1 && <Link href={pageUrl(page - 1)}>Previous page</Link>}
            <span>Page {page} of {pages}</span>
            {page < pages && <Link href={pageUrl(page + 1)}>Next page</Link>}
          </nav>
        )}
      </section>
    </main>
  );
}
