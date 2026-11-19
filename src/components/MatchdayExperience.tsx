"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, ChevronLeft, ChevronRight, CirclePlay, Globe2, Heart, Menu, Newspaper, Search, Shield, X } from "lucide-react";
import Navbar from "./Navbar";
import Brand, { FootballMark } from "./Brand";

const clubs = [
  { name: "Liverpool", short: "LFC", country: "England", color: "#a51c38", note: "The Reds", detail: "A crest. A city. A connection that runs deep.", established: "1892" },
  { name: "Arsenal", short: "AFC", country: "England", color: "#b5262e", note: "The Gunners", detail: "North London roots. A worldwide football family.", established: "1886" },
  { name: "Real Madrid", short: "RMA", country: "Spain", color: "#8b7654", note: "Los Blancos", detail: "Discover the stories behind the famous white shirt.", established: "1902" },
  { name: "FC Barcelona", short: "FCB", country: "Spain", color: "#7b2444", note: "Blaugrana", detail: "Colours, culture, and a passion that connects.", established: "1899" },
  { name: "AC Milan", short: "ACM", country: "Italy", color: "#9f2432", note: "Rossoneri", detail: "Red and black. A football story like no other.", established: "1899" },
  { name: "Inter", short: "INT", country: "Italy", color: "#244e86", note: "Nerazzurri", detail: "Explore the blue and black side of Milan.", established: "1908" },
  { name: "Bayern Munich", short: "FCB", country: "Germany", color: "#b8253c", note: "Die Roten", detail: "Bavarian roots and a global football following.", established: "1900" },
  { name: "Dortmund", short: "BVB", country: "Germany", color: "#b29b0c", note: "Black & Yellow", detail: "A yellow wall. An unmistakable football culture.", established: "1909" },
];
const views = [
 { name: "Matches", icon: CirclePlay, title: "Every whistle. Every moment.", description: "Fixtures, results and the matches that bring us together.", href: "/matches", action: "Open match centre" },
 { name: "Clubs", icon: Shield, title: "It's more than a crest.", description: "Discover your club, its history and the colours you call home.", href: "/search", action: "Discover the clubs" },
 { name: "Stories", icon: Newspaper, title: "Beyond the scoreline.", description: "Read the headlines and stories from across the football world.", href: "/news", action: "Read football news" },
];
function Crest({ code, color, small = false }: { code: string; color: string; small?: boolean }) {
 return <span className={`md-crest ${small ? "md-crest-small" : ""}`} style={{ "--crest": color } as React.CSSProperties}><Shield strokeWidth={1.1}/><b>{code}</b></span>;
}

