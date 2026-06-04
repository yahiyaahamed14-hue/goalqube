"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login successful!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8">

        <p className="text-yellow-400 font-bold tracking-[4px]">
          GOALQUBE
        </p>

        <h1 className="text-4xl font-black mt-4">
          Welcome Back
        </h1>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 text-white rounded-xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 text-white rounded-xl px-4 py-3"
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-black py-3 rounded-xl"
          >
            LOGIN
          </button>
        </form>

        <p className="text-zinc-400 text-center mt-6">
          Don't have an account?
          <Link
            href="/signup"
            className="text-yellow-400 ml-2"
          >
            Sign Up
          </Link>
        </p>

      </div>

    </main>
  );
}