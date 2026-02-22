import { Skeleton } from '../components/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 sm:w-80 rounded-2xl" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>

        {/* Content cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>

        {/* Large content area */}
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
