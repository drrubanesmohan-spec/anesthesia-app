import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy')
}

export function formatTime(timeStr: string | null): string {
  if (!timeStr) return ''
  // timeStr is HH:MM:SS from Postgres
  return timeStr.slice(0, 5)
}
