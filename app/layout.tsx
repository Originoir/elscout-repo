import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

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
        <div className="flex min-h-screen">
          {/* Sidebar for larger screens */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            <div className="md:hidden">
              <Sidebar />
            </div>

            {/* Page content area */}
            <main className="flex-1 p-4 sm:p-6 overflow-x-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
