"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, ChevronRight, CirclePlay, Globe2, Heart, Medal, Newspaper, Radio, Search, Shield, Trophy, Users, Zap } from "lucide-react";
import Navbar from "./Navbar";
import Brand, { GMark } from "./Brand";
import FootballGlobe from "./FootballGlobe";

const features = [
 { name: "Match centre", icon: Radio, title: "Every fixture. Every final whistle.", text: "See the latest results and upcoming fixtures, explore match details, and keep your matchday in one place.", href: "/matches", cta: "Explore matches", visual: "MATCHDAY / CONNECTED" },
 { name: "League tables", icon: BarChart3, title: "Follow the race, all the way to the top.", text: "Explore league standings and see where your club sits. From the opening weekend to the title race, keep the bigger picture in view.", href: "/standings", cta: "Explore standings", visual: "THE RACE / ON THE LINE" },
 { name: "Football news", icon: Newspaper, title: "Stay close to the stories that matter.", text: "Catch up on football headlines, discover the stories behind the game, and stay in the conversation.", href: "/news", cta: "Read the latest", visual: "THE GAME / BEYOND THE PITCH" },
 { name: "Your clubs", icon: Heart, title: "Your club. Your colours. Your world.", text: "Discover clubs, explore their history and trophies, and save your favorites. Make a little corner of football your own.", href: "/favorites", cta: "Find your favorites", visual: "YOUR CLUB / YOUR COLOURS" },
];
const satellites = [Radio,Trophy,Shield,BarChart3,Globe2,Heart];
function Circuit({ compact = false }: { compact?: boolean }) {
 return <div className={`gq-circuit ${compact ? "gq-circuit-compact" : ""}`} aria-hidden="true">
  <svg className="gq-wires" viewBox="0 0 1000 340" preserveAspectRatio="none"><defs><linearGradient id={compact ? "wire-small" : "wire-main"}><stop stopColor="#333"/><stop offset=".5" stopColor="#b54e24"/><stop offset="1" stopColor="#333"/></linearGradient></defs>{[0,1,2,3,4,5].map(i=><g key={i}><path d={`M500 160 H${350-i*23} L${275-i*23} ${70+i*37} H${80+i*14}`} /><path d={`M500 160 H${650+i*23} L${725+i*23} ${70+i*37} H${920-i*14}`} /></g>)}</svg>
  <div className="gq-chip"><GMark/><span>THE BEAUTIFUL GAME</span></div>
  {satellites.map((Icon,i)=><div className={`gq-satellite satellite-${i}`} key={i}><Icon size={19}/></div>)}
  <span className="gq-signal signal-one"/><span className="gq-signal signal-two"/><span className="gq-signal signal-three"/>
 </div>;
}

