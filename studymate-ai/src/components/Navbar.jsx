import {
  BookOpen,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'




export default function Navbar({
  isDark,
  onToggleTheme,
  onMenuToggle,
  onLogout
}) {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
  console.log('Logging out...')

  localStorage.removeItem('studymate-token')
  localStorage.removeItem('studymate-user')

  onLogout?.()
  navigate('/login', { replace: true })
}

  const handleMobileMenu = () => {
    setIsMobileMenuOpen((previous) => !previous)

    if (onMenuToggle) {
      onMenuToggle()
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-blue-600">
            <BookOpen size={18} />
          </div>

          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            StudyMate AI
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Documents */}
          <Link
            to="/documents"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white sm:inline-flex"
          >
            Documents
          </Link>

          {/* Theme */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* Desktop Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-200 dark:hover:bg-red-500/10 dark:hover:text-red-400 sm:inline-flex"
          >
            <LogOut size={17} />
            Logout
          </button>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={handleMobileMenu}
            className="inline-flex rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 sm:hidden">

          <Link
            to="/documents"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Documents
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
