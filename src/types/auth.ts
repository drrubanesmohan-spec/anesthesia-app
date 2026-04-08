export type UserRole = 'resident' | 'supervisor' | 'admin'

export interface AppUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  year?: number
  department?: string
}