export default function FootballExperience() {
 const [active,setActive]=useState(0);
 const [intro,setIntro]=useState(true);
 const root=useRef<HTMLElement>(null);
 const feature=features[active];
 useEffect(()=>{ const timer=window.setTimeout(()=>setIntro(false),2350); return ()=>window.clearTimeout(timer); },[]);
 useEffect(()=>{ const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting) {entry.target.classList.add("is-visible"); observer.unobserve(entry.target);} }),{threshold:.12}); root.current?.querySelectorAll("[data-reveal]").forEach(el=>observer.observe(el)); return ()=>observer.disconnect(); },[]);
 function replayIntro() { setIntro(true); window.setTimeout(()=>setIntro(false),2350); }
 return <main ref={root} className="gq-home">
  {intro && <div className="gq-intro" aria-hidden="true"><div className="gq-intro-glow"/><div className="gq-intro-brand"><GMark/><span>OALQUBE</span></div><p>THE GAME STARTS HERE.</p><span className="gq-intro-line"/></div>}
  <div className="gq-announcement"><span className="gq-live-dot"/> One game. A whole world of football. <Link href="/worldcup">Explore World Cup <ArrowRight size={12}/></Link></div>
  <Navbar/>
  <section className="gq-hero" aria-labelledby="hero-title">
   <div className="gq-hero-grid"/><div className="gq-hero-beam"/><div className="gq-hero-beam beam-secondary"/>
   <div className="gq-hero-content"><span className="gq-eyebrow"><span className="gq-live-dot"/> For the love of the game</span>
    <h1 id="hero-title">Football. At the <span>centre of it all.</span></h1>
    <p>Every match. Every club. Every moment that matters.<br className="gq-desktop-break"/> Your world of football, brought together in Goalqube.</p>
    <div className="gq-actions"><Link href="/matches" className="gq-button gq-button-orange">Explore matches <ArrowUpRight size={16}/></Link><Link href="/watch" className="gq-button gq-button-text"><CirclePlay size={17}/> Watch football</Link></div>
   </div>
   <Circuit/>
   <div className="gq-hero-bottom"><span>BUILT FOR THE FANS. CONNECTED BY FOOTBALL.</span><a href="#discover" aria-label="Scroll to discover"><ArrowDown size={15}/> Scroll to explore</a><span className="gq-hero-index">01 — 05</span></div>
  </section>
  <section className="gq-discover gq-light" id="discover">
   <div className="gq-section-heading" data-reveal><span className="gq-eyebrow gq-eyebrow-light"><Zap size={12}/> The football experience</span><h2>Less searching.<br/>More of the game you love.</h2></div>
   <div className="gq-discover-grid" data-reveal>
    <div className="gq-light-art"><div className="gq-art-grid"/><div className="gq-art-beam"/><div className="gq-art-orbit"/><GMark className="gq-art-mark"/><div className="gq-art-caption"><span>ONE GAME. INFINITE CONNECTIONS.</span><h3>{feature.visual.split(" / ")[0]}<br/>{feature.visual.split(" / ")[1]}.</h3><ArrowUpRight size={23}/></div></div>
    <div className="gq-discover-copy"><span className="gq-section-number">01 / DISCOVER GOALQUBE</span><div key={active} className="gq-feature-description"><h3>{feature.title}</h3><p>{feature.text}</p><Link href={feature.href}>{feature.cta} <ArrowUpRight size={17}/></Link></div>
     <div className="gq-feature-tabs" role="tablist" aria-label="Explore football features">{features.map((item,i)=><button key={item.name} role="tab" aria-selected={active===i} id={`feature-tab-${i}`} aria-controls="feature-panel" onClick={()=>setActive(i)} onKeyDown={e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault(); const next=(i+(e.key==="ArrowRight"?1:features.length-1))%features.length;setActive(next);document.getElementById(`feature-tab-${next}`)?.focus();}}}><item.icon size={16}/>{item.name}</button>)}</div><div id="feature-panel" role="tabpanel" aria-labelledby={`feature-tab-${active}`} className="gq-sr-only">{feature.title} {feature.text}</div>
    </div>
   </div>
   <div className="gq-league-strip" aria-label="Explore league standings"><span>THE LEAGUES YOU LOVE</span>{["Premier League","LALIGA","CHAMPIONS LEAGUE","SERIE A","BUNDESLIGA"].map((name,i)=><Link href="/standings" key={name}>{i===0?<Shield size={20}/>:i===2?<Trophy size={20}/>:<Medal size={20}/>} {name}</Link>)}</div>
  </section>
  <section className="gq-potential" id="experience">
   <div className="gq-section-heading" data-reveal><span className="gq-eyebrow"><span className="gq-live-dot"/> More than ninety minutes</span><h2>Unlock your<br/>whole football universe.</h2><p>From the first whistle to the stories that stay with you.</p></div>
   <div className="gq-bento">
    <Link href="/worldcup" className="gq-card gq-card-world" data-reveal><div className="gq-card-copy"><span className="gq-section-number">THE WORLD'S GAME</span><h3>A global game.<br/>A world to explore.</h3><p>Explore the World Cup, discover host cities,<br/>and follow football across borders.</p></div><FootballGlobe small/><span className="gq-card-arrow"><ArrowUpRight size={18}/></span><span className="gq-map-line map-line-one"/><span className="gq-map-line map-line-two"/></Link>
    <Link href="/search" className="gq-card gq-card-connect" data-reveal><Circuit compact/><div className="gq-card-copy"><h3>One place. Every side of football.</h3><p>Your clubs, players, trophies and stories.<br/>Discover what connects you to the game.</p></div><span className="gq-card-arrow"><ArrowUpRight size={18}/></span></Link>
    <Link href="/favorites" className="gq-card gq-card-fans" data-reveal><div className="gq-card-copy"><Heart size={21}/><h3>Wear your heart.<br/>Follow your club.</h3><p>Save the teams you love.<br/>Keep your football world close.</p></div><div className="gq-orbital-heart" aria-hidden="true"><Heart size={33}/><i/><i/><i/></div><span className="gq-card-arrow"><ArrowUpRight size={18}/></span></Link>
    <Link href="/stats" className="gq-card gq-card-stats" data-reveal><div className="gq-card-copy"><BarChart3 size={21}/><h3>The game, in detail.</h3><p>Explore the players behind the moments.</p></div><div className="gq-stat-bars" aria-hidden="true">{[28,44,35,62,50,76,67,95,82,110,102,132].map((height,i)=><i style={{height}} key={i}/>)}</div><span className="gq-card-arrow"><ArrowUpRight size={18}/></span></Link>
    <Link href="/trophies" className="gq-card gq-card-trophy" data-reveal><div className="gq-card-copy"><Trophy size={21}/><h3>History. Made legendary.</h3><p>The silverware. The legacy. The beautiful game.</p></div><div className="gq-trophy-art" aria-hidden="true"><Trophy size={100} strokeWidth={.8}/></div><span className="gq-card-arrow"><ArrowUpRight size={18}/></span></Link>
   </div>
  </section>
  <section className="gq-world-section" id="world">
   <div className="gq-section-heading" data-reveal><span className="gq-eyebrow"><Globe2 size={12}/> Connected by football</span><h2>A truly global game.<br/><span>One shared passion.</span></h2><p>Different cities. Different colours. The same beautiful game.</p></div>
   <div className="gq-world-art"><FootballGlobe/><span className="gq-world-label label-europe"><span className="gq-live-dot"/> EUROPE</span><span className="gq-world-label label-americas"><span className="gq-live-dot"/> THE AMERICAS</span><span className="gq-world-label label-asia"><span className="gq-live-dot"/> ASIA & BEYOND</span></div>
   <Link className="gq-world-link" href="/worldcup">Explore the World Cup <ArrowUpRight size={16}/></Link>
  </section>
  <section className="gq-start gq-light" id="join"><div className="gq-section-heading" data-reveal><span className="gq-eyebrow gq-eyebrow-light"><GMark/> Your next matchday starts here</span><h2>Experience it all.</h2><p>Follow your passion. Find your people. Make the game yours.</p></div>
   <div className="gq-feature-icons" aria-hidden="true">{[Radio,Trophy,Heart,Shield,BarChart3,Globe2,Users].map((Icon,i)=><Icon key={i} size={21}/>)}</div>
   <div className="gq-start-panel" data-reveal><div className="gq-start-halo"/><span className="gq-large-brand"><GMark/></span><h3>Welcome to your<br/>football universe.</h3><p>The game never stops. Neither does your passion.</p><Link className="gq-button gq-button-orange" href="/signup">Join Goalqube <ArrowUpRight size={16}/></Link><Link className="gq-start-browse" href="/matches">Or explore the matches <ArrowRight size={14}/></Link></div>
  </section>
  <footer className="gq-footer"><div className="gq-footer-top"><Link href="/" aria-label="Goalqube home"><Brand/></Link><p>For the love of the beautiful game.</p><a href="#hero-title">Back to top <ArrowUpRight size={15}/></a></div><div className="gq-footer-bottom"><span>© {new Date().getFullYear()} Goalqube</span><div><Link href="/matches">Matches</Link><Link href="/news">News</Link><Link href="/search"><Search size={12}/> Find a club</Link><button onClick={replayIntro}>Replay intro <ChevronRight size={12}/></button></div><span>ONE GAME. ONE WORLD.</span></div></footer>
 </main>;
}

