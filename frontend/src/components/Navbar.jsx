import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiLogIn, FiUserPlus, FiLogOut } from 'react-icons/fi'
import { KidoodleMark } from './KidoodleLogo'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
      isActive
        ? 'bg-[#FFD93D] text-[#5C4033] shadow-md'
        : 'bg-white/70 text-[#5C4033] hover:bg-white hover:shadow'
    }`

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#5C4033]/10 bg-[#FFF5D7]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/home" className="flex items-center gap-3 group">
          <KidoodleMark className="w-12 h-12 shrink-0 transition-transform group-hover:scale-105" />
          <div className="text-left">
            <p className="text-lg font-bold leading-tight text-[#5C4033] tracking-tight">KIDOODLE WALL</p>
            <p className="text-xs font-medium text-[#5C4033]/70">Magic drawing wall</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm font-semibold text-[#5C4033] sm:inline">
                Hi, {user?.username}!
              </span>
              <button
                type="button"
                onClick={() => {
                  logout()
                  navigate('/home')
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#5C4033] shadow hover:shadow-md border-2 border-transparent hover:border-[#FF8C42]/40"
              >
                <FiLogOut className="text-lg" />
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                <FiLogIn className="text-lg" />
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                <FiUserPlus className="text-lg" />
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
