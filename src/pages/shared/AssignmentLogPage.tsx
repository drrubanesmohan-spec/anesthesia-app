import { useEffect, useState } from 'react'
import { AppShell } from '../../components/layout/AppShell'
import { Card } from '../../components/ui/Card'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { supabase } from '../../lib/supabaseClient'
import { ScrollText, ArrowRight } from 'lucide-react'

interface LogRow {
  id: string
  changed_at: string
  resident: { full_name: string } | null
  from_hospital: { name: string } | null
  from_dept: { name: string } | null
  to_hospital: { name: string } | null
  to_dept: { name: string } | null
  changer: { full_name: string } | null
}

export function AssignmentLogPage() {
  const [logs, setLogs] = useState<LogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('resident_assignment_logs')
      .select(`
        id,
        changed_at,
        resident:resident_id(full_name),
        from_hospital:from_hospital_id(name),
        from_dept:from_department_id(name),
        to_hospital:to_hospital_id(name),
        to_dept:to_department_id(name),
        changer:changed_by(full_name)
      `)
      .order('changed_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setLogs((data ?? []) as unknown as LogRow[])
        setLoading(false)
      })
  }, [])

  return (
    <AppShell title="Assignment Log">
      {loading ? (
        <div className="flex justify-center pt-16"><Spinner /></div>
      ) : logs.length === 0 ? (
        <EmptyState icon={ScrollText} title="No assignment changes yet" />
      ) : (
        <div className="space-y-2">
          {logs.map(l => {
            const fromLabel = l.from_hospital
              ? `${l.from_hospital.name}${l.from_dept ? ` / ${l.from_dept.name}` : ''}`
              : 'Unassigned'
            const toLabel = l.to_hospital
              ? `${l.to_hospital.name}${l.to_dept ? ` / ${l.to_dept.name}` : ''}`
              : '—'
            const date = new Date(l.changed_at)
            const dateStr = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
            const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

            return (
              <Card key={l.id} className="py-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-white">{l.resident?.full_name ?? 'Unknown'}</p>
                  <span className="shrink-0 text-xs text-slate-500">{dateStr} {timeStr}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs flex-wrap">
                  <span className="text-slate-500">{fromLabel}</span>
                  <ArrowRight size={12} className="text-slate-600 shrink-0" />
                  <span className="text-emerald-400">{toLabel}</span>
                </div>
                <p className="text-xs text-slate-600">by {l.changer?.full_name ?? 'Unknown'}</p>
              </Card>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
