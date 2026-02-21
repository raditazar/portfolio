"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col lg:flex-row relative overflow-hidden">
      {/* Left — Brand Panel */}
      <div className="relative flex-1 flex flex-col justify-between p-8 lg:p-16 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-2/3 left-1/5 w-[300px] h-[300px] bg-indigo-500/6 rounded-full blur-[100px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Top — Logo */}
        <div className="relative z-10">
          <a href="/" className="inline-flex items-center gap-3 group">
            <Image
              src="/assets/dark_logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors">
              raditazar.com
            </span>
          </a>
        </div>

        {/* Center — Brand message */}
        <div className="relative z-10 max-w-md my-12 lg:my-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-medium text-zinc-400">Admin Panel</span>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
            Welcome
            <br />
            <span className="bg-linear-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Back.
            </span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-sm">
            Sign in to manage your portfolio, projects, and content.
          </p>

          {/* Decorative stats */}
          <div className="mt-12 flex gap-8">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-xs text-zinc-500">Access</p>
            </div>
            <div className="w-px bg-zinc-800" />
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">Secure</p>
              <p className="text-xs text-zinc-500">Encrypted</p>
            </div>
            <div className="w-px bg-zinc-800" />
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">Fast</p>
              <p className="text-xs text-zinc-500">Real-time</p>
            </div>
          </div>
        </div>

        {/* Bottom — Footer */}
        <div className="relative z-10">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Raditya Azhar Ananta
          </p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex items-center justify-center p-8 lg:p-16 relative">
        {/* Subtle border on left */}
        <div className="hidden lg:block absolute left-0 top-[10%] bottom-[10%] w-px bg-linear-to-b from-transparent via-zinc-700/50 to-transparent" />

        <div className="w-full max-w-sm">
          {/* Mobile-only header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-zinc-700/60 bg-zinc-900/80 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-400">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Sign In</h2>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Sign in to your account
            </h2>
            <p className="text-sm text-zinc-500">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/8 border border-red-500/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-2 tracking-widest uppercase">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 7L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/30 focus:bg-white/8 transition-all duration-200"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-zinc-400 mb-2 tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/30 focus:bg-white/8 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-900/25 hover:shadow-purple-900/40 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-zinc-800/50">
            <a
              href="/"
              className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
