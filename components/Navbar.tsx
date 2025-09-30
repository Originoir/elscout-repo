"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 md:hidden flex justify-between items-center relative">
      {/* Left: Logo */}
      <span className="font-bold">Attendance</span>

      {/* Right: Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 flex flex-col gap-2 p-4 shadow-lg z-50">
          <Link href="/dashboard" className="py-2 hover:bg-gray-700 rounded px-4">
            Dashboard
          </Link>

          <button
            className="flex justify-between items-center py-2 px-4 hover:bg-gray-700 rounded"
            onClick={() => setAttendanceOpen(!attendanceOpen)}
          >
            <span>Attendance</span>
            {attendanceOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>

          {attendanceOpen && (
            <div className="ml-4 flex flex-col gap-1">
              <Link href="/attendance" className="py-2 px-4 hover:bg-gray-700 rounded">
                Sheet
              </Link>
              <Link href="/history" className="py-2 px-4 hover:bg-gray-700 rounded">
                History
              </Link>
            </div>
          )}

          <Link href="/students" className="py-2 hover:bg-gray-700 rounded px-4">
            Students
          </Link>

          {/* Auth Section */}
          <div className="mt-4 border-t border-gray-700 pt-2">
            {user ? (
              <>
                <span className="block text-sm text-gray-400 px-4 mb-2">
                  Hi, {user.email}
                </span>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded text-center mb-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
