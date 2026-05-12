import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../api/client'
import DrawingCard from './DrawingCard'

export default function Gallery({ refreshKey }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/images')
      setItems(data)
    } catch {
      setError('Could not load the gallery. Is the server running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  if (loading) {
    return (
      <p className="text-center font-semibold text-[#5C4033]/80 py-12">Loading drawings…</p>
    )
  }

  if (error) {
    return <p className="text-center font-bold text-[#FF8C42] py-8">{error}</p>
  }

  if (!items.length) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl border-2 border-dashed border-[#5C4033]/20 bg-white/50 py-16 text-center text-lg font-semibold text-[#5C4033]/70"
      >
        No drawings on the wall yet. Be the first to upload!
      </motion.p>
    )
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <DrawingCard key={item.id} item={item} index={index} onChanged={load} />
      ))}
    </div>
  )
}
