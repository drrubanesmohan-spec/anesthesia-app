import { useEffect, useState } from 'react'
import { AppShell } from '../../components/layout/AppShell'
import { Card } from '../../components/ui/Card'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

interface Stats {
  residents: number
  supervisors: number
  sessions: number
  attendance: number
}

export function AdminDashboard() {
  const { appUser } = useAuth()
  const [stats, setStats] = useState<Stats>({ residents: 0, supervisors: 0, sessions: 0, attendance: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'resident'),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'supervisor'),
      supabase.from('sessions').select('id', { count: 'exact' }),
      supabase.from('attendance').select('id', { count: 'exact' }).eq('status', 'present'),
    ]).then(([r, sv, s, a]) => {
      setStats({
        residents: r.count ?? 0,
        supervisors: sv.count ?? 0,
        sessions: s.count ?? 0,
        attendance: a.count ?? 0,
      })
    })
  }, [])

  return (
    <AppShell title="Admin Dashboard" showLogout>
      <div className="space-y-4">
        <p className="text-sm text-slate-400">Welcome, {appUser?.fullName}</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Residents', value: stats.residents, color: 'text-sky-400' },
            { label: 'Supervisors', value: stats.supervisors, color: 'text-purple-400' },
            { label: 'Hospital sessions', value: stats.sessions, color: 'text-amber-400' },
            { label: 'Present records', value: stats.attendance, color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <Card key={label} className="text-center">
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
