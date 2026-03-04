import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl border border-border bg-card p-5 space-y-4"
      aria-hidden="true"
    >
      {/* Source badge + time row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28 rounded-full skeleton-pulse" />
        <Skeleton className="h-4 w-20 skeleton-pulse" />
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-full skeleton-pulse" />
        <Skeleton className="h-5 w-4/5 skeleton-pulse" />
      </div>

      {/* AI Summary lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full skeleton-pulse" />
        <Skeleton className="h-4 w-full skeleton-pulse" />
        <Skeleton className="h-4 w-3/4 skeleton-pulse" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-8 w-36 rounded-full skeleton-pulse" />
        <Skeleton className="h-8 w-32 rounded-md skeleton-pulse" />
      </div>
    </div>
  );
}
