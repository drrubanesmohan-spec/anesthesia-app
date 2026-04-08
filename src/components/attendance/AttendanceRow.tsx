import { cn } from '../../lib/utils'
import type { AttendanceRecord, AttendanceStatus } from '../../types/domain'

const statuses: AttendanceStatus[] = ['present', 'late', 'excused', 'absent']

const statusStyle: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-500 text-white',
  absent: 'bg-red-600 text-white',
  late: 'bg-amber-500 text-white',
  excused: 'bg-sky-500 text-white',
}

const statusLabel: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
}

interface AttendanceRowProps {
  record: AttendanceRecord
  onStatusChange: (residentId: string, status: AttendanceStatus) => void
}

export function AttendanceRow({ record, onStatusChange }: AttendanceRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-700 py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{record.resident?.full_name ?? 'Unknown'}</p>
        {record.resident?.year && (
          <p className="text-xs text-slate-500">Year {record.resident.year}</p>
        )}
      </div>
      <div className="flex gap-1.5 flex-wrap justify-end">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => onStatusChange(record.resident_id, s)}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-opacity',
              record.status === s
                ? statusStyle[s]
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            )}
          >
            {statusLabel[s]}
          </button>
        ))}
      </div>
    </div>
  )
}
