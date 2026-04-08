import { cn } from '../../lib/utils'
import type { AttendanceStatus } from '../../types/domain'

const statusConfig: Record<AttendanceStatus, { label: string; className: string }> = {
  present: { label: 'Present', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  absent: { label: 'Absent', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  late: { label: 'Late', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  excused: { label: 'Excused', className: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const config = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', config.className)}>
      {config.label}
    </span>
  )
}

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', className)}>
      {children}
    </span>
  )
}
