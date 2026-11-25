"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Brand from "@/components/Brand";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setStatus("");
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setStatus("Login successful.");
    } catch (error: any) {
      setStatus(error.message || "We could not sign you in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="md-page md-inner-page gq-auth-page min-h-screen flex items-center justify-center px-6">
      <span className="gq-auth-decoration gq-auth-decoration-one" aria-hidden="true" />
      <span className="gq-auth-decoration gq-auth-decoration-two" aria-hidden="true" />
      <section className="gq-auth-card" aria-labelledby="login-title">
        <div className="gq-auth-topline">
          <Link href="/" className="gq-auth-brand" aria-label="Goalqube home"><Brand /></Link>
          <Link href="/" className="gq-auth-home-link"><ArrowLeft size={15} aria-hidden="true" /> Home</Link>
        </div>

        <div className="gq-auth-intro">
          <p>WELCOME BACK</p>
          <h1 id="login-title">Log in<span>.</span></h1>
          <span>Pick up where the match left off.</span>
        </div>

        <form onSubmit={handleLogin} className="gq-auth-form">
          <label className="gq-auth-field">
            <span>Email address</span>
            <span className="gq-auth-input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </span>
          </label>

          <label className="gq-auth-field">
            <span>Password</span>
            <span className="gq-auth-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="gq-auth-reveal" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          <button type="submit" className="gq-auth-submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Log in"}
            {!submitting && <ArrowRight size={18} aria-hidden="true" />}
          </button>
          {status && <p className="gq-auth-status" role="status">{status}</p>}
        </form>

        <p className="gq-auth-signup">New to Goalqube? <Link href="/signup">Create your account <ArrowRight size={15} aria-hidden="true" /></Link></p>
        <p className="gq-auth-footnote"><span /> ONE GAME. EVERY ANGLE.</p>
      </section>
    </main>
  );
}
