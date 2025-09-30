// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg({ type: "error", text: error.message });
      setLoading(false);
      return;
    }

    // logged in successfully
    setMsg({ type: "info", text: "Login successful. Redirecting…" });

    // optional: you may want to wait a bit then push
    router.push("/dashboard");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <a href="/auth/register" className="text-sm text-blue-600">Create account</a>
          </div>

          {msg && <div className={`text-sm mt-2 ${msg.type === "error" ? "text-red-600" : "text-green-600"}`}>{msg.text}</div>}
        </form>
      </div>
    </div>
  );
}
