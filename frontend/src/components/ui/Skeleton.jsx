export function Skeleton({ className = '' }) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl bg-surface/70',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_1.6s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className,
      ].join(' ')}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-primary/15 bg-background/40 p-5">
      <Skeleton className="mb-5 h-12 w-12" />
      <Skeleton className="mb-3 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-5/6" />
      <Skeleton className="mt-6 h-10 w-full" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="responsive-card-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

export function SkeletonStatGrid({ count = 4 }) {
  return (
    <div className="responsive-stat-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-primary/15 bg-background/40 p-5"
        >
          <Skeleton className="mb-4 h-10 w-10" />
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 6 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-primary/15 bg-background/40 p-4"
        >
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        </div>
      ))}
    </div>
  )
}