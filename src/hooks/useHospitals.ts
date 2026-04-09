import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export interface Hospital {
  id: number
  name: string
}

export function useHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)

  const fetchHospitals = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('hospitals')
      .select('id, name')
      .order('id')
    setHospitals((data ?? []) as Hospital[])
    setLoading(false)
  }, [])

  const updateHospital = useCallback(async (id: number, name: string) => {
    await supabase.from('hospitals').update({ name }).eq('id', id)
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, name } : h))
  }, [])

  return { hospitals, loading, fetchHospitals, updateHospital }
}
