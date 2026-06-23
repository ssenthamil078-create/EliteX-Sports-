import { motion } from 'framer-motion'

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">AI Sports</p>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-gray-400">{subtitle}</p>}
      </motion.div>
      {action}
    </div>
  )
}
