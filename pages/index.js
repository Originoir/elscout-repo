import { supabase } from "../lib/supabaseClient";

export default function Home({ students }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1">ID</th>
            <th className="border border-gray-300 px-2 py-1">Name</th>
            <th className="border border-gray-300 px-2 py-1">Class</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="border border-gray-300 px-2 py-1">{s.id}</td>
              <td className="border border-gray-300 px-2 py-1">{s.name}</td>
              <td className="border border-gray-300 px-2 py-1">{s.class}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function getServerSideProps() {
  const { data: students, error } = await supabase
    .from("students")
    .select("id, name, class")
    .order("class", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    return { props: { students: [] } };
  }

  return {
    props: { students },
  };
}
