import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { api } from '../api/client'
import { KidoodleMark } from '../components/KidoodleLogo'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const verifyEmail = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!email.trim()) {
      setError('Enter the email on your account.')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/auth/forgot-verify', { email: email.trim() })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify email.')
    } finally {
      setLoading(false)
    }
  }

  const reset = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/auth/reset-password', {
        email: email.trim(),
        newPassword,
      })
      setSuccess('Password updated. You can now sign in.')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF5D7] to-[#FFD93D]/30 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border-4 border-[#5C4033] bg-white p-8 shadow-xl"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <KidoodleMark className="w-16 h-16" />
          <h1 className="text-2xl font-extrabold text-[#5C4033]">Forgot password</h1>
          <p className="text-sm font-semibold text-[#5C4033]/70 text-center">
            {step === 1 ? 'Enter your account email to continue.' : 'Choose a new password.'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={verifyEmail} className="space-y-4">
            {error && (
              <p className="rounded-xl bg-[#FF8C42]/20 px-4 py-2 text-sm font-bold text-[#5C4033]" role="alert">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="fp-email" className="block text-sm font-bold text-[#5C4033] mb-1">
                Email
              </label>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-2 border-[#5C4033]/20 bg-[#FFF5D7]/50 px-4 py-3 font-semibold text-[#5C4033] outline-none focus:border-[#FF8C42]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#FF8C42] py-3 text-lg font-bold text-white shadow-md hover:brightness-105 disabled:opacity-60"
            >
              {loading ? 'Checking…' : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={reset} className="space-y-4">
            {error && (
              <p className="rounded-xl bg-[#FF8C42]/20 px-4 py-2 text-sm font-bold text-[#5C4033]" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-xl bg-[#FFD93D]/50 px-4 py-2 text-sm font-bold text-[#5C4033]" role="alert">
                {success}
              </p>
            )}
            <div>
              <label htmlFor="np" className="block text-sm font-bold text-[#5C4033] mb-1">
                New password
              </label>
              <div className="relative">
                <input
                  id="np"
                  type={show ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={Boolean(success)}
                  className="w-full rounded-xl border-2 border-[#5C4033]/20 bg-[#FFF5D7]/50 px-4 py-3 pr-12 font-semibold text-[#5C4033] outline-none focus:border-[#FF8C42] disabled:opacity-60"
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
              <label htmlFor="npc" className="block text-sm font-bold text-[#5C4033] mb-1">
                Confirm new password
              </label>
              <input
                id="npc"
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={Boolean(success)}
                className="w-full rounded-xl border-2 border-[#5C4033]/20 bg-[#FFF5D7]/50 px-4 py-3 font-semibold text-[#5C4033] outline-none focus:border-[#FF8C42] disabled:opacity-60"
              />
            </div>
            {!success && (
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#FFD93D] py-3 text-lg font-bold text-[#5C4033] shadow-md hover:brightness-105 disabled:opacity-60"
              >
                {loading ? 'Saving…' : 'Save new password'}
              </button>
            )}
          </form>
        )}

        <div className="mt-6 text-center text-sm font-bold">
          <Link to="/login" className="text-[#FF8C42] hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
