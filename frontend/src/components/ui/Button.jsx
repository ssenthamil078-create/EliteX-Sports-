import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-gradient-to-r from-primary to-accent text-white shadow-neon hover:brightness-110',
  secondary: 'bg-surface border border-primary/30 text-white hover:bg-primary/15',
  ghost: 'bg-transparent text-gray-300 hover:bg-white/5',
  danger: 'bg-danger text-white hover:brightness-110',
}

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-4 text-base',
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ y: -1, scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  )
}
