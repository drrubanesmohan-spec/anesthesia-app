import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AppShell } from '../../components/layout/AppShell'
import { SessionCard } from '../../components/attendance/SessionCard'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { useSessions } from '../../hooks/useSessions'
import { Calendar } from 'lucide-react'

export function SessionHistoryPage() {
  const { appUser } = useAuth()
  const navigate = useNavigate()
  const { sessions, loading, fetchForSupervisor } = useSessions()

  useEffect(() => {
    if (appUser) fetchForSupervisor(appUser.id)
  }, [appUser, fetchForSupervisor])

  return (
    <AppShell title="Hospital History">
      {loading ? (
        <div className="flex justify-center pt-16"><Spinner /></div>
      ) : sessions.length === 0 ? (
        <EmptyState icon={Calendar} title="No sessions yet" />
      ) : (
        <div className="space-y-3">
          {sessions.map(s => (
            <SessionCard
              key={s.id}
              session={s}
              onClick={() => navigate(`/supervisor/session/${s.id}/mark`)}
            />
          ))}
        </div>
      )}
    </AppShell>
  )
}
