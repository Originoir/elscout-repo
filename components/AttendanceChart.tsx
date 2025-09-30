// app/components/AttendanceChart.tsx
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
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AttendanceStatus = "Hadir" | "Sakit" | "Izin" | "Alfa";
type ClassName = string;

type AttendanceBarData = {
  class: ClassName;
  Hadir: number;
  Sakit: number;
  Izin: number;
  Alfa: number;
};

interface AttendanceChartProps {
  selectedDate: string;
}

export default function AttendanceChart({ selectedDate }: AttendanceChartProps) {
  const [data, setData] = useState<AttendanceBarData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAttendance() {
      setLoading(true);
      // Get all attendance for the selected date, joined with students to get class
      const { data, error } = await supabase
        .from("attendance")
        .select("status,student_id,students(class)")
        .eq("date", selectedDate);

      if (error) {
        setData([]);
        setLoading(false);
        return;
      }

      // XE1 to XE9 and DA (XIF1-XIF9 combined)
      const xeClasses = Array.from({ length: 9 }, (_, i) => `XE${i + 1}`);
      const daLabel = "DA";
      const allClasses = [...xeClasses, daLabel];

      // Initialize counts
      const classStatusMap: Record<ClassName, AttendanceBarData> = {};
      for (const className of xeClasses) {
        classStatusMap[className] = {
          class: className,
          Hadir: 0,
          Sakit: 0,
          Izin: 0,
          Alfa: 0,
        };
      }
      // For DA (XIF1-XIF9 combined)
      classStatusMap[daLabel] = {
        class: daLabel,
        Hadir: 0,
        Sakit: 0,
        Izin: 0,
        Alfa: 0,
      };

      // Count statuses per class and for DA
      (data as any[]).forEach((row) => {
        const className = row.members?.class;
        const status = row.status as AttendanceStatus;
        if (
          className &&
          ["Hadir", "Sakit", "Izin", "Alfa"].includes(status)
        ) {
          if (classStatusMap[className]) {
            classStatusMap[className][status]++;
          }
          // If class is XIF1-XIF9, also add to DA
          if (/^XIF[1-9]$/.test(className)) {
            classStatusMap[daLabel][status]++;
          }
        }
      });

      setData(allClasses.map((c) => classStatusMap[c]));
      setLoading(false);
    }

    fetchAttendance();
  }, [selectedDate]);

  return (
    <div className="w-full h-[400px] bg-white rounded-2xl shadow p-4">
      {loading ? (
        <div className="text-center text-gray-500 mt-32">Loading chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="class" />
            <YAxis
              allowDecimals={false}
              label={{
                value: "Jumlah Siswa",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="Hadir" stackId="a" fill="#3B82F6" name="Hadir" />
            <Bar dataKey="Sakit" stackId="a" fill="#22C55E" name="Sakit" />
            <Bar dataKey="Izin" stackId="a" fill="#F59E0B" name="Izin" />
            <Bar dataKey="Alfa" stackId="a" fill="#EF4444" name="Alfa" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
