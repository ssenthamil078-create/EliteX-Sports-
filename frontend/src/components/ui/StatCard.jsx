import Card from './Card'

export default function StatCard({ label, value, icon: Icon, color = 'primary', sub }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-white">{value}</h3>
          {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
        </div>
        {Icon && (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  )
}
