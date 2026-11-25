import Link from "next/link";
import { ArrowRight, BarChart3, CirclePlay, Newspaper, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Goalqube — For the love of football",
  description: "Goalqube brings matches, clubs, leagues, players and football stories together for fans.",
};

const pillars = [
  {
    icon: CirclePlay,
    title: "Follow every match",
    copy: "Find live action, upcoming fixtures and results from the leagues you follow.",
    href: "/matches",
    action: "Explore matches",
  },
  {
    icon: Shield,
    title: "Get closer to every club",
    copy: "Discover teams, their stories and the players who make each club special.",
    href: "/search",
    action: "Find a club",
  },
  {
    icon: Newspaper,
    title: "See the bigger picture",
    copy: "Keep up with league tables, player stats and football stories in one place.",
    href: "/news",
    action: "Read football news",
  },
];

export default function AboutPage() {
  return (
    <main className="md-page md-inner-page min-h-screen">
      <Navbar />
      <section className="md-inner-content gq-about" aria-labelledby="about-title">
        <div className="gq-about-hero">
          <div className="gq-about-copy">
            <span className="gq-about-kicker"><i /> THE GOALQUBE STORY</span>
            <h1 id="about-title">Football is more than a game.</h1>
            <p className="gq-about-lede">
              It is the clubs we stand by, the moments we share and the stories that stay with us.
              Goalqube brings your football world together in one place.
            </p>
            <Link className="gq-about-cta" href="/matches">Explore the match centre <ArrowRight size={16} /></Link>
          </div>
          <div className="gq-about-mark" aria-hidden="true"><div className="gq-about-pitch"><i/><i/><i/><i/></div><span>ONE GAME</span><strong>EVERY<br />ANGLE.</strong><i /></div>
        </div>

        <div className="gq-about-intro">
          <div><span className="gq-about-label">OUR PURPOSE</span><h2>Your football world, brought together.</h2></div>
          <p>
            Goalqube is a home for football fans to follow the game from every angle. Check a score,
            follow a league, discover a club or catch up on the latest stories—all without losing
            sight of what makes football special: the people and moments we share.
          </p>
        </div>

        <div className="gq-about-pillars" aria-label="What you can do on Goalqube">
          {pillars.map(({ icon: Icon, title, copy, href, action }, index) => (
            <article className={`gq-about-card gq-about-card--${index + 1}`} key={title}>
              <span className="gq-about-card-art" aria-hidden="true"><i/></span>
              <div className="gq-about-card-top"><span>0{index + 1} / THE GAME</span><Icon size={19} strokeWidth={1.7} /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <Link href={href}>{action}<ArrowRight size={14} /></Link>
            </article>
          ))}
        </div>

        <div className="gq-about-finale">
          <div><BarChart3 size={19} /><span>FOR THE LOVE OF FOOTBALL</span></div>
          <p>Every match. Every club. Every moment that matters.</p>
          <Link href="/standings">See the league tables <ArrowRight size={14} /></Link>
        </div>
      </section>
    </main>
  );
}
