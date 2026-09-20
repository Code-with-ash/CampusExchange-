interface ProductSkeletonProps {
  count?: number;
}

export function SingleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-[4/3] bg-[#E2E8F0]/70" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Badge skeleton */}
          <div className="h-4 w-20 bg-[#E2E8F0] rounded-md" />
          {/* Title lines */}
          <div className="h-4 w-full bg-[#E2E8F0] rounded" />
          <div className="h-4 w-3/4 bg-[#E2E8F0] rounded" />
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#F8FAFC] space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-5 w-24 bg-[#E2E8F0] rounded" />
            <div className="h-4 w-12 bg-[#E2E8F0] rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3 w-16 bg-[#E2E8F0] rounded" />
            <div className="h-3 w-12 bg-[#E2E8F0] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductSkeletonGrid({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <SingleCardSkeleton key={idx} />
      ))}
    </div>
  );
}
