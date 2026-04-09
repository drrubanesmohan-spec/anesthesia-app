import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AppShell } from '../../components/layout/AppShell'
import { SessionCard } from '../../components/attendance/SessionCard'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { useSessions } from '../../hooks/useSessions'
import { useHospitals } from '../../hooks/useHospitals'
import { Calendar, ChevronDown, ChevronRight } from 'lucide-react'
import type { Hospital } from '../../hooks/useHospitals'

function HospitalRow({ hospital }: { hospital: Hospital }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex w-full items-center px-4 py-2.5 gap-2 hover:bg-slate-700/20 transition-colors"
      >
        <span className="text-slate-500 shrink-0">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <span className="text-xs text-slate-500 w-5 shrink-0">{hospital.id}</span>
        <span className="flex-1 text-left text-sm text-white">{hospital.name}</span>
        <span className="text-xs text-slate-600">{hospital.departments.length} dept{hospital.departments.length !== 1 ? 's' : ''}</span>
      </button>
      {expanded && (
        <div className="ml-10 border-l border-slate-700 pl-3 pb-2">
          {hospital.departments.length === 0 ? (
            <p className="text-xs text-slate-600 py-1">No departments</p>
          ) : (
            hospital.departments.map(d => (
              <p key={d.id} className="text-xs text-slate-400 py-1">{d.name}</p>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function HospitalsList() {
  const { hospitals, loading, fetchHospitals } = useHospitals()
  useEffect(() => { fetchHospitals() }, [fetchHospitals])

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
        <div key={h.id} className={i !== hospitals.length - 1 ? 'border-b border-slate-700/50' : ''}>
          <HospitalRow hospital={h} />
        </div>
      ))}
    </div>
  )
}

export function SupervisorDashboard() {
  const { appUser } = useAuth()
  const navigate = useNavigate()
  const { sessions, loading, fetchForSupervisor } = useSessions()

  useEffect(() => {
    if (appUser) fetchForSupervisor(appUser.id)
  }, [appUser, fetchForSupervisor])

  const upcoming = sessions.filter(s => !s.is_cancelled && s.scheduled_date >= new Date().toISOString().slice(0, 10))
  const past = sessions.filter(s => s.is_cancelled || s.scheduled_date < new Date().toISOString().slice(0, 10))

  return (
    <AppShell title="Hospital" showLogout>
      <HospitalsList />

      {loading ? (
        <div className="flex justify-center pt-8"><Spinner /></div>
      ) : sessions.length === 0 ? (
        <EmptyState icon={Calendar} title="No sessions assigned" description="Hospital sessions assigned to you will appear here." />
      ) : (
        <div className="space-y-4">
          {upcoming.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Upcoming</p>
              <div className="space-y-3">
                {upcoming.map(s => (
                  <SessionCard key={s.id} session={s} onClick={() => navigate(`/supervisor/session/${s.id}/mark`)} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Past</p>
              <div className="space-y-3">
                {past.slice(0, 5).map(s => (
                  <SessionCard key={s.id} session={s} onClick={() => navigate(`/supervisor/session/${s.id}/mark`)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  )
}
