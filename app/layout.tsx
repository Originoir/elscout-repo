import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Attendance App",
  description: "Manage student attendance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        {/* Mobile Navbar */}
        <Navbar />

        <div className="flex">
          {/* Sidebar only on md+ screens */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
