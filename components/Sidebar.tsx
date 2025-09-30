"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaBars } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function Sidebar() {
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <aside
      className={`bg-gray-800 h-full min-h-screen transition-all duration-200 ${
        collapsed ? "w-16 p-2" : "w-64 p-6"
      } flex flex-col justify-between`}
    >
      <div>
        <button
          className="mb-4 self-end text-gray-400 hover:text-white transition"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaBars size={20} />
        </button>

        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className={`py-2 px-4 rounded hover:bg-gray-700 font-semibold ${
              collapsed ? "px-2 text-center" : ""
            }`}
          >
            {collapsed ? "🏠" : "Dashboard"}
          </Link>

          <button
            className={`flex items-center justify-between py-2 px-4 rounded hover:bg-gray-700 font-semibold w-full text-left ${
              collapsed ? "px-2 justify-center" : ""
            }`}
            onClick={() => setAttendanceOpen((open) => !open)}
            disabled={collapsed}
          >
            <span>{collapsed ? "🗒️" : "Attendance"}</span>
            {!collapsed &&
              (attendanceOpen ? (
                <FaChevronUp size={14} />
              ) : (
                <FaChevronDown size={14} />
              ))}
          </button>

          {!collapsed && attendanceOpen && (
            <div className="ml-4 flex flex-col gap-1">
              <Link href="/attendance" className="py-2 px-4 rounded hover:bg-gray-700">
                Sheet
              </Link>
              <Link href="/history" className="py-2 px-4 rounded hover:bg-gray-700">
                History
              </Link>
            </div>
          )}

          <Link
            href="/students"
            className={`py-2 px-4 rounded hover:bg-gray-700 font-semibold ${
              collapsed ? "px-2 text-center" : ""
            }`}
          >
            {collapsed ? "👥" : "Students"}
          </Link>
        </nav>
      </div>

      {/* Auth Section at bottom */}
      <div className="mt-4 border-t border-gray-700 pt-2">
        {user ? (
          <>
            {!collapsed && (
              <span className="block text-sm text-gray-400 px-2 mb-2">
                Hi, {user.email}
              </span>
            )}
            <button
              onClick={async () => await supabase.auth.signOut()}
              className={`w-full py-2 ${collapsed ? "text-sm" : "px-4"} bg-red-600 hover:bg-red-700 rounded`}
            >
              {collapsed ? "🚪" : "Logout"}
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className={`py-2 ${collapsed ? "text-center" : "px-4"} bg-blue-600 hover:bg-blue-700 rounded`}
            >
              {collapsed ? "🔑" : "Login"}
            </Link>
            <Link
              href="/register"
              className={`py-2 ${collapsed ? "text-center" : "px-4"} bg-green-600 hover:bg-green-700 rounded`}
            >
              {collapsed ? "➕" : "Register"}
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
