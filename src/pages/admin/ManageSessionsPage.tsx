import { useEffect, useState } from 'react'
import { AppShell } from '../../components/layout/AppShell'
import { SessionCard } from '../../components/attendance/SessionCard'
import { SessionFormModal } from '../../components/attendance/SessionFormModal'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { useSessions } from '../../hooks/useSessions'
import { useHospitals } from '../../hooks/useHospitals'
import { useAuth } from '../../context/AuthContext'
import type { Session } from '../../types/domain'
import { Calendar, Pencil, Check, X } from 'lucide-react'

function HospitalsList() {
  const { hospitals, loading, fetchHospitals, updateHospital } = useHospitals()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState('')

  useEffect(() => { fetchHospitals() }, [fetchHospitals])

  function startEdit(id: number, name: string) {
    setEditingId(id)
    setDraft(name)
  }

  async function save(id: number) {
    if (draft.trim()) await updateHospital(id, draft.trim())
    setEditingId(null)
  }

  function cancel() { setEditingId(null) }

  if (loading) return <div className="flex justify-center py-4"><Spinner /></div>

  return (
    <div className="rounded-2xl border border-slate-700 bg-brand-light overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-slate-700">
        <span className="text-sm font-semibold text-emerald-400">Hospitals</span>
        <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400">
          {hospitals.length}
        </span>
      </div>
      {hospitals.map((h, i) => (
        <div
          key={h.id}
          className={`flex items-center px-4 py-2.5 gap-3 ${i !== hospitals.length - 1 ? 'border-b border-slate-700/50' : ''}`}
        >
          <span className="text-xs text-slate-500 w-5 shrink-0">{h.id}</span>
          {editingId === h.id ? (
            <>
              <input
                className="flex-1 bg-slate-700 text-sm text-white rounded px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') save(h.id); if (e.key === 'Escape') cancel() }}
                autoFocus
              />
              <button onClick={() => save(h.id)} className="text-emerald-400 hover:text-emerald-300">
                <Check size={15} />
              </button>
              <button onClick={cancel} className="text-slate-500 hover:text-slate-300">
                <X size={15} />
              </button>
            </>
          ) : (
            <>
              <span className="flex-1 text-sm text-white">{h.name}</span>
              <button onClick={() => startEdit(h.id, h.name)} className="text-slate-500 hover:text-slate-300">
                <Pencil size={13} />
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export function ManageSessionsPage() {
  const { appUser } = useAuth()
  const { sessions, loading, fetchAll, deleteSession } = useSessions()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Session | null>(null)

  useEffect(() => { fetchAll() }, [fetchAll])

  function openEdit(s: Session) { setEditing(s); setModalOpen(true) }

  return (
    <AppShell title="Hospital">
      <HospitalsList />

      {loading ? (
        <div className="flex justify-center pt-8"><Spinner /></div>
      ) : sessions.length === 0 ? (
        <EmptyState icon={Calendar} title="No sessions yet" />
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
