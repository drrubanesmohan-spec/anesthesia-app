import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { AttendanceRecord, AttendanceStatus } from '../types/domain'

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all residents + merge with attendance records for a session
  const fetchForSession = useCallback(async (sessionId: string) => {
    setLoading(true)
    setError(null)

    // Fetch all residents
    const { data: residents, error: rErr } = await supabase
      .from('profiles')
      .select('id, full_name, year')
      .eq('role', 'resident')
      .order('full_name')

    if (rErr || !residents) {
      setError(rErr?.message ?? 'Failed to load residents')
      setLoading(false)
      return
    }

    // Fetch existing attendance rows for this session
    const { data: existing, error: aErr } = await supabase
      .from('attendance')
      .select('*')
      .eq('session_id', sessionId)

    if (aErr) {
      setError(aErr.message)
      setLoading(false)
      return
    }

    // Merge: every resident gets a row (absent by default)
    const existingMap = new Map((existing ?? []).map(r => [r.resident_id, r]))
    const merged: AttendanceRecord[] = residents.map(r => {
      const existing = existingMap.get(r.id)
      return existing
        ? { ...existing, resident: { full_name: r.full_name, year: r.year } }
        : {
            session_id: sessionId,
            resident_id: r.id,
            status: 'absent' as AttendanceStatus,
            marked_by: null,
            marked_at: null,
            notes: null,
            resident: { full_name: r.full_name, year: r.year },
          }
    })

    setRecords(merged)
    setLoading(false)
  }, [])

  // Fetch own attendance records (resident view)
  const fetchForResident = useCallback(async (residentId: string) => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('attendance')
      .select('*, sessions:session_id(title, scheduled_date, location, session_type)')
      .eq('resident_id', residentId)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setRecords(data ?? [])
    }
    setLoading(false)
  }, [])

  const upsertAttendance = useCallback(
    async (
      sessionId: string,
      residentId: string,
      status: AttendanceStatus,
      markedBy: string
    ) => {
      // Optimistic update
      setRecords(prev =>
        prev.map(r =>
          r.resident_id === residentId
            ? { ...r, status, marked_by: markedBy, marked_at: new Date().toISOString() }
            : r
        )
      )

      const { error } = await supabase.from('attendance').upsert(
        {
          session_id: sessionId,
          resident_id: residentId,
          status,
          marked_by: markedBy,
          marked_at: new Date().toISOString(),
        },
        { onConflict: 'session_id,resident_id' }
      )

      if (error) {
        // Revert optimistic update
        setRecords(prev =>
          prev.map(r =>
            r.resident_id === residentId ? { ...r, status: 'absent', marked_by: null, marked_at: null } : r
          )
        )
        setError(error.message)
      }
    },
    []
  )

  return { records, loading, error, fetchForSession, fetchForResident, upsertAttendance }
}
