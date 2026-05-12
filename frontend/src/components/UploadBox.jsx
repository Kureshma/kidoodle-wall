import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUploadCloud } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

export default function UploadBox({ onUploaded }) {
  const { isAuthenticated } = useAuth()
  const [drag, setDrag] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const inputRef = useRef(null)

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return false
    }
    return true
  }, [isAuthenticated])

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (!requireAuth()) return
    const fd = new FormData()
    fd.append('image', file)
    setUploading(true)
    try {
      await api.post('/api/images', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onUploaded?.()
    } catch (e) {
      console.error(e)
      alert(e.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files?.[0]
    uploadFile(file)
  }

  const onChangeInput = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    uploadFile(file)
  }

  const openPicker = () => {
    if (!requireAuth()) return
    inputRef.current?.click()
  }

  return (
    <>
      <motion.div
        layout
        animate={
          drag
            ? { scale: 1.02, boxShadow: '0 0 0 4px rgba(255,217,61,0.9), 0 20px 50px rgba(255,140,66,0.35)' }
            : { scale: 1, boxShadow: '0 8px 30px rgba(92,64,51,0.12)' }
        }
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        onDragEnter={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className="relative mx-auto max-w-xl cursor-pointer rounded-3xl border-[3px] border-dashed border-[#5C4033]/35 bg-gradient-to-br from-[#FFD93D]/40 via-[#FFF5D7] to-[#FF8C42]/30 p-10 text-center"
        onClick={openPicker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openPicker()
          }
        }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD93D] to-[#FF8C42] text-white shadow-lg"
        >
          <FiUploadCloud className="text-4xl drop-shadow" />
        </motion.div>
        <p className="text-xl font-bold text-[#5C4033]">Drop Your Drawing Here</p>
        <p className="mt-1 text-sm font-semibold text-[#5C4033]/80">or</p>
        <p className="mt-1 text-lg font-bold text-[#FF8C42]">Click to Upload</p>
        {uploading && (
          <p className="mt-4 text-sm font-semibold text-[#5C4033]">Uploading magic…</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChangeInput}
        />
      </motion.div>

      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#5C4033]/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md rounded-3xl border-4 border-[#5C4033] bg-[#FFF5D7] p-8 text-center shadow-2xl"
            >
              <p className="text-xl font-bold text-[#5C4033]">Please login first to upload drawings.</p>
              <p className="mt-2 text-sm font-medium text-[#5C4033]/80">
                Ask a grown-up to help you sign in or create an account.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/login"
                  className="rounded-full bg-[#FF8C42] px-6 py-3 text-sm font-bold text-white shadow-md hover:brightness-105"
                  onClick={() => setShowLoginModal(false)}
                >
                  Go to Login
                </Link>
                <button
                  type="button"
                  className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#5C4033] shadow border-2 border-[#5C4033]/20"
                  onClick={() => setShowLoginModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
