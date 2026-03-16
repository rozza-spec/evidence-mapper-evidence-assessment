"use client";

export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`h-4 bg-surface-light animate-pulse rounded ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-surface-border p-4 space-y-3 animate-pulse">
      <div className="h-5 bg-surface-light rounded w-2/3" />
      <div className="h-4 bg-surface-light rounded w-full" />
      <div className="h-4 bg-surface-light rounded w-1/2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-8 bg-surface-light rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-surface border border-surface-border rounded" />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="py-8 space-y-8 animate-pulse">
      <div className="h-12 bg-surface-light rounded w-1/2" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface border border-surface-border p-4 h-20 rounded" />
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface border border-surface-border p-6 h-40 rounded" />
        ))}
      </div>
    </div>
  );
}
