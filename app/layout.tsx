"use client";

import "./globals.css";
import type { Metadata } from "next";
import CardNav, { CardNavItem } from "@/components/CardNav";

export const metadata: Metadata = {
  title: "Attendance App",
  description: "Manage student attendance",
};

const navItems: CardNavItem[] = [
  {
    label: "Dashboard",
    bgColor: "#1E293B",
    textColor: "#fff",
    links: [
      { label: "Home", href: "/", ariaLabel: "Go to Home" },
      { label: "Attendance", href: "/attendance", ariaLabel: "Go to Attendance" },
    ],
  },
  {
    label: "Students",
    bgColor: "#0369A1",
    textColor: "#fff",
    links: [
      { label: "List", href: "/students", ariaLabel: "Go to Students list" },
      { label: "Reports", href: "/reports", ariaLabel: "Go to Reports" },
    ],
  },
  {
    label: "Settings",
    bgColor: "#15803D",
    textColor: "#fff",
    links: [
      { label: "Profile", href: "/profile", ariaLabel: "Go to Profile" },
      { label: "Config", href: "/settings", ariaLabel: "Go to Settings" },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <CardNav
          logo="/logo.svg"
          logoAlt="Eleven Scout"
          items={navItems}
          baseColor="#111827"
          menuColor="#fff"
          buttonBgColor="#3B82F6"
          buttonTextColor="#fff"
        />

        <main className="pt-24 px-4">{children}</main>
      </body>
    </html>
  );
}
