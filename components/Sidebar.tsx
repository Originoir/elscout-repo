import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Sidebar() {
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  return (
    <aside className="bg-gray-800 h-full min-h-screen w-64 p-6 flex flex-col gap-2">
      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="py-2 px-4 rounded hover:bg-gray-700 font-semibold"
        >
          Dashboard
        </Link>
        <button
          className="flex items-center justify-between py-2 px-4 rounded hover:bg-gray-700 font-semibold w-full text-left"
          onClick={() => setAttendanceOpen((open) => !open)}
        >
          <span>Attendance</span>
          {attendanceOpen ? (
            <FaChevronUp size={14} />
          ) : (
            <FaChevronDown size={14} />
          )}
        </button>
        {attendanceOpen && (
          <div className="ml-4 flex flex-col gap-1">
            <Link
              href="/attendance"
              className="py-2 px-4 rounded hover:bg-gray-700"
            >
              Sheet
            </Link>
            <Link
              href="/history"
              className="py-2 px-4 rounded hover:bg-gray-700"
            >
              History
            </Link>
          </div>
        )}
        <Link
          href="/students"
          className="py-2 px-4 rounded hover:bg-gray-700 font-semibold"
        >
          Students
        </Link>
      </nav>
    </aside>
  );
}