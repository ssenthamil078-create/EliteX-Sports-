import { motion } from 'framer-motion'
import { Zap, Orbit } from 'lucide-react'

export default function AppLogo({ small = false }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: 'linear',
        }}
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-neon ${
          small ? 'h-12 w-12' : 'h-16 w-16'
        }`}
      >
        <Orbit className={`${small ? 'h-5 w-5' : 'h-7 w-7'} text-white`} />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="absolute"
        >
          <Zap className={`${small ? 'h-3 w-3' : 'h-4 w-4'} text-warning`} />
        </motion.div>
      </motion.div>

      <div>
        <h1
          className={`font-black tracking-wide text-white ${
            small ? 'text-lg' : 'text-2xl'
          }`}
        >
          EliteX
        </h1>

        <p className="text-xs tracking-[0.25em] text-gray-500 uppercase">
          Elite Sports Intelligence
        </p>
      </div>
    </div>
  )
}