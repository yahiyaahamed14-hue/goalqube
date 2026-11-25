"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, BarChart3, ChevronLeft, ChevronRight, CirclePlay, Globe2, Heart, Menu, Newspaper, Shield, X } from "lucide-react";
import Navbar from "./Navbar";
import { FootballMark } from "./Brand";
import type { DirectoryTeam } from "@/app/services/teamDirectory";
import { kickoff, leagues, matchScore, matchTeams, type Competition, type League } from "@/app/services/matchCentre";

type SpotlightMatch = { id: string; league: League; match: Competition };
type LeaguePlayer = { id: string; name: string; position: string; nationality: string; jersey?: string; photo?: string; team: string; teamId: string; teamLogo?: string; leagues: string[]; leagueCodes: League[] };
type SpotlightClub = DirectoryTeam & { short: string; color: string; note: string };

function PlayerWatchSlide({ player }: { player: LeaguePlayer }) {
 const [photo, setPhoto] = useState(player.photo ?? "");
 const [fallbackTried, setFallbackTried] = useState(false);
 const initials = player.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
 useEffect(() => { setPhoto(player.photo ?? ""); setFallbackTried(false); }, [player.id, player.photo]);
 async function loadFallbackPhoto() {
  if (fallbackTried) return;
  setFallbackTried(true);
  try {
   const params = new URLSearchParams({ league: player.leagueCodes[0] ?? "eng.1", teamId: player.teamId, team: player.team, name: player.name });
   const response = await fetch(`/api/players/photo?${params}`);
   if (response.ok) { const data = await response.json() as { photo?: string | null }; if (data.photo) setPhoto(data.photo); }
  } catch { /* Use the initials if no alternate portrait is available. */ }
 }
 return <article className="md-player-watch-slide">
  <div className="md-player-watch-photo"><span>{initials}</span>{photo && <img src={photo} alt={player.name} onError={() => { setPhoto(""); void loadFallbackPhoto(); }}/>}</div>
  <div className="md-player-watch-details"><span className="md-player-watch-league">{player.leagues[0] ?? "Football"}</span><h2>{player.name}</h2><span className="md-player-watch-position">{player.position}{player.jersey ? ` · #${player.jersey}` : ""}</span><span className="md-player-watch-club">{player.teamLogo && <img src={player.teamLogo} alt=""/>}{player.team}</span></div>
 </article>;
}

function LiveMatchSlide({ item }: { item: SpotlightMatch }) {
 const { home, away } = matchTeams(item.match);
 const logoFor = (team?: typeof home) => team?.team.logo || team?.team.logos?.[0]?.href;
 const homeLogo = logoFor(home);
 const awayLogo = logoFor(away);
 const isLive = item.match.status.type.state === "in";
 const score = isLive ? matchScore(item.match) ?? "–" : "VS";
 const minute = isLive ? item.match.status.type.shortDetail || item.match.status.displayClock || "Live" : kickoff(item.match);
 const href = `/match/${item.id}?league=${item.league}`;

 return <Link className="md-live-slide" href={href} aria-label={`${home?.team.displayName ?? "Home"} ${score} ${away?.team.displayName ?? "Away"}, ${minute}`}>
  <span className="md-live-league">{leagues[item.league]}</span>
  <span className="md-live-scoreline">
   <span className="md-live-team"><span className="md-live-team-name">{home?.team.shortDisplayName || home?.team.displayName || "Home"}</span>{homeLogo ? <img src={homeLogo} alt=""/> : <b>{home?.team.abbreviation || "H"}</b>}</span>
   <strong>{score}</strong>
   <span className="md-live-team md-live-team-away">{awayLogo ? <img src={awayLogo} alt=""/> : <b>{away?.team.abbreviation || "A"}</b>}<span className="md-live-team-name">{away?.team.shortDisplayName || away?.team.displayName || "Away"}</span></span>
  </span>
  <span className={`md-live-minute ${isLive ? "" : "is-upcoming"}`}><i/>{isLive ? "LIVE · " : "KICK-OFF · "}{minute}</span>
 </Link>;
}

