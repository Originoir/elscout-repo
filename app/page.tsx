import { createClient } from '@supabase/supabase-js'

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  const { data: students, error } = await supabase
    .from('students')
    .select('id, name, class')
    .order('class', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error(error)
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>
      <ul>
        {students?.map((s) => (
          <li key={s.id}>
            {s.class} – {s.name} (ID: {s.id})
          </li>
        ))}
      </ul>
    </main>
  )
}
