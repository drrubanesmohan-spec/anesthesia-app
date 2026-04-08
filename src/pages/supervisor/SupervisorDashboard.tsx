import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AppShell } from '../../components/layout/AppShell'
import { SessionCard } from '../../components/attendance/SessionCard'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { useSessions } from '../../hooks/useSessions'
import { Calendar } from 'lucide-react'

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
      {loading ? (
        <div className="flex justify-center pt-16"><Spinner /></div>
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
