import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { KidoodleLogo } from '../components/KidoodleLogo'

function FloatingShape({ className, delay, duration, x, y }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full opacity-70 ${className}`}
      initial={{ x: 0, y: 0 }}
      animate={{ x, y }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      }}
    />
  )
}

export default function Dashboard() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-b from-[#FFF5D7] via-[#FFD93D]/25 to-[#FF8C42]/20 flex flex-col items-center justify-center px-6 py-16 text-center">
      <FloatingShape
        className="left-[5%] top-[12%] h-24 w-24 bg-[#FFD93D] blur-sm"
        delay={0}
        duration={7}
        x={30}
        y={20}
      />
      <FloatingShape
        className="right-[8%] top-[20%] h-16 w-16 bg-[#FF8C42]/80"
        delay={0.5}
        duration={6}
        x={-25}
        y={35}
      />
      <FloatingShape
        className="left-[15%] bottom-[18%] h-20 w-20 bg-white/80 border-4 border-[#FF8C42]/40"
        delay={1}
        duration={8}
        x={40}
        y={-30}
      />
      <FloatingShape
        className="right-[12%] bottom-[10%] h-14 w-14 bg-[#FFD93D]/60 rotate-45 rounded-lg"
        delay={0.2}
        duration={5}
        x={-20}
        y={-25}
      />

      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute text-[#FF8C42]"
          style={{
            left: `${(i * 17) % 90}%`,
            top: `${(i * 23) % 85}%`,
            fontSize: `${10 + (i % 4) * 4}px`,
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.15 }}
        >
          ★
        </motion.span>
      ))}

      <div className="relative z-10 max-w-lg">
        <KidoodleLogo className="w-72 sm:w-80 mx-auto" />
        <motion.h1
          className="mt-6 text-3xl sm:text-4xl font-extrabold text-[#5C4033] leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Magic Drawing Wall
        </motion.h1>
        <motion.p
          className="mt-4 text-lg font-medium text-[#5C4033]/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          A creative space for children to upload and display artwork.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Link
            to="/home"
            className="mt-10 inline-block rounded-full bg-gradient-to-r from-[#FFD93D] to-[#FF8C42] px-10 py-4 text-lg font-bold text-[#5C4033] shadow-[0_6px_0_#5C4033]/25 border-2 border-[#5C4033]/20 hover:brightness-105 active:translate-y-0.5 transition"
          >
            Start Exploring
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
