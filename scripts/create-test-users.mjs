import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zkiyqgfjlofxfgnzkqk.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_9qfhv0iXhVvaZq44G9JLQg_WPputyov'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const users = [
  { email: 'admin@anaesthesia.test', password: 'Admin1234!', full_name: 'Admin User', role: 'admin' },
  { email: 'supervisor@anaesthesia.test', password: 'Super1234!', full_name: 'Dr. Sarah Supervisor', role: 'supervisor' },
  { email: 'resident@anaesthesia.test', password: 'Resid1234!', full_name: 'Dr. Ryan Resident', role: 'resident' },
]

const ids = {}

for (const user of users) {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: { data: { full_name: user.full_name, role: user.role } },
  })

  if (error) {
    console.error(`❌ ${user.role}: ${error.message}`)
  } else {
    ids[user.role] = data.user?.id
    console.log(`✅ ${user.role} created — ${user.email} / ${user.password} (id: ${data.user?.id})`)
  }
}

console.log('\n--- Run this SQL in Supabase Dashboard > SQL Editor ---\n')
for (const user of users) {
  const id = ids[user.role]
  if (id) {
    console.log(`UPDATE public.profiles SET role = '${user.role}', full_name = '${user.full_name}' WHERE id = '${id}';`)
  }
}
console.log('\n-------------------------------------------------------')
