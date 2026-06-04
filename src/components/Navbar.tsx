"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
        }
      );

    return () => unsubscribe();

  }, []);

  const handleLogout = async () => {

    await signOut(auth);

  };

  return (
    <nav className="flex items-center justify-between px-6 lg:px-16 py-4 border-b border-white/10 bg-black/70 backdrop-blur-xl sticky top-0 z-50">

      {/* Logo */}
      <Link
        href="/"
        className="text-3xl font-black text-yellow-400"
      >
        <div className="flex items-center">

          <img
            src="/logo.png"
            alt="GOALQUBE"
            className="h-30 w-auto object-contain"
          />

        </div>

      </Link>

      {/* Menu */}
      <div className="hidden md:flex items-center gap-8 text-sm font-bold">

        <Link
          href="/"
          className="hover:text-yellow-400 transition"
        >
          HOME
        </Link>

        <Link
          href="/matches"
          className="hover:text-yellow-400 transition"
        >
          MATCHES
        </Link>

        <Link
          href="/worldcup"
          className="hover:text-yellow-400 transition"
        >
          WORLD CUP
        </Link>

        <Link
          href="/standings"
          className="hover:text-yellow-400 transition"
        >
          STANDINGS
        </Link>

        <Link
          href="/search"
          className="hover:text-yellow-400 transition"
        >
          SEARCH
        </Link>

        <Link
          href="/news"
          className="hover:text-yellow-400 transition"
        >
          NEWS
        </Link>

        <Link
          href="/favorites"
          className="hover:text-yellow-400 transition"
        >
          FAVORITES
        </Link>

        <Link
          href="/stats"
          className="hover:text-yellow-400 transition"
        >
          STATS
        </Link>

        <Link
          href="/trophies"
          className="hover:text-yellow-400 transition"
        >
          TROPHIES
        </Link>

        <Link
          href="/watch"
          className="hover:text-yellow-400 transition"
        >
          WATCH
        </Link>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search..."
          className="hidden lg:block bg-white/5 border border-white/10 rounded-full px-5 py-2 outline-none text-sm"
        />

        {user ? (

          <div className="flex items-center gap-3">

            <Link
              href="/profile"
              className="text-yellow-400 font-bold"
            >
              PROFILE
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full font-bold"
            >
              LOGOUT
            </button>

          </div>

        ) : (

          <Link
            href="/login"
            className="bg-yellow-400 text-black px-5 py-2 rounded-full font-black hover:scale-105 transition"
          >
            LOGIN
          </Link>

        )}
      </div>

    </nav>
  );
}