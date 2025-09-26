"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AttendanceStatus = "Hadir" | "Sakit" | "Izin" | "Alfa";
const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Hadir: "text-blue-600",
  Sakit: "text-green-600",
  Izin: "text-orange-500",
  Alfa: "text-red-500",
};

type Student = {
  id: number;
  name: string;
  class: string;
};

type AttendanceRow = {
  student_id: number;
  status: AttendanceStatus;
  date: string;
};

function getLastFriday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  // 5 = Friday
  const diff = day >= 5 ? day - 5 : 7 - (5 - day);
  d.setDate(d.getDate() - diff);
  return d.toISOString().split("T")[0];
}

const XE_CLASSES = Array.from({ length: 9 }, (_, i) => `XE${i + 1}`);
const ALL_CLASSES = [...XE_CLASSES, "DA"];

export default function AttendanceHistoryPage() {
  // Default date: today if Friday, else previous Friday
  const defaultDate = getLastFriday();
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedClass, setSelectedClass] = useState("XE1");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);

  // Fetch students for selected class
  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      let studentData: Student[] = [];
      if (selectedClass === "DA") {
        // DA = XIF1-XIF9
        const { data, error } = await supabase
          .from("students")
          .select("id,name,class")
          .ilike("class", "XIF%");
        if (!error && data) {
          studentData = data;
        }
      } else {
        const { data, error } = await supabase
          .from("students")
          .select("id,name,class")
          .eq("class", selectedClass);
        if (!error && data) {
          studentData = data;
        }
      }
      // Sort by name
      studentData.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(studentData);
      setLoading(false);
    }
    fetchStudents();
  }, [selectedClass]);

  // Fetch attendance for selected date and class
  useEffect(() => {
    async function fetchAttendance() {
      if (students.length === 0) {
        setAttendance({});
        return;
      }
      let ids = students.map((s) => s.id);
      const { data, error } = await supabase
        .from("attendance")
        .select("student_id,status")
        .eq("date", selectedDate)
        .in("student_id", ids);
      if (!error && data) {
        const att: Record<number, AttendanceStatus> = {};
        data.forEach((row: any) => {
          att[row.student_id] = row.status;
        });
        setAttendance(att);
      } else {
        setAttendance({});
      }
    }
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, selectedDate]);

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Attendance History</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div>
          <label className="block mb-1 text-gray-300">Date</label>
          <input
            type="date"
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Class</label>
          <select
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {ALL_CLASSES.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="py-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-4 text-center text-gray-400">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-700">
                  <td className="py-2 px-4">{student.name}</td>
                  <td className={`py-2 px-4 font-semibold ${STATUS_COLORS[attendance[student.id] as AttendanceStatus || "Hadir"]}`}>
                    {attendance[student.id] || "Hadir"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
