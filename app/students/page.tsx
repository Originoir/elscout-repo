"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
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

type ClassRow = {
  class: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // Add/Edit student form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addId, setAddId] = useState("");
  const [addName, setAddName] = useState("");
  const [addClass, setAddClass] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // CSV upload state
  const [csvError, setCsvError] = useState("");
  const [csvSuccess, setCsvSuccess] = useState("");

  // Class list from DB
  const [classList, setClassList] = useState<string[]>([]);

  // Fetch students from Supabase
  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      let query = supabase
        .from("students")
        .select("id,name,class")
        .order("class", { ascending: true })
        .order("name", { ascending: true });

      if (classFilter) {
        query = query.eq("class", classFilter);
      }

      const { data, error } = await query;
      if (!error && data) {
        setStudents(data);
      } else {
        setStudents([]);
      }
      setLoading(false);
    }
    fetchStudents();
  }, [classFilter, addSuccess, csvSuccess]);

  // Fetch class list from Supabase
  useEffect(() => {
    async function fetchClasses() {
      const { data, error } = await supabase
        .from("classes")
        .select("class")
        .order("class", { ascending: true });
      if (!error && data) {
        setClassList(data.map((row: ClassRow) => row.class));
      }
    }
    fetchClasses();
  }, []);

  // Filtered students by search
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle add or edit student
  async function handleAddOrEditStudent(e: FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    if (!addId || !addName || !addClass) {
      setAddError("All fields are required.");
      return;
    }
    if (!classList.includes(addClass)) {
      setAddError("Class must be selected from the list.");
      return;
    }
    if (editId !== null) {
      // Edit mode
      const { error } = await supabase
        .from("students")
        .update({
          id: Number(addId),
          name: addName,
          class: addClass,
        })
        .eq("id", editId);
      if (error) {
        setAddError(error.message);
      } else {
        setAddSuccess("Student updated!");
        setAddId("");
        setAddName("");
        setAddClass("");
        setShowAddForm(false);
        setEditId(null);
      }
    } else {
      // Add mode
      const { error } = await supabase.from("students").insert([
        {
          id: Number(addId),
          name: addName,
          class: addClass,
        },
      ]);
      if (error) {
        setAddError(error.message);
      } else {
        setAddSuccess("Student added!");
        setAddId("");
        setAddName("");
        setAddClass("");
        setShowAddForm(false);
      }
    }
  }

  // Handle edit button
  function handleEdit(student: Student) {
    setShowAddForm(true);
    setEditId(student.id);
    setAddId(student.id.toString());
    setAddName(student.name);
    setAddClass(student.class);
    setAddError("");
    setAddSuccess("");
  }

  // Handle delete student
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      setAddError(error.message);
    } else {
      setAddSuccess("Student deleted!");
    }
  }

  // Handle CSV upload
  async function handleCsvUpload(e: ChangeEvent<HTMLInputElement>) {
    setCsvError("");
    setCsvSuccess("");
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        // Split and parse CSV
        const rows = text
          .split("\n")
          .map((row) => row.trim())
          .filter(Boolean)
          .map((row) => row.split(","));
        // Detect header and columns
        let startIdx = 0;
        let hasGen = false;
        if (
          rows[0][0].toLowerCase() === "id" &&
          rows[0][1].toLowerCase() === "class" &&
          rows[0][2].toLowerCase() === "name"
        ) {
          hasGen = rows[0][3]?.toLowerCase() === "gen";
          startIdx = 1;
        }
        const studentsToInsert = rows.slice(startIdx).map((cols) => {
          const [id, cls, name, gen] = cols;
          return {
            id: Number(id),
            name: name?.trim(),
            class: cls?.trim(),
            ...(hasGen && gen ? { gen: Number(gen) } : {}),
          };
        });
        // Filter out invalid rows and classes not in classList
        const validStudents = studentsToInsert.filter(
          (s) => s.id && s.name && s.class && classList.includes(s.class)
        );
        if (validStudents.length === 0) {
          setCsvError("No valid students found in CSV or class not in list.");
          return;
        }
        const { error } = await supabase.from("students").insert(validStudents);
        if (error) {
          setCsvError(error.message);
        } else {
          setCsvSuccess(`Added ${validStudents.length} students!`);
        }
      } catch (err) {
        setCsvError("Failed to parse CSV.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-3 py-2 rounded bg-gray-700 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded bg-gray-700 text-white"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="">All Classes</option>
          {classList.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold"
          onClick={() => {
            setShowAddForm((v) => !v);
            setEditId(null);
            setAddId("");
            setAddName("");
            setAddClass("");
            setAddError("");
            setAddSuccess("");
          }}
        >
          {showAddForm && editId === null
            ? "Cancel"
            : editId !== null
            ? "Cancel Edit"
            : "Add Student"}
        </button>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 font-semibold">
            Upload CSV
          </span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCsvUpload}
          />
        </label>
      </div>
      {addError && <div className="text-red-400 mb-2">{addError}</div>}
      {addSuccess && <div className="text-green-400 mb-2">{addSuccess}</div>}
      {csvError && <div className="text-red-400 mb-2">{csvError}</div>}
      {csvSuccess && <div className="text-green-400 mb-2">{csvSuccess}</div>}
      {showAddForm && (
        <form
          onSubmit={handleAddOrEditStudent}
          className="mb-4 flex flex-col md:flex-row gap-2 items-start"
        >
          <input
            type="number"
            placeholder="ID"
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={addId}
            onChange={(e) => setAddId(e.target.value)}
            required
            disabled={editId !== null}
          />
          <input
            type="text"
            placeholder="Name"
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            required
          />
          <select
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={addClass}
            onChange={(e) => setAddClass(e.target.value)}
            required
          >
            <option value="">Select Class</option>
            {classList.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            {editId !== null ? "Update" : "Save"}
          </button>
        </form>
      )}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Class</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-700">
                    <td className="py-2 px-4">{student.id}</td>
                    <td className="py-2 px-4">{student.name}</td>
                    <td className="py-2 px-4">{student.class}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        className="px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 font-semibold"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
