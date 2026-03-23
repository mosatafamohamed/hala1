"use client";
export const dynamic = "force-dynamic";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate/45 p-4">
      <section className="surface-card-strong w-full max-w-md p-8">
        <p className="badge-premium">1Hala CMS</p>
        <h1 className="mt-4 text-3xl font-bold text-navy">Admin Login</h1>
        <p className="mt-2 text-sm text-navy/70">Sign in with your admin account to manage content.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Email</span>
            <input
              type="email"
              className="w-full rounded-soft border border-border bg-white px-4 py-3 text-sm text-navy focus:border-bronze/50 focus:outline-none focus:ring-2 focus:ring-bronze/20"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">Password</span>
            <input
              type="password"
              className="w-full rounded-soft border border-border bg-white px-4 py-3 text-sm text-navy focus:border-bronze/50 focus:outline-none focus:ring-2 focus:ring-bronze/20"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error ? <p className="rounded-soft border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}

