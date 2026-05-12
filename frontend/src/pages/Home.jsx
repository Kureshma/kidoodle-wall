import { useState } from 'react'
import Navbar from '../components/Navbar'
import UploadBox from '../components/UploadBox'
import Gallery from '../components/Gallery'
import { motion } from 'framer-motion'

export default function Home() {
  const [galleryKey, setGalleryKey] = useState(0)

  return (
    <div className="min-h-svh bg-[#FFF5D7]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-extrabold text-[#5C4033] sm:text-4xl">The Drawing Wall</h1>
          <p className="mt-2 text-base font-semibold text-[#5C4033]/75">
            Share your doodles — they look best on the wall!
          </p>
        </motion.div>

        <section className="mb-16">
          <UploadBox onUploaded={() => setGalleryKey((k) => k + 1)} />
        </section>

        <section>
          <h2 className="mb-8 text-center text-2xl font-bold text-[#5C4033]">Gallery</h2>
          <Gallery refreshKey={galleryKey} />
        </section>

        {/* Decorative bottom */}
        <div className="pointer-events-none mt-16 flex justify-center gap-3 opacity-60">
          {['🖍️', '⭐', '🎨', '☁️', '🖍️'].map((c, i) => (
            <motion.span
              key={i}
              className="text-3xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.2, delay: i * 0.2, repeat: Infinity }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      </main>
    </div>
  )
}
