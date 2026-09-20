import { PackageSearch, RotateCcw, PlusCircle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  showReset?: boolean;
}

export default function EmptyState({
  title = "No products found",
  description = "We couldn't find any products matching your current search or filter criteria. Try adjusting your filters or search keywords.",
  onReset,
  showReset = true,
}: EmptyStateProps) {
  return (
    <div
      id="marketplace-empty-state"
      className="w-full bg-white rounded-2xl border border-dashed border-[#CBD5E1] p-12 sm:p-16 text-center flex flex-col items-center justify-center my-6"
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center mb-5 text-[#2563EB] shadow-xs">
        <PackageSearch size={28} strokeWidth={1.8} />
      </div>

      {/* Heading */}
      <h3 className="text-lg font-bold text-[#0F172A] tracking-tight mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-[#64748B] max-w-md leading-relaxed mb-6">
        {description}
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#E2E8F0] transition-colors"
          >
            <RotateCcw size={13} />
            Reset all filters
          </button>
        )}
        <Link
          href="/#cta"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-colors"
        >
          <PlusCircle size={14} />
          Sell this item instead
        </Link>
      </div>
    </div>
  );
}
