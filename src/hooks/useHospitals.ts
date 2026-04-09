import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export interface Department {
  id: string
  hospital_id: number
  name: string
}

export interface Hospital {
  id: number
  name: string
  departments: Department[]
}

export function useHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)

  const fetchHospitals = useCallback(async () => {
    setLoading(true)
    const [{ data: hData }, { data: dData }] = await Promise.all([
      supabase.from('hospitals').select('id, name').order('id'),
      supabase.from('hospital_departments').select('id, hospital_id, name').order('created_at'),
    ])
    const depts = (dData ?? []) as Department[]
    const list = ((hData ?? []) as { id: number; name: string }[]).map(h => ({
      ...h,
      departments: depts.filter(d => d.hospital_id === h.id),
    }))
    setHospitals(list)
    setLoading(false)
  }, [])

  const updateHospital = useCallback(async (id: number, name: string) => {
    await supabase.from('hospitals').update({ name }).eq('id', id)
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, name } : h))
  }, [])

  const addDepartment = useCallback(async (hospital_id: number, name: string) => {
    const { data } = await supabase
      .from('hospital_departments')
      .insert({ hospital_id, name })
      .select('id, hospital_id, name')
      .single()
    if (data) {
      setHospitals(prev => prev.map(h =>
        h.id === hospital_id
          ? { ...h, departments: [...h.departments, data as Department] }
          : h
      ))
    }
  }, [])

  const deleteDepartment = useCallback(async (deptId: string, hospitalId: number) => {
    await supabase.from('hospital_departments').delete().eq('id', deptId)
    setHospitals(prev => prev.map(h =>
      h.id === hospitalId
        ? { ...h, departments: h.departments.filter(d => d.id !== deptId) }
        : h
    ))
  }, [])

  return { hospitals, loading, fetchHospitals, updateHospital, addDepartment, deleteDepartment }
}
