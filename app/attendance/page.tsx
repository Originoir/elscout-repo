"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AttendanceStatus = "Hadir" | "Sakit" | "Izin" | "Alfa" | "Libur";
const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Hadir: "text-blue-600",
  Sakit: "text-green-600",
  Izin: "text-orange-500",
  Alfa: "text-red-500",
  Libur: "text-gray-400",
};

type Student = {
  id: number;
  name: string;
  class: string;
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

export default function AttendanceSheetPage() {
  // Default date: today if Friday, else previous Friday
  const defaultDate = getLastFriday();
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedClass, setSelectedClass] = useState("XE1");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

  // Handle status change
  function handleStatusChange(studentId: number, status: AttendanceStatus) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  }

  // Set all students to Libur
  function handleSetAllLibur() {
    const newAttendance: Record<number, AttendanceStatus> = {};
    students.forEach((student) => {
      newAttendance[student.id] = "Libur";
    });
    setAttendance(newAttendance);
  }

  // Save attendance to database
  async function handleSaveAttendance() {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      // Prepare upsert data
      const rows = students.map((student) => ({
        date: selectedDate,
        student_id: student.id,
        status: attendance[student.id] || "Hadir",
      }));
      // Upsert attendance
      const { error } = await supabase.from("attendance").upsert(rows, {
        onConflict: "date,student_id",
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Attendance saved!");
      }
    } catch (err: any) {
      setErrorMsg("Failed to save attendance.");
    }
    setSaving(false);
  }

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Attendance Sheet</h1>
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
        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 font-semibold"
          type="button"
          onClick={handleSetAllLibur}
        >
          Set All Libur
        </button>
        <button
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold"
          onClick={handleSaveAttendance}
          disabled={saving}
        >
          {saving ? "Saving..." : "Input Attendance"}
        </button>
      </div>
      {successMsg && <div className="text-green-400 mb-2">{successMsg}</div>}
      {errorMsg && <div className="text-red-400 mb-2">{errorMsg}</div>}
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
                  <td className="py-2 px-4">
                    <select
                      className={`px-3 py-2 rounded font-semibold ${
                        STATUS_COLORS[
                          (attendance[student.id] as AttendanceStatus) || "Hadir"
                        ]
                      } bg-gray-900`}
                      value={attendance[student.id] || ""}
                      onChange={(e) =>
                        handleStatusChange(
                          student.id,
                          e.target.value as AttendanceStatus
                        )
                      }
                    >
                      <option value="">--</option>
                      <option value="Hadir" className="text-blue-600">
                        Hadir
                      </option>
                      <option value="Izin" className="text-orange-500">
                        Izin
                      </option>
                      <option value="Sakit" className="text-green-600">
                        Sakit
                      </option>
                      <option value="Alfa" className="text-red-500">
                        Alfa
                      </option>
                      {/* Do not add Libur to dropdown */}
                    </select>
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
