import { useEffect, useState } from 'react'
import { AppShell } from '../../components/layout/AppShell'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { supabase } from '../../lib/supabaseClient'
import type { UserRole } from '../../types/auth'
import { Users } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  role: UserRole
  year: number | null
  department: string | null
}

const roleColors: Record<UserRole, string> = {
  resident: 'bg-sky-500/20 text-sky-400',
  supervisor: 'bg-purple-500/20 text-purple-400',
  admin: 'bg-amber-500/20 text-amber-400',
}

export function ManageUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function fetchUsers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, year, department')
      .order('full_name')
    setUsers((data ?? []) as Profile[])
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  async function changeRole(id: string, role: UserRole) {
    setUpdatingId(id)
    await supabase.from('profiles').update({ role }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    setUpdatingId(null)
  }

  const roles: UserRole[] = ['resident', 'supervisor', 'admin']

  return (
    <AppShell title="Manage Users">
      {loading ? (
        <div className="flex justify-center pt-16"><Spinner /></div>
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users yet" description="Users appear here after they've been invited." />
      ) : (
        <div className="space-y-3">
          {users.map(u => (
            <Card key={u.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{u.full_name}</p>
                  {u.department && <p className="text-xs text-slate-500">{u.department}</p>}
                  {u.year && <p className="text-xs text-slate-500">Year {u.year}</p>}
                </div>
                <Badge className={roleColors[u.role]}>{u.role}</Badge>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {roles.filter(r => r !== u.role).map(r => (
                  <Button
                    key={r}
                    size="sm"
                    variant="secondary"
                    loading={updatingId === u.id}
                    onClick={() => changeRole(u.id, r)}
                  >
                    Make {r}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  )
}