const fallbackClubs: SpotlightClub[] = [
 { id: "364", slug: "liverpool", name: "Liverpool", shortName: "Liverpool", abbreviation: "LFC", leagues: ["Premier League"], short: "LFC", color: "#a51c38", note: "Club history & details" },
 { id: "359", slug: "arsenal", name: "Arsenal", shortName: "Arsenal", abbreviation: "ARS", leagues: ["Premier League"], short: "ARS", color: "#a51c38", note: "Club history & details" },
 { id: "86", slug: "real-madrid", name: "Real Madrid", shortName: "Real Madrid", abbreviation: "RMA", leagues: ["La Liga"], short: "RMA", color: "#a51c38", note: "Club history & details" },
 { id: "83", slug: "barcelona", name: "Barcelona", shortName: "Barcelona", abbreviation: "FCB", leagues: ["La Liga"], short: "FCB", color: "#a51c38", note: "Club history & details" },
];
function clubAccent(name: string) {
 const key = name.toLowerCase();
 if (key.includes("arsenal")) return "#b5262e";
 if (key.includes("barcelona")) return "#7b2444";
 if (key.includes("real madrid")) return "#8b7654";
 if (key.includes("manchester city")) return "#438bb5";
 if (key.includes("chelsea")) return "#244e86";
 if (key.includes("dortmund")) return "#a18a0b";
 return "#a51c38";
}
function Crest({ code, color, small = false, logo }: { code: string; color: string; small?: boolean; logo?: string }) {
 return <span className={`md-crest ${small ? "md-crest-small" : ""} ${logo ? "md-crest-with-logo" : ""}`} style={{ "--crest": color } as React.CSSProperties}>{logo ? <img src={logo} alt="" loading="lazy" referrerPolicy="no-referrer"/> : <><Shield strokeWidth={1.1}/><b>{code}</b></>}</span>;
}

