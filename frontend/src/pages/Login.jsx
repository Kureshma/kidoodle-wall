import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { KidoodleMark } from '../components/KidoodleLogo'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/home'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your email.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return false
    }
    if (!password) {
      setError('Please enter your password.')
      return false
    }
    return true
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF5D7] to-[#FFD93D]/40 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border-4 border-[#5C4033] bg-white p-8 shadow-xl"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <KidoodleMark className="w-16 h-16" />
          <h1 className="text-2xl font-extrabold text-[#5C4033]">Welcome back</h1>
          <p className="text-sm font-semibold text-[#5C4033]/70">Sign in to upload your drawings</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl bg-[#FF8C42]/20 px-4 py-2 text-sm font-bold text-[#5C4033]" role="alert">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#5C4033] mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-[#5C4033]/20 bg-[#FFF5D7]/50 px-4 py-3 font-semibold text-[#5C4033] outline-none focus:border-[#FF8C42]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[#5C4033] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-[#5C4033]/20 bg-[#FFF5D7]/50 px-4 py-3 pr-12 font-semibold text-[#5C4033] outline-none focus:border-[#FF8C42]"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C4033] p-1"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#FF8C42] py-3 text-lg font-bold text-white shadow-md hover:brightness-105 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center text-sm font-bold">
          <Link to="/register" className="text-[#FF8C42] hover:underline">
            Create Account
          </Link>
          <Link to="/forgot-password" className="text-[#5C4033]/70 hover:underline font-semibold">
            Forgot Password
          </Link>
          <Link to="/" className="text-[#5C4033]/50 hover:underline font-medium text-xs">
            Back to welcome
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
