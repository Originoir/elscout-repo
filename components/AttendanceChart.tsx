// app/components/StackedBarChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Room Revenue", English: 83, Korean: 7, Japanese: 6, Other: 4 },
  { name: "Room Nights", English: 74, Korean: 13, Japanese: 9, Other: 4 },
  { name: "Room Reservation", English: 88, Korean: 6, Japanese: 2, Other: 4 },
  { name: "R&R Traffic", English: 75, Korean: 11, Japanese: 8, Other: 6 },
  { name: "Traffic", English: 75, Korean: 11, Japanese: 8, Other: 6 },
];

export default function StackedBarChart() {
  return (
    <div className="w-full h-[400px] bg-white rounded-2xl shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} stackOffset="expand">
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend />

          {/* Adjusted color palette for modern clean look */}
          <Bar dataKey="English" stackId="a" fill="#3B82F6" /> {/* Blue-500 */}
          <Bar dataKey="Korean" stackId="a" fill="#EF4444" /> {/* Red-500 */}
          <Bar dataKey="Japanese" stackId="a" fill="#F59E0B" /> {/* Amber-500 */}
          <Bar dataKey="Other" stackId="a" fill="#10B981" /> {/* Emerald-500 */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
