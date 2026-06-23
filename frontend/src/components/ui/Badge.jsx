const variants = {
  primary: 'bg-primary/15 text-indigo-200 border-primary/30',
  success: 'bg-success/15 text-green-200 border-success/30',
  danger: 'bg-danger/15 text-red-200 border-danger/30',
  warning: 'bg-warning/15 text-yellow-200 border-warning/30',
  gray: 'bg-white/5 text-gray-300 border-white/10',
}

export default function Badge({ children, variant = 'primary', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
