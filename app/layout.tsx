// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Attendance App",
  description: "Manage student attendance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <div className="flex min-h-screen relative">
          {/* Sidebar controlled via props */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Navbar shown on mobile, opens sidebar */}
            <div className="md:hidden">
              <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            </div>

            <main className="flex-1 p-4 sm:p-6 overflow-x-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
