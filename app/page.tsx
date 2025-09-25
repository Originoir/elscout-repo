"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Student = {
  id: number;
  name: string;
  class: string;
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("id, name, class")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching students:", error);
      } else {
        setStudents(data || []);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-200">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Student List</h1>

        {students.length === 0 ? (
          <p className="text-gray-500">No students found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Class</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 border-b text-gray-700">{s.id}</td>
                    <td className="px-4 py-2 border-b font-medium text-gray-800">
                      {s.name}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-600">{s.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
