export const newsSources = {
  espn: { name: "ESPN", url: "https://site.api.espn.com/apis/site/v2/sports/soccer/all/news" },
  bbc: { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
  guardian: { name: "The Guardian", url: "https://www.theguardian.com/football/rss" },
  sky: { name: "Sky Sports", url: "https://www.skysports.com/rss/12040" },
  cbs: { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/soccer/" },
  "espn-india": { name: "ESPN India", url: "https://www.espn.in/espn/rss/football/news" },
};

export type NewsSource = keyof typeof newsSources;
type Story = { title: string; url: string; image?: string; published?: string; source: NewsSource };
type ESPN = { articles?: { headline?: string; published?: string; links?: { web?: { href?: string } }; images?: { url?: string; width?: number; height?: number }[] }[] };

function safeUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function decode(value: string) {
  const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, key: string) => {
    if (key[0] !== "#") return entities[key.toLowerCase()] ?? match;
    const code = key[1].toLowerCase() === "x" ? Number.parseInt(key.slice(2), 16) : Number(key.slice(1));
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
  });
}

function rssField(item: string, tag: string) {
  const value = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"))?.[1] ?? "";
  return decode(value.trim().replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")).trim();
}

function rssImage(item: string) {
  const media = Array.from(item.matchAll(/<(?:media:thumbnail|media:content|itunes:image)\b[^>]*\burl=(["'])(.*?)\1/gi), (match) => match[2]);
  const enclosure = Array.from(item.matchAll(/<enclosure\b(?=[^>]*\btype=["']image\/)[^>]*\burl=(["'])(.*?)\1/gi), (match) => match[2]);
  const content = item.match(/<(?:content:encoded|description)\b[^>]*>([\s\S]*?)<\/(?:content:encoded|description)>/i)?.[1] ?? "";
  const html = decode(content.replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1"));
  const inline = Array.from(html.matchAll(/<img\b[^>]*\b(?:src|data-src)=(["'])(.*?)\1/gi), (match) => match[2]);
  for (const candidate of [...media, ...enclosure, ...inline]) {
    const image = safeUrl(decode(candidate));
    if (image) return image;
  }
  return undefined;
}

function rssStories(xml: string, source: NewsSource): Story[] {
  return Array.from(xml.matchAll(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)).flatMap(([item]) => {
    const title = rssField(item, "title");
    const url = safeUrl(rssField(item, "link"));
    const image = rssImage(item);
    return title && url ? [{ title, url, image, source, published: rssField(item, "pubDate") }] : [];
  });
}

async function loadSource(source: NewsSource): Promise<Story[]> {
  const response = await fetch(newsSources[source].url, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(7000),
  });
  if (!response.ok) throw new Error(`News feed returned ${response.status}`);
  const stories = source === "espn"
    ? ((await response.json()) as ESPN).articles?.flatMap((article): Story[] => {
      const url = safeUrl(article.links?.web?.href);
      return article.headline && url ? [{
        title: article.headline,
        url,
        image: safeUrl(article.images?.slice().sort((a, b) => (b.width ?? 0) * (b.height ?? 0) - (a.width ?? 0) * (a.height ?? 0))[0]?.url),
        published: article.published,
        source,
      }] : [];
    }) ?? []
    : rssStories(await response.text(), source);
  if (!stories.length) throw new Error("News feed returned no stories");
  return stories;
}

export async function getFootballHeadlines() {
  const sources = Object.keys(newsSources) as NewsSource[];
  const feeds = await Promise.allSettled(sources.map(loadSource));
  const stories = feeds.flatMap((feed) => feed.status === "fulfilled" ? feed.value : [])
    .sort((a, b) => (Date.parse(b.published ?? "") || 0) - (Date.parse(a.published ?? "") || 0));

  return { stories, unavailable: sources.filter((_, index) => feeds[index].status === "rejected") };
}
