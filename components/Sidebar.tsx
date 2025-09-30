// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaBars, FaTimes } from "react-icons/fa";

type Props = {
  isOpen?: boolean;          // whether mobile overlay is open (passed from layout)
  onClose?: () => void;      // callback to close mobile overlay
};

export default function Sidebar({ isOpen = false, onClose }: Props) {
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ----------------- Desktop Sidebar (visible on md+) ----------------- */}
      <aside
        className={`hidden md:flex bg-gray-800 h-full min-h-screen transition-all duration-200 ${
          collapsed ? "w-16 p-2" : "w-64 p-6"
        } flex flex-col gap-2`}
      >
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
      </aside>

      {/* ----------------- Mobile Sidebar Overlay (controlled by isOpen) ----------------- */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => onClose?.()}
          />

          {/* side panel */}
          <div className="relative z-50 w-64 bg-gray-800 p-6 flex flex-col">
            <button
              className="mb-4 self-end text-gray-400 hover:text-white transition"
              onClick={() => onClose?.()}
              aria-label="Close sidebar"
            >
              <FaTimes size={20} />
            </button>

            <nav className="flex flex-col gap-2">
              <Link href="/dashboard" className="py-2 px-4 rounded hover:bg-gray-700 font-semibold" onClick={() => onClose?.()}>
                Dashboard
              </Link>

              <button
                className="flex items-center justify-between py-2 px-4 rounded hover:bg-gray-700 font-semibold w-full text-left"
                onClick={() => setAttendanceOpen((s) => !s)}
              >
                <span>Attendance</span>
                {attendanceOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </button>

              {attendanceOpen && (
                <div className="ml-4 flex flex-col gap-1">
                  <Link href="/attendance" className="py-2 px-4 rounded hover:bg-gray-700" onClick={() => onClose?.()}>
                    Sheet
                  </Link>
                  <Link href="/history" className="py-2 px-4 rounded hover:bg-gray-700" onClick={() => onClose?.()}>
                    History
                  </Link>
                </div>
              )}

              <Link href="/students" className="py-2 px-4 rounded hover:bg-gray-700 font-semibold" onClick={() => onClose?.()}>
                Students
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
