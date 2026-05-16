export function DataTableSkeleton({ rows = 8, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="grid gap-px bg-gray-200" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: rows * columns }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse bg-gray-100" />
        ))}
      </div>
    </div>
  )
}
