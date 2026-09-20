import Link from "next/link";
import { Clock, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { Product } from "../types";

interface ListingCardProps {
  product: Product;
}

const CONDITION_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Like New": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  Good: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Fair: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
};

export default function ListingCard({ product }: ListingCardProps) {
  const condStyle =
    CONDITION_STYLES[product.condition] || CONDITION_STYLES["Good"];
  const fallbackImage =
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80";
  const imageUrl = product.imageUrl || (Array.isArray(product.images) ? product.images[0] : "") || fallbackImage;
  const branchLabel = product.branch || "Campus Seller";
  const yearLabel = product.sellerYear || "Student";
  const postedLabel = product.postedTime || "Recently";

  return (
    <Link
      href={`/marketplace/${product.id}`}
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] bg-[#F8FAFC] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== fallbackImage) target.src = fallbackImage;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#0F172A] text-[11px] font-medium rounded-lg border border-[#E2E8F0]/80 shadow-xs">
            {product.category}
          </span>
        </div>

        {/* Verified Student Badge */}
        {product.verified && (
          <div className="absolute top-3 right-3">
            <span
              className="p-1 bg-white/90 backdrop-blur-md rounded-lg border border-[#E2E8F0] shadow-xs text-[#2563EB] flex items-center justify-center"
              title="Verified Student Seller"
            >
              <ShieldCheck size={14} strokeWidth={2.5} />
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Condition Badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${condStyle.bg} ${condStyle.text} ${condStyle.border}`}
            >
              <CheckCircle2 size={10} strokeWidth={2.5} />
              {product.condition}
            </span>
            <span className="text-[11px] text-[#94A3B8]">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
              <Clock size={11} />
              {postedLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#2563EB] transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Seller Meta */}
        <div className="pt-2 border-t border-[#F8FAFC]">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#0F172A] tracking-tight">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#94A3B8] line-through font-normal">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                )}
                % OFF
              </span>
            )}
          </div>

          {/* Seller Branch & Year */}
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-[#94A3B8] shrink-0" />
              <span className="truncate max-w-[130px]">{branchLabel}</span>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 bg-[#F1F5F9] rounded-md text-[#475569]">
              {yearLabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
