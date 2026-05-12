import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiEdit2, FiTrash2, FiEye, FiX } from 'react-icons/fi'
import { api, imageUrl } from '../api/client'
import { useAuth } from '../context/AuthContext'

const variants = ['polaroid', 'sticker', 'paper']

function cardFrame(index) {
  const v = variants[index % variants.length]
  if (v === 'polaroid') {
    return 'bg-white p-3 pb-10 shadow-[8px_8px_0_#5C4033/12] border-2 border-white'
  }
  if (v === 'sticker') {
    return 'bg-[#FFD93D]/90 p-2 shadow-lg border-4 border-dashed border-[#5C4033]/25 rounded-2xl'
  }
  return 'bg-[#FFFEF6] p-3 shadow-md border border-[#5C4033]/20 rounded-sm'
}

export default function DrawingCard({ item, index, onChanged }) {
  const { user, isAuthenticated } = useAuth()
  const fileRef = useRef(null)

  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(false)

  const mine = isAuthenticated && user?.id === item.user_id
  const rotation = ((index * 7) % 11) - 5

  const replace = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''

    if (!file || !mine) return

    const fd = new FormData()
    fd.append('image', file)

    setBusy(true)

    try {
      await api.put(`/api/images/${item.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      onChanged?.()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update drawing')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!mine) return

    if (!window.confirm('Remove this drawing from the wall?')) return

    setBusy(true)

    try {
      await api.delete(`/api/images/${item.id}`)
      onChanged?.()
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: Math.min(index * 0.04, 0.4),
          type: 'spring',
          stiffness: 260,
          damping: 22,
        }}
        style={{ rotate: rotation }}
        whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
        className={`relative ${cardFrame(index)}`}
      >
        <div className="overflow-hidden rounded-lg bg-[#f4f0e8]">
          <img
            src={imageUrl(item.image)}
            alt={`Drawing by ${item.username}`}
            className="aspect-square w-full max-h-64 object-cover"
            loading="lazy"
          />
        </div>

        <p className="mt-2 text-center text-sm font-bold text-[#5C4033]">
          by {item.username}
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setPreview(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#5C4033] px-3 py-2 text-xs font-bold text-white shadow hover:brightness-110"
          >
            <FiEye />
            View Image
          </button>

          {mine && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF8C42] px-3 py-2 text-xs font-bold text-white shadow hover:brightness-105 disabled:opacity-60"
              >
                <FiEdit2 />
                Change Drawing
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={remove}
                className="inline-flex items-center gap-2 rounded-full bg-[#FFD93D] px-3 py-2 text-xs font-bold text-[#5C4033] shadow border border-[#5C4033]/15 hover:brightness-105 disabled:opacity-60"
              >
                <FiTrash2 />
                Remove Drawing
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={replace}
              />
            </>
          )}
        </div>
      </motion.article>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-3xl">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className="absolute -right-3 -top-3 rounded-full bg-white p-2 text-[#5C4033] shadow-lg"
            >
              <FiX size={20} />
            </button>

            <img
              src={imageUrl(item.image)}
              alt={`Drawing by ${item.username}`}
              className="max-h-[85vh] rounded-2xl border-4 border-white shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}