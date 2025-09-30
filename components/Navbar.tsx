// components/Navbar.tsx
"use client";

import { FaBars } from "react-icons/fa";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="md:hidden flex items-center justify-between bg-gray-800 p-4">
      <button onClick={onMenuClick} aria-label="Open sidebar" className="text-white">
        <FaBars size={20} />
      </button>
      <h1 className="text-lg font-bold">Attendance App</h1>
      <div /> {/* placeholder for right-side items */}
    </div>
  );
}
