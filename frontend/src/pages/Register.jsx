import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { KidoodleMark } from '../components/KidoodleLogo'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!username.trim()) {
      setError('Please choose a username.')
      return false
    }
    if (!email.trim()) {
      setError('Please enter your email.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
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
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      })
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF5D7] to-[#FF8C42]/25 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border-4 border-[#5C4033] bg-white p-8 shadow-xl"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <KidoodleMark className="w-16 h-16" />
          <h1 className="text-2xl font-extrabold text-[#5C4033]">Create your wall</h1>
          <p className="text-sm font-semibold text-[#5C4033]/70">Join KIDOODLE WALL</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <p className="rounded-xl bg-[#FFD93D]/50 px-4 py-2 text-sm font-bold text-[#5C4033]" role="alert">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-[#5C4033] mb-1">
              Username
            </label>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border-2 border-[#5C4033]/20 bg-[#FFF5D7]/50 px-4 py-3 font-semibold text-[#5C4033] outline-none focus:border-[#FF8C42]"
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-bold text-[#5C4033] mb-1">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-[#5C4033]/20 bg-[#FFF5D7]/50 px-4 py-3 font-semibold text-[#5C4033] outline-none focus:border-[#FF8C42]"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-bold text-[#5C4033] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
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
          <div>
            <label htmlFor="confirm" className="block text-sm font-bold text-[#5C4033] mb-1">
              Confirm Password
            </label>
            <input
              id="confirm"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border-2 border-[#5C4033]/20 bg-[#FFF5D7]/50 px-4 py-3 font-semibold text-[#5C4033] outline-none focus:border-[#FF8C42]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#FFD93D] py-3 text-lg font-bold text-[#5C4033] shadow-md border-2 border-[#5C4033]/10 hover:brightness-105 disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-bold text-[#5C4033]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF8C42] hover:underline">
            Login
          </Link>
        </p>
        <Link to="/" className="mt-3 block text-center text-xs font-medium text-[#5C4033]/50 hover:underline">
          Back to welcome
        </Link>
      </motion.div>
    </div>
  )
}
