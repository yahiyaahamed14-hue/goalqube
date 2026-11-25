"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import Brand from "./Brand";
const links = [
  ["Home", "/"],
  ["Matches", "/matches"],
  ["Leagues", "/standings"],
  ["News", "/news"],
  ["About Us", "/about"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => { const update = () => setScrolled(window.scrollY > 100); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  return <header className={`gq-header ${scrolled ? "is-scrolled" : ""}`}><nav className="gq-nav" aria-label="Main navigation">
    <Link href="/" aria-label="Goalqube home"><Brand wordmarkOnly /></Link>
    <form className="gq-nav-search" action="/search" role="search">
      <Search size={16} aria-hidden="true" />
      <input name="q" type="search" placeholder="Search clubs across leagues" aria-label="Search clubs across leagues" />
      <button type="submit" aria-label="Submit club search"><Search size={15} aria-hidden="true" /></button>
    </form>
    <div className="gq-nav-links">
      {links.map(([label, href]) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
      ))}
    </div>
    <div className="gq-nav-actions">
      <button className="gq-search-toggle" type="button" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} aria-controls="gq-mobile-search" onClick={() => setSearchOpen(!searchOpen)}>
        {searchOpen ? <X size={19} /> : <Search size={19} />}
      </button>
      <Link className="gq-login-button" href="/login" aria-current={pathname === "/login" ? "page" : undefined}>Login</Link>
      <button className="gq-menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="gq-mobile-menu" onClick={() => setOpen(!open)}>
        {open ? <X size={20}/> : <Menu size={20}/>}
      </button>
    </div>
    {searchOpen && <form id="gq-mobile-search" className="gq-mobile-search" action="/search" role="search">
      <Search size={17} aria-hidden="true" />
      <input autoFocus name="q" type="search" placeholder="Search clubs across leagues" aria-label="Search clubs across leagues" />
      <button type="submit" aria-label="Submit club search"><Search size={15} aria-hidden="true" /></button>
    </form>}
    {open && <div id="gq-mobile-menu" className="gq-dropdown">
      {links.map(([label, href]) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>
      ))}
    </div>}
  </nav></header>;
}