export default function MatchdayExperience() {
 const [spotlight, setSpotlight] = useState(0);
 const [railOpen, setRailOpen] = useState(false);
 const [clubs, setClubs] = useState<SpotlightClub[]>(fallbackClubs);
 const [liveMatches, setLiveMatches] = useState<SpotlightMatch[]>([]);
 const [liveIncomplete, setLiveIncomplete] = useState(false);
 const [liveMode, setLiveMode] = useState<"live" | "upcoming">("live");
 const [liveCount, setLiveCount] = useState(0);
 const [liveIndex, setLiveIndex] = useState(0);
 const liveTrack = useRef<HTMLDivElement>(null);
 const [allPlayers, setAllPlayers] = useState<LeaguePlayer[]>([]);
 const [playersLoading, setPlayersLoading] = useState(true);
 const [playerLeague, setPlayerLeague] = useState<"all" | League>("all");
 const [playerSearch, setPlayerSearch] = useState("");
 const [watchIndex, setWatchIndex] = useState(0);
 const playerTouchStart = useRef(0);
 useEffect(() => {
  const controller = new AbortController();
  fetch("/api/team-directory", { signal: controller.signal })
   .then((response) => response.ok ? response.json() as Promise<DirectoryTeam[]> : [])
   .then((teams) => {
    if (!teams.length) return;
    const available = teams.map((team): SpotlightClub => ({
     ...team,
     short: team.abbreviation || team.shortName?.split(/\s+/).map((part) => part[0]).slice(0, 3).join("").toUpperCase() || team.name.split(/\s+/).map((part) => part[0]).slice(0, 3).join("").toUpperCase(),
     color: clubAccent(team.name),
     note: team.shortName && team.shortName.toLowerCase() !== team.name.toLowerCase() ? team.shortName : "Club history & details",
    }));
    setClubs(available);
    setSpotlight(0);
   })
   .catch(() => undefined);
  return () => controller.abort();
 }, []);
 useEffect(() => {
  const controller = new AbortController();
  fetch("/api/players?league=all", { signal: controller.signal })
   .then((response) => response.ok ? response.json() as Promise<{ players: LeaguePlayer[] }> : Promise.reject())
   .then((data) => setAllPlayers(data.players))
   .catch(() => undefined)
   .finally(() => { if (!controller.signal.aborted) setPlayersLoading(false); });
  return () => controller.abort();
 }, []);
 useEffect(() => {
  const controller = new AbortController();
  const loadLive = () => fetch("/api/live-matches", { signal: controller.signal, cache: "no-store" })
   .then((response) => response.ok ? response.json() as Promise<{ matches: SpotlightMatch[]; incomplete: boolean; mode: "live" | "upcoming"; liveCount: number }> : Promise.reject())
   .then((data) => { setLiveMatches(data.matches); setLiveIncomplete(data.incomplete); setLiveMode(data.mode); setLiveCount(data.liveCount); setLiveIndex(0); if (liveTrack.current) liveTrack.current.scrollLeft = 0; })
   .catch(() => { if (!controller.signal.aborted) setLiveIncomplete(true); });
  void loadLive();
  const timer = window.setInterval(loadLive, 30000);
  return () => { controller.abort(); window.clearInterval(timer); };
 }, []);
 const selected = clubs[spotlight];
 const teamSlug = selected.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
 const selectedLogo = selected.logo;
 const teamHref = `/teams/${teamSlug}?${new URLSearchParams({ name: selected.name, league: selected.leagues.join(" · "), ...(selectedLogo ? { logo: selectedLogo } : {}) })}`;
 const filteredWatchPlayers = allPlayers.filter((player) =>
  (playerLeague === "all" || player.leagueCodes.includes(playerLeague)) &&
  (!playerSearch.trim() || `${player.name} ${player.team} ${player.position}`.toLowerCase().includes(playerSearch.trim().toLowerCase()))
 );
 const activeWatchPlayer = filteredWatchPlayers[watchIndex];
 function changeClub(step: number) { setSpotlight(i => (i + step + clubs.length) % clubs.length); }
 function moveWatch(step: number) {
  if (!filteredWatchPlayers.length) return;
  const next = (watchIndex + step + filteredWatchPlayers.length) % filteredWatchPlayers.length;
  setWatchIndex(next);
  playerTrack.current?.scrollTo({ left: playerTrack.current.clientWidth * next, behavior: "smooth" });
 }
 function filterPlayers(league: "all" | League, search: string) {
  setPlayerLeague(league);
  setPlayerSearch(search);
  setWatchIndex(0);
 }
 function moveLive(step: number) {
  const next = (liveIndex + step + liveMatches.length) % liveMatches.length;
  setLiveIndex(next);
  liveTrack.current?.scrollTo({ left: liveTrack.current.clientWidth * next, behavior: "smooth" });
 }

 return <main className="md-page md-home-page">
  <div className="md-outer-type" aria-hidden="true">FOOTBALL</div>
  <div className="md-app">
   <aside className="md-rail" aria-label="Quick navigation">
    <Link href="/" className="md-rail-logo" aria-label="Goalqube home"><FootballMark/></Link>
    <button className="md-rail-menu" aria-label={railOpen ? "Close shortcuts" : "Open shortcuts"} aria-expanded={railOpen} onClick={() => setRailOpen(!railOpen)}>{railOpen ? <X size={17}/> : <Menu size={17}/>}</button>
    <div className="md-rail-links"><Link className="md-rail-active" href="/matches" aria-label="Matches"><CirclePlay size={18}/></Link><Link href="/standings" aria-label="Standings"><BarChart3 size={18}/></Link><Link href="/search" aria-label="Find a club"><Shield size={18}/></Link><Link href="/news" aria-label="News"><Newspaper size={18}/></Link><Link href="/favorites" aria-label="Favorite Team"><Heart size={18}/></Link></div>
    <span className="md-rail-label">FOR THE LOVE OF FOOTBALL</span>
    <Link href="/worldcup" className="md-rail-bottom" aria-label="World Cup"><Globe2 size={18}/></Link>
   </aside>
   {railOpen && <div className="md-shortcuts"><span>YOUR FOOTBALL WORLD</span>{[["Match centre","/matches"],["League tables","/standings"],["Football news","/news"],["Favorite Team","/favorites"],["About Goalqube","/about"],["World Cup","/worldcup"],["Player stats","/stats"],["Watch football","/watch"]].map(([label,href]) => <Link key={href} href={href}>{label}<ArrowUpRight size={14}/></Link>)}</div>}
   <div className="md-main">
    <Navbar/>
    <section className="md-hero" aria-labelledby="md-hero-heading">
     <div className="md-haaland-backdrop" aria-hidden="true"><img src="/haaland-spotlight.jpg" alt=""/></div>
     <div className="md-hero-type" aria-hidden="true">THE GAME.</div>
     <span className="md-yellow-ring ring-top" aria-hidden="true"/><span className="md-yellow-ring ring-bottom" aria-hidden="true"/>
     <div className="md-hero-copy"><span className="md-kicker"><i/> FOOTBALL. FRONT AND CENTRE.</span><h1 id="md-hero-heading">MORE<br/>THAN A<br/><em>GAME.</em></h1><p>The clubs you love. The moments you live for.<br/>Your football world, all in one place.</p><Link href="/matches" className="md-primary">Explore matches <ArrowUpRight size={16}/></Link></div>
     <aside className="md-match-hub" aria-label="Players to watch">
      <div className="md-hub-top"><span>ALL LEAGUE PLAYERS</span><span className="md-hub-dot"/></div>
      <div className="md-player-filters"><select aria-label="Filter players by league" value={playerLeague} onChange={(event)=>filterPlayers(event.target.value as "all" | League,playerSearch)}><option value="all">All leagues</option>{Object.entries(leagues).map(([code,name])=><option key={code} value={code}>{name}</option>)}</select><input aria-label="Search players" placeholder="Search player or club" value={playerSearch} onChange={(event)=>filterPlayers(playerLeague,event.target.value)}/></div>
      <div className="md-hub-panel md-player-watch-panel">
       {filteredWatchPlayers.length ? <>
        <div className="md-player-watch-track" onTouchStart={(event)=>{playerTouchStart.current=event.changedTouches[0]?.clientX ?? 0;}} onTouchEnd={(event)=>{const delta=(event.changedTouches[0]?.clientX ?? playerTouchStart.current)-playerTouchStart.current;if(Math.abs(delta)>40)moveWatch(delta<0?1:-1);}}>
         {activeWatchPlayer && <PlayerWatchSlide key={activeWatchPlayer.id} player={activeWatchPlayer}/>}
        </div>
        <div className="md-player-watch-controls"><span>{String(watchIndex+1).padStart(2,"0")} / {String(filteredWatchPlayers.length).padStart(2,"0")}</span><button aria-label="Previous player" onClick={()=>moveWatch(-1)} disabled={filteredWatchPlayers.length < 2}><ChevronLeft size={13}/></button><button aria-label="Next player" onClick={()=>moveWatch(1)} disabled={filteredWatchPlayers.length < 2}><ChevronRight size={13}/></button></div>
       </> : <div className="md-player-watch-empty">{playersLoading ? "Loading players across your leagues…" : "No players match that search."}</div>}
      </div>
      <div className="md-small-panels"><Link href="/standings"><BarChart3 size={17}/><span>The title race<small>League standings</small></span><ArrowUpRight size={13}/></Link><Link href="/news"><Newspaper size={17}/><span>Off the pitch<small>Football stories</small></span><ArrowUpRight size={13}/></Link></div>
     </aside>
     <div className="md-home-feature-row">
      <div className="md-club-spotlight" style={{ "--club-accent": selected.color } as React.CSSProperties}>
       <span className="md-club-spotlight-glow" aria-hidden="true"/>
       <div className="md-club-watermark" aria-hidden="true">{selectedLogo ? <img src={selectedLogo} alt=""/> : <span>{selected.short}</span>}</div>
       <div className="md-club-top"><span><i/> CLUB SPOTLIGHT</span><div><button aria-label="Previous club" onClick={()=>changeClub(-1)}><ChevronLeft size={14}/></button><span>{String(spotlight+1).padStart(2,"0")} / {String(clubs.length).padStart(2,"0")}</span><button aria-label="Next club" onClick={()=>changeClub(1)}><ChevronRight size={14}/></button></div></div>
       <Link href={teamHref} className="md-club-name" key={selected.name}><span className="md-club-crest-frame"><Crest code={selected.short} color={selected.color} logo={selectedLogo}/></span><div><small>{selected.leagues.join(" · ")} <i/> CLUB</small><h2>{selected.name}</h2><span>{selected.note}</span></div></Link>
       <Link className="md-club-spotlight-cta" href={teamHref}><span>DISCOVER THE CLUB</span><ArrowRight size={15}/></Link>
      </div>
      <section className="md-match-spotlight-wrap" aria-label="Match spotlight">
      <article className="md-match-spotlight">
       <div className="md-live-heading"><span className="md-match-spotlight-heading"><span className={`md-match-live-dot ${liveMode === "upcoming" ? "is-upcoming" : ""}`}/>{liveMode === "live" ? "LIVE MATCHES" : "UPCOMING MATCHES"}</span>
        {liveMatches.length > 1 && <div className="md-live-controls"><span>{String(liveIndex + 1).padStart(2,"0")} / {String(liveMatches.length).padStart(2,"0")}</span><button aria-label={`Previous ${liveMode} match`} onClick={()=>moveLive(-1)}><ChevronLeft size={13}/></button><button aria-label={`Next ${liveMode} match`} onClick={()=>moveLive(1)}><ChevronRight size={13}/></button></div>}
       </div>
       {liveMatches.length ? <>
        <div className="md-live-track" ref={liveTrack} onScroll={()=>{ if(liveTrack.current){setLiveIndex(Math.round(liveTrack.current.scrollLeft/liveTrack.current.clientWidth));} }}>
         {liveMatches.map((item)=><LiveMatchSlide key={`${item.league}-${item.id}`} item={item}/>)}
        </div>
        <div className="md-match-feature-footer"><span>{liveMode === "live" ? (liveMatches.length > liveCount ? `${liveCount} LIVE · NEXT UP` : "LIVE ACROSS YOUR LEAGUES") : "NEXT ACROSS YOUR LEAGUES"}</span><Link href={`/matches?view=${liveMode}`}>{liveMode === "live" ? "ALL LIVE MATCHES" : "ALL UPCOMING MATCHES"} <ArrowRight size={13}/></Link></div>
       </> : <div className="md-live-empty"><strong>{liveIncomplete ? "Match schedule unavailable" : "No matches found"}</strong><span>{liveIncomplete ? "Please check the Match Centre shortly." : "Upcoming fixtures will appear here."}</span><Link href={`/matches?view=${liveMode}`}>OPEN MATCH CENTRE <ArrowRight size={13}/></Link></div>}
      </article>
      </section>
     </div>
     <div className="md-hero-edition"><span>THE GOALQUBE EDIT</span><span>01 — FOOTBALL CULTURE</span></div>
    </section>
   </div>
  </div>
 </main>;
}
