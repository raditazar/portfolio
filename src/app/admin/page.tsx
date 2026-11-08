"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/admin/Button";
import { Field, Input } from "@/components/admin/Field";
import { SplitHighlight } from "@/components/ui/split-highlight";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-canvas-hero flex flex-col lg:flex-row lg:items-center lg:justify-between gap-16 px-6 py-16 md:px-12 lg:px-20">
      {/* Brand panel */}
      <div className="order-2 lg:order-1 flex-1">
        <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-8">
          Admin / Sign in
        </p>

        <div className="font-serif font-black text-white text-[clamp(3rem,8vw,7rem)] leading-[0.95]">
          <div>Welcome</div>
          <SplitHighlight
            as="h1"
            wrapperClassName="w-fit"
            className="font-serif font-black text-white text-[clamp(3rem,8vw,7rem)] leading-[0.95]"
            rect={{ top: "55%", left: "-0.1em", right: "-0.1em", bottom: "0.05em" }}
          >
            Back.
          </SplitHighlight>
        </div>

        <p className="mt-8 max-w-sm text-white/60">
          Sign in to manage projects, career and site content.
        </p>
      </div>

      {/* Form panel */}
      <div className="order-1 lg:order-2 w-full max-w-md rounded-3xl bg-canvas-surface p-8 md:p-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div
              role="alert"
              className="rounded-xl bg-danger-surface text-danger px-4 py-3 text-sm"
            >
              {error}
            </div>
          )}

          <Field label="Email">
            {(props) => (
              <Input
                {...props}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                placeholder="admin@example.com"
              />
            )}
          </Field>

          <Field label="Password">
            {(props) => (
              <div className="relative">
                <Input
                  {...props}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Your password"
                  className="pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            )}
          </Field>

          <Button type="submit" variant="primary" loading={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 flex justify-center">
          <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
