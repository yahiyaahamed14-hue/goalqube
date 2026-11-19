"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Menu, X } from "lucide-react";
import Brand from "./Brand";
const links = [
  ["Home", "/"],
  ["Matches", "/matches"],
  ["Champions League", "/tournaments"],
  ["Teams", "/search"],
  ["News", "/news"],
];
export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 100); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  return <header className={`gq-header ${scrolled ? "is-scrolled" : ""}`}><nav className="gq-nav" aria-label="Main navigation">
    <Link href="/" aria-label="Goalqube home"><Brand /></Link>
    <div className="gq-nav-links">
      {links.map(([label, href]) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
      ))}
    </div>
    <div className="gq-nav-actions">
      {user ? <>
        <Link className="gq-login" href="/profile">Profile</Link>
        <button className="gq-nav-cta" onClick={() => void signOut(auth)}>Sign out</button>
      </> : <>
        <Link className="gq-login" href="/login">Login</Link>
        <Link href="/signup" className="gq-nav-cta">Join Now</Link>
      </>}
      <button className="gq-menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="gq-mobile-menu" onClick={() => setOpen(!open)}>
        {open ? <X size={20}/> : <Menu size={20}/>}
      </button>
    </div>
    {open && <div id="gq-mobile-menu" className="gq-dropdown">
      {links.map(([label, href]) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>
      ))}
      <Link href={user ? "/profile" : "/login"} onClick={() => setOpen(false)}>{user ? "Profile" : "Login"}</Link>
    </div>}
  </nav></header>;
}
