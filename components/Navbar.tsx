"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 md:hidden flex justify-between items-center">
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
        </div>
      )}
    </nav>
  );
}
