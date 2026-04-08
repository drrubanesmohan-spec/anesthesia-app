import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/auth'
import { Spinner } from '../ui/Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { appUser, loading, session } = useAuth()

  if (loading || (session && !appUser)) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand">
        <Spinner className="h-10 w-10" />
      </div>
    )
  }

  if (!appUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(appUser.role)) {
    // Redirect to their correct dashboard
    const roleRoot = appUser.role === 'admin' ? '/admin' : `/${appUser.role}`
    return <Navigate to={roleRoot} replace />
  }

  return <>{children}</>
}
