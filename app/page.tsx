"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("students").select("*");
      if (error) console.error("Error fetching students:", error);
      else setStudents(data);
    };

    fetchStudents();
  }, []);

  return (
    <main style={{ padding: "20px", color: "white" }}>
      <h1>Student List</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name} — {student.class}
          </li>
        ))}
      </ul>
    </main>
  );
}
