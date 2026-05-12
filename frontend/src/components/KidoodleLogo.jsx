import { useId } from 'react'
import { motion } from 'framer-motion'


export function KidoodleLogo({ className = 'w-56 h-auto', animated = true }) {
  const inner = (
      <svg
        viewBox="0 0 320 120"
        className="w-full h-auto drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="KIDOODLE WALL logo"
      >
        <defs>
          <linearGradient id="kwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD93D" />
            <stop offset="100%" stopColor="#FF8C42" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="b" />
            <feOffset dx="0" dy="1" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wall + frames */}
        <rect
          x="8"
          y="28"
          width="104"
          height="72"
          rx="10"
          fill="#FFF5D7"
          stroke="#5C4033"
          strokeWidth="2.5"
        />
        <rect x="18" y="38" width="28" height="22" rx="3" fill="#FFFFFF" stroke="#FF8C42" strokeWidth="2" />
        <rect x="52" y="38" width="28" height="22" rx="3" fill="#FFD93D" stroke="#5C4033" strokeWidth="2" />
        <rect x="86" y="38" width="18" height="18" rx="3" fill="#FF8C42" opacity="0.85" />
        <path
          d="M22 78c8-6 18-6 26 0s18 6 26 0 18-6 26 0 18 6 26 0"
          stroke="#5C4033"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Crayon */}
        <g transform="translate(118 52) rotate(12)">
          <rect x="0" y="0" width="36" height="10" rx="2" fill="url(#kwGrad)" stroke="#5C4033" strokeWidth="1.5" />
          <polygon points="36,0 44,5 36,10" fill="#5C4033" />
        </g>

        {/* Stars */}
        <path
          d="M124 22l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"
          fill="#FFD93D"
          stroke="#5C4033"
          strokeWidth="1.2"
        />
        <circle cx="98" cy="22" r="4" fill="#FF8C42" stroke="#5C4033" strokeWidth="1.2" />

        {/* Wordmark */}
        <text
          x="164"
          y="52"
          fill="#5C4033"
          fontFamily="Fredoka, system-ui, sans-serif"
          fontSize="28"
          fontWeight="700"
          letterSpacing="0.5"
        >
          KIDOODLE
        </text>
        <text
          x="164"
          y="88"
          fill="url(#kwGrad)"
          stroke="#5C4033"
          strokeWidth="1.2"
          paintOrder="stroke fill"
          fontFamily="Fredoka, system-ui, sans-serif"
          fontSize="34"
          fontWeight="800"
          letterSpacing="2"
        >
          WALL
        </text>
        <path
          d="M160 98c40 8 72 4 88-4"
          stroke="#FF8C42"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
          filter="url(#soft)"
        />
      </svg>
  )

  if (animated) {
    return (
      <motion.div
        className={`inline-block ${className}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {inner}
      </motion.div>
    )
  }

  return <div className={`inline-block ${className}`}>{inner}</div>
}

/** Compact mark for navbar */
export function KidoodleMark({ className = 'w-11 h-11' }) {
  const uid = useId().replace(/:/g, '')
  const gradId = `kidoodle-mk-${uid}`
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="100%" stopColor="#FF8C42" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#FFF5D7" stroke="#5C4033" strokeWidth="2" />
      <rect x="12" y="14" width="24" height="16" rx="3" fill={`url(#${gradId})`} stroke="#5C4033" strokeWidth="1.5" />
      <path d="M14 34h20" stroke="#5C4033" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="12" r="4" fill="#FF8C42" stroke="#5C4033" strokeWidth="1" />
    </svg>
  )
}
