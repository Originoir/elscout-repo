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
    return <p style={{ color: "white", padding: "20px" }}>Loading...</p>;
  }

  return (
    <main style={{ padding: "20px", color: "white" }}>
      <h1>Student List</h1>
      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        <ul>
          {students.map((s) => (
            <li key={s.id}>
              {s.name} — {s.class}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
