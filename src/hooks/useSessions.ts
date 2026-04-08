import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '../types/domain'

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('sessions')
      .select('*, supervisor:supervisor_id(full_name)')
      .order('scheduled_date', { ascending: false })

    if (error) setError(error.message)
    else setSessions((data ?? []) as Session[])
    setLoading(false)
  }, [])

  const fetchForSupervisor = useCallback(async (supervisorId: string) => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('sessions')
      .select('*, supervisor:supervisor_id(full_name)')
      .eq('supervisor_id', supervisorId)
      .order('scheduled_date', { ascending: false })

    if (error) setError(error.message)
    else setSessions((data ?? []) as Session[])
    setLoading(false)
  }, [])

  const fetchById = useCallback(async (id: string): Promise<Session | null> => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, supervisor:supervisor_id(full_name)')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data as Session
  }, [])

  const createSession = useCallback(
    async (payload: Omit<Session, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('sessions').insert(payload)
      if (error) return error.message
      await fetchAll()
      return null
    },
    [fetchAll]
  )

  const updateSession = useCallback(
    async (id: string, payload: Partial<Session>) => {
      const { error } = await supabase.from('sessions').update(payload).eq('id', id)
      if (error) return error.message
      await fetchAll()
      return null
    },
    [fetchAll]
  )

  const deleteSession = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('sessions').delete().eq('id', id)
      if (error) return error.message
      setSessions(prev => prev.filter(s => s.id !== id))
      return null
    },
    []
  )

  return {
    sessions,
    loading,
    error,
    fetchAll,
    fetchForSupervisor,
    fetchById,
    createSession,
    updateSession,
    deleteSession,
  }
}
