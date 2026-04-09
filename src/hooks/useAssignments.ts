import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export interface Assignment {
  resident_id: string
  hospital_id: number | null
  department_id: string | null
  assigned_at: string | null
  assigned_by: string | null
}

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAssignments = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('resident_assignments')
      .select('resident_id, hospital_id, department_id, assigned_at, assigned_by')
    setAssignments((data ?? []) as Assignment[])
    setLoading(false)
  }, [])

  const assignResident = useCallback(async (
    residentId: string,
    hospitalId: number,
    departmentId: string,
    changedById: string,
    current: Assignment | undefined,
  ) => {
    // Log the change
    await supabase.from('resident_assignment_logs').insert({
      resident_id: residentId,
      from_hospital_id: current?.hospital_id ?? null,
      from_department_id: current?.department_id ?? null,
      to_hospital_id: hospitalId,
      to_department_id: departmentId,
      changed_by: changedById,
    })

    // Upsert current assignment
    const record = {
      resident_id: residentId,
      hospital_id: hospitalId,
      department_id: departmentId,
      assigned_by: changedById,
      assigned_at: new Date().toISOString(),
    }
    await supabase.from('resident_assignments').upsert(record)

    setAssignments(prev => {
      const exists = prev.find(a => a.resident_id === residentId)
      if (exists) return prev.map(a => a.resident_id === residentId ? { ...a, ...record } : a)
      return [...prev, record]
    })
  }, [])

  return { assignments, loading, fetchAssignments, assignResident }
}
