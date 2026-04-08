import { useEffect, useState } from 'react'
import { AppShell } from '../../components/layout/AppShell'
import { SessionCard } from '../../components/attendance/SessionCard'
import { SessionFormModal } from '../../components/attendance/SessionFormModal'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { useSessions } from '../../hooks/useSessions'
import { useAuth } from '../../context/AuthContext'
import type { Session } from '../../types/domain'
import { Plus, Calendar } from 'lucide-react'

export function ManageSessionsPage() {
  const { appUser } = useAuth()
  const { sessions, loading, fetchAll, deleteSession } = useSessions()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Session | null>(null)

  useEffect(() => { fetchAll() }, [fetchAll])

  function openNew() { setEditing(null); setModalOpen(true) }
  function openEdit(s: Session) { setEditing(s); setModalOpen(true) }

  return (
    <AppShell title="Hospital">
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={openNew}>
          <Plus size={16} className="mr-1" />
          New session
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center pt-16"><Spinner /></div>
      ) : sessions.length === 0 ? (
        <EmptyState icon={Calendar} title="No sessions yet" description="Create the first session above." />
      ) : (
        <div className="space-y-3">
          {sessions.map(s => (
            <div key={s.id}>
              <SessionCard session={s} onClick={() => openEdit(s)} />
              <div className="mt-1.5 flex gap-2 px-1">
                <button
                  onClick={() => openEdit(s)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >Edit</button>
                <button
                  onClick={() => deleteSession(s.id)}
                  className="text-xs text-red-500 hover:text-red-400"
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {appUser && (
        <SessionFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={fetchAll}
          session={editing}
          currentUser={appUser}
        />
      )}
    </AppShell>
  )
}