export default function MatchdayExperience() {
 const [spotlight, setSpotlight] = useState(0);
 const [view, setView] = useState(0);
 const [country, setCountry] = useState("All clubs");
 const [query, setQuery] = useState("");
 const [railOpen, setRailOpen] = useState(false);
 const selected = clubs[spotlight];
 const section = views[view];
 const filtered = clubs.filter(club => (country === "All clubs" || club.country === country) && club.name.toLowerCase().includes(query.toLowerCase()));
 function changeClub(step: number) { setSpotlight(i => (i + step + clubs.length) % clubs.length); }
 return <main className="md-page">
  <div className="md-outer-type" aria-hidden="true">FOOTBALL</div>
  <div className="md-app">
   <aside className="md-rail" aria-label="Quick navigation">
    <Link href="/" className="md-rail-logo" aria-label="Goalqube home"><FootballMark/></Link>
    <button className="md-rail-menu" aria-label={railOpen ? "Close shortcuts" : "Open shortcuts"} aria-expanded={railOpen} onClick={() => setRailOpen(!railOpen)}>{railOpen ? <X size={17}/> : <Menu size={17}/>}</button>
    <div className="md-rail-links"><Link className="md-rail-active" href="/matches" aria-label="Matches"><CirclePlay size={18}/></Link><Link href="/standings" aria-label="Standings"><BarChart3 size={18}/></Link><Link href="/search" aria-label="Find a club"><Shield size={18}/></Link><Link href="/news" aria-label="News"><Newspaper size={18}/></Link><Link href="/favorites" aria-label="Favorites"><Heart size={18}/></Link></div>
    <span className="md-rail-label">FOR THE LOVE OF FOOTBALL</span>
    <Link href="/worldcup" className="md-rail-bottom" aria-label="World Cup"><Globe2 size={18}/></Link>
   </aside>
   {railOpen && <div className="md-shortcuts"><span>YOUR FOOTBALL WORLD</span>{[["Match centre","/matches"],["League tables","/standings"],["Football news","/news"],["Your favorites","/favorites"],["World Cup","/worldcup"],["Player stats","/stats"],["Watch football","/watch"]].map(([label,href]) => <Link key={href} href={href}>{label}<ArrowUpRight size={14}/></Link>)}</div>}
   <div className="md-main">
    <Navbar/>
    <section className="md-hero" aria-labelledby="md-hero-heading">
     <div className="md-hero-type" aria-hidden="true">THE GAME.</div>
     <span className="md-yellow-ring ring-top" aria-hidden="true"/><span className="md-yellow-ring ring-bottom" aria-hidden="true"/>
     <div className="md-hero-copy"><span className="md-kicker"><i/> FOOTBALL. FRONT AND CENTRE.</span><h1 id="md-hero-heading">MORE<br/>THAN A<br/><em>GAME.</em></h1><p>The clubs you love. The moments you live for.<br/>Your football world, all in one place.</p><Link href="/matches" className="md-primary">Explore matches <ArrowUpRight size={16}/></Link></div>
     <div className="md-player-stage"><div className="md-player-halo"/><img className="md-player" src="/images/goalqube-player.png" alt="Editorial portrait of Mohamed Salah in a red football jersey" loading="eager" fetchPriority="high"/><div className="md-player-caption"><span>PLAYER SPOTLIGHT</span><strong>Mohamed Salah</strong><span className="md-caption-line"/></div></div>
     <aside className="md-match-hub" aria-label="Explore your matchday">
      <div className="md-hub-top"><span>YOUR MATCHDAY, REIMAGINED</span><span className="md-hub-dot"/></div>
      <div className="md-view-tabs" role="tablist" aria-label="Explore football"><button role="tab" aria-selected={view===0} aria-controls="md-match-panel" id="md-view-0" onClick={()=>setView(0)}>Matches</button><button role="tab" aria-selected={view===1} aria-controls="md-match-panel" id="md-view-1" onClick={()=>setView(1)}>Clubs</button><button role="tab" aria-selected={view===2} aria-controls="md-match-panel" id="md-view-2" onClick={()=>setView(2)}>Stories</button></div>
      <div className="md-hub-panel" id="md-match-panel" role="tabpanel" aria-labelledby={`md-view-${view}`}>
       <div className="md-rivalry"><Crest code="LFC" color="#a51c38" small/><span>Liverpool <small>THE RIVALRIES</small> Arsenal</span><Crest code="AFC" color="#bb2b31" small/></div>
       <div className="md-pitch" aria-hidden="true"><span className="md-pitch-goal goal-a"/><span className="md-pitch-goal goal-b"/><span className="md-pitch-center"/>{["a","b","c","d","e","f","g"].map((x,i)=><i key={x} className={`md-player-dot dot-${x} ${i>3?"dot-away":""}`}/>)}</div>
       <div className="md-panel-text" key={view}><span className="md-panel-icon"><section.icon size={17}/></span><h2>{section.title}</h2><p>{section.description}</p><Link href={section.href}>{section.action}<ArrowRight size={14}/></Link></div>
      </div>
      <div className="md-small-panels"><Link href="/standings"><BarChart3 size={17}/><span>The title race<small>League standings</small></span><ArrowUpRight size={13}/></Link><Link href="/news"><Newspaper size={17}/><span>Off the pitch<small>Football stories</small></span><ArrowUpRight size={13}/></Link></div>
     </aside>
     <div className="md-club-spotlight"><div className="md-club-top"><span>CLUB SPOTLIGHT</span><div><button aria-label="Previous club" onClick={()=>changeClub(-1)}><ChevronLeft size={14}/></button><span>{String(spotlight+1).padStart(2,"0")} / 08</span><button aria-label="Next club" onClick={()=>changeClub(1)}><ChevronRight size={14}/></button></div></div><div className="md-club-name" key={selected.name}><Crest code={selected.short} color={selected.color}/><div><small>{selected.country} · EST. {selected.established}</small><h2>{selected.name}</h2><span>{selected.note}</span></div></div><Link href="/search">Discover the club <ArrowRight size={13}/></Link></div>
     <div className="md-hero-edition"><span>THE GOALQUBE EDIT</span><span>01 — FOOTBALL CULTURE</span><a href="#the-edit" aria-label="Explore below"><ArrowDown size={16}/></a></div>
    </section>
    <div className="md-quick-strip"><span>ONE GAME.<br/><b>EVERY ANGLE.</b></span>{[["MATCH CENTRE","Fixtures & results","/matches",CirclePlay],["LEAGUE TABLES","Follow the race","/standings",BarChart3],["WORLD CUP","The world's stage","/worldcup",Globe2],["YOUR CLUBS","Find your colours","/favorites",Heart]].map(([title,subtitle,href,Icon])=>{const ItemIcon=Icon as typeof Heart; return <Link href={href as string} key={title as string}><ItemIcon size={20}/><span>{title as string}<small>{subtitle as string}</small></span><ArrowUpRight size={14}/></Link>;})}</div>
    <section className="md-editorial" id="the-edit"><div className="md-section-title"><div><span className="md-kicker"><i/> THE FOOTBALL EDIT</span><h2>Every angle.<br/><span>All football.</span></h2></div><p>From the ninety minutes on the pitch<br/>to everything that happens around it.</p><Link href="/news">Into the football world <ArrowUpRight size={17}/></Link></div>
     <div className="md-editorial-grid"><Link href="/matches" className="md-story md-story-stadium"><img src="/images/goalqube-stadium.png" alt="Football stadium under matchday lights" loading="lazy"/><div><span>01 / MATCHDAY</span><h3>Nothing beats<br/>the first whistle.</h3><p>Fixtures, results and your next ninety minutes.</p></div><span className="md-story-arrow"><ArrowUpRight size={20}/></span></Link><Link href="/search" className="md-story md-story-club"><span className="md-story-number" aria-hidden="true">1892</span><div className="md-story-crest" aria-hidden="true"><Shield strokeWidth={.8}/><b>YOUR<br/>CLUB.</b></div><div><span>02 / CLUB CULTURE</span><h3>Follow the crest.<br/>Feel the connection.</h3><p>Discover the clubs behind the colours.</p></div><span className="md-story-arrow"><ArrowUpRight size={20}/></span></Link><Link href="/news" className="md-story md-story-news"><span className="md-story-big" aria-hidden="true">90<span>+</span></span><div><span>03 / BEYOND THE SCORE</span><h3>The game doesn't<br/>end at full time.</h3><p>Catch up with the stories that matter.</p></div><span className="md-story-arrow"><ArrowUpRight size={20}/></span></Link></div>
    </section>
    <section className="md-club-section"><div className="md-section-title"><div><span className="md-kicker"><i/> FIND YOUR COLOURS</span><h2>Where do<br/><span>you belong?</span></h2></div><p>A badge on a shirt.<br/>A whole world behind it.</p><label className="md-club-search"><Search size={16}/><input type="search" placeholder="Find your club" value={query} onChange={e=>setQuery(e.target.value)} aria-label="Filter clubs by name"/></label></div><div className="md-country-tabs" aria-label="Filter clubs by country">{["All clubs","England","Spain","Italy","Germany"].map(name=><button key={name} aria-pressed={country===name} onClick={()=>setCountry(name)}>{name}</button>)}</div><div className="md-club-grid">{filtered.map(club=><Link href="/search" className="md-club-card" key={club.name}><Crest code={club.short} color={club.color}/><div><h3>{club.name}</h3><span>{club.country} · {club.note}</span></div><ArrowUpRight size={15}/></Link>)}{filtered.length===0&&<div className="md-empty"><Search size={22}/><h3>No clubs found</h3><p>Try a different name or country.</p><button onClick={()=>{setQuery("");setCountry("All clubs");}}>Show all clubs</button></div>}</div><Link className="md-all-clubs" href="/search">Discover more clubs <ArrowRight size={15}/></Link></section>
    <section className="md-join"><div><span className="md-kicker">THE GAME IS BETTER TOGETHER.</span><h2>Your people.<br/><em>Your football.</em></h2><p>Save your favourite clubs and make Goalqube your own.</p><Link href="/signup" className="md-primary">Join the football world <ArrowUpRight size={16}/></Link></div><div className="md-join-art" aria-hidden="true"><FootballMark/><span className="md-join-orbit"/></div><Link href="/login" className="md-join-login">Already part of the game? Log in <ArrowRight size={14}/></Link></section>
    <footer className="md-footer"><div><Link href="/" aria-label="Goalqube home"><Brand/></Link><p>For the love of football.</p></div><nav aria-label="Footer navigation"><Link href="/matches">Matches</Link><Link href="/standings">Standings</Link><Link href="/news">News</Link><Link href="/worldcup">World Cup</Link></nav><span>© {new Date().getFullYear()} Goalqube</span><a href="#md-hero-heading" aria-label="Back to top"><ArrowUpRight size={20}/></a></footer>
   </div>
  </div>
 </main>;
}
