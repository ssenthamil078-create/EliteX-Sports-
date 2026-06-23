import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, rotateX: 1.5, rotateY: -1.5 } : undefined}
      transition={{ duration: 0.35 }}
      className={`glass-card rounded-3xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}
