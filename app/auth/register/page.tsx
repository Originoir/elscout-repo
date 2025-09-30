// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [memberId, setMemberId] = useState<string>(""); // optional: link to members.id
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "info" | "error"; text: string } | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    // sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMsg({ type: "error", text: error.message });
      setLoading(false);
      return;
    }

    // NOTE: data.user may be null if email confirmation flow is required.
    const user = data.user ?? (data as any).user;
    if (user && user.id) {
      try {
        // insert mapping in profiles table (optional)
        await supabase.from("profiles").upsert({
          id: user.id,
          email,
          member_id: memberId ? Number(memberId) : null,
        });
      } catch (err) {
        // non-fatal: profile insert failed
        console.warn("profile insert error", err);
      }
    }

    // Inform user to check email if confirmation required
    setMsg({
      type: "info",
      text:
        data?.user && data?.user.confirmed_at
          ? "Registration complete — logged in."
          : "Registration initiated. Check your email to confirm (if required).",
    });

    // Optionally redirect to a verify page or dashboard
    // router.push("/dashboard");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Optional: link to Member ID (if you want)
            </label>
            <input
              type="text"
              placeholder="member id (e.g. 123)"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty if you don't want to link to an existing member.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <a href="/auth/login" className="text-sm text-blue-600">
              Already have an account?
            </a>
          </div>

          {msg && (
            <div className={`text-sm mt-2 ${msg.type === "error" ? "text-red-600" : "text-green-600"}`}>
              {msg.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
