import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AppShell } from '../../components/layout/AppShell'
import { SessionCard } from '../../components/attendance/SessionCard'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { useSessions } from '../../hooks/useSessions'
import { useHospitals } from '../../hooks/useHospitals'
import { Calendar } from 'lucide-react'

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
        <div
          key={h.id}
          className={`flex items-center px-4 py-2.5 gap-3 ${i !== hospitals.length - 1 ? 'border-b border-slate-700/50' : ''}`}
        >
          <span className="text-xs text-slate-500 w-5 shrink-0">{h.id}</span>
          <span className="text-sm text-white">{h.name}</span>
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
                  <SessionCard
                    key={s.id}
                    session={s}
                    onClick={() => navigate(`/supervisor/session/${s.id}/mark`)}
                  />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Past</p>
              <div className="space-y-3">
                {past.slice(0, 5).map(s => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    onClick={() => navigate(`/supervisor/session/${s.id}/mark`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  )
}
