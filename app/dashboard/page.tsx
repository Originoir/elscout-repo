"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaSearch } from "react-icons/fa";
import AttendanceChart from "@/components/AttendanceChart";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AttendanceStatus = "Hadir" | "Sakit" | "Izin" | "Alfa" | "Libur";

type AttendanceCounts = {
  Hadir: number;
  Sakit: number;
  Izin: number;
  Alfa: number;
};

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [counts, setCounts] = useState<AttendanceCounts>({
    Hadir: 0,
    Sakit: 0,
    Izin: 0,
    Alfa: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAttendanceCounts() {
      setLoading(true);
      console.log("Selected date:", selectedDate);
      const { data, error } = await supabase
        .from("attendance")
        .select("status", { count: "exact", head: false })
        .eq("date", selectedDate);

      if (error) {
        setCounts({ Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0 });
        setLoading(false);
        return;
      }

      // Count each status
      const statusCounts: AttendanceCounts = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0 };
      data?.forEach((row: { status: AttendanceStatus }) => {
        if (row.status in statusCounts) {
          statusCounts[row.status as keyof AttendanceCounts]++;
        }
      });
      setCounts(statusCounts);
      setLoading(false);
    }

    fetchAttendanceCounts();
  }, [selectedDate]);

  return (
    <div className="p-6 sm:p-6">
      {/* Date Picker */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label htmlFor="date" className="text-base sm:text-lg font-medium text-gray-700">
          Pilih Tanggal:
        </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border rounded-md px-2 py-1 text-gray-900"
        />
        {loading && <span className="ml-2 text-gray-400 text-sm sm:text-base">Loading...</span>}
      </div>

      {/* Top stats cards (Hadir, Sakit, Izin, Alfa) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-blue-600 font-medium text-sm sm:text-base">Hadir | {selectedDate}</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{counts.Hadir}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-green-600 font-medium text-sm sm:text-base">Sakit | {selectedDate}</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{counts.Sakit}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-orange-500 font-medium text-sm sm:text-base">Izin | {selectedDate}</h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-500">{counts.Izin}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4 text-center">
          <h3 className="text-red-500 font-medium text-sm sm:text-base">Alfa | {selectedDate}</h3>
          <p className="text-2xl sm:text-3xl font-bold text-red-500">{counts.Alfa}</p>
        </div>
      </div>

      {/* Attendance Chart */}
      <AttendanceChart selectedDate={selectedDate} />
    </div>
  );
}
