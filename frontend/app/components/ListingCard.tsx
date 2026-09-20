import { MapPin, CheckCircle2 } from "lucide-react";

export interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  condition: "Like New" | "Good" | "Fair" | string;
  branch?: string;
  year?: string;
  sellerYear?: string;
  category: string;
  imageUrl: string;
}

const conditionColors: Record<string, { bg: string; text: string }> = {
  "Like New": { bg: "#F0FDF4", text: "#16A34A" },
  Good: { bg: "#EFF6FF", text: "#2563EB" },
  Fair: { bg: "#FFF7ED", text: "#EA580C" },
};

export default function ListingCard({
  id,
  title,
  price,
  condition,
  branch = "",
  year,
  sellerYear,
  category,
  imageUrl,
}: ListingCardProps) {
  const cond = conditionColors[condition] || conditionColors["Good"];
  const displayYear = sellerYear || year || "";

  return (
    <article
      id={id}
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-250 group flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-[#F8FAFC] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category chip */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#64748B] text-[11px] font-medium rounded-lg border border-[#E2E8F0]">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-[#0F172A] leading-snug line-clamp-2 mb-1.5">
          {title}
        </h3>

        {/* Condition badge */}
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold w-fit mb-3"
          style={{ backgroundColor: cond.bg, color: cond.text }}
        >
          <CheckCircle2 size={11} strokeWidth={2.5} />
          {condition}
        </span>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-[#0F172A]">₹{price.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1 text-[#94A3B8]">
            <MapPin size={12} strokeWidth={2} />
            <span className="text-xs">
              {branch ? `${branch}${displayYear ? ` • ${displayYear}` : ''}` : displayYear}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="mt-3 w-full py-2.5 text-xs font-semibold text-[#2563EB] border border-[#BFDBFE] bg-[#EFF6FF] rounded-xl hover:bg-[#DBEAFE] transition-colors duration-200"
        >
          View Listing
        </button>
      </div>
    </article>
  );
}
