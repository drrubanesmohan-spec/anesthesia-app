import { ChevronLeft, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface TopBarProps {
  title: string
  showBack?: boolean
  showLogout?: boolean
}

export function TopBar({ title, showBack, showLogout }: TopBarProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-slate-700 bg-brand px-4 pt-safe">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="mr-2 rounded-full p-1.5 text-slate-400 hover:bg-brand-light hover:text-white"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      <h1 className="flex-1 text-base font-semibold text-white">{title}</h1>
      {showLogout && (
        <button
          onClick={signOut}
          className="rounded-full p-1.5 text-slate-400 hover:bg-brand-light hover:text-white"
        >
          <LogOut size={20} />
        </button>
      )}
    </header>
  )
}
