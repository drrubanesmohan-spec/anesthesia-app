export type SessionType = 'theatre' | 'icu' | 'tutorial' | 'simulation' | 'other'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type SkillLevel = 'observed' | 'assisted' | 'performed_supervised' | 'independent'

export interface Session {
  id: string
  title: string
  session_type: SessionType
  location: string | null
  scheduled_date: string
  start_time: string | null
  end_time: string | null
  supervisor_id: string | null
  notes: string | null
  is_cancelled: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  supervisor?: { full_name: string }
}

export interface AttendanceRecord {
  id?: string
  session_id: string
  resident_id: string
  status: AttendanceStatus
  marked_by: string | null
  marked_at: string | null
  notes: string | null
  resident?: { full_name: string; year?: number }
}
