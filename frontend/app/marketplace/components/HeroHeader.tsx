"use client";

import { Search, Sparkles } from "lucide-react";

interface HeroHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalListingsCount: number;
}

export default function HeroHeader({
  searchQuery,
  onSearchChange,
  totalListingsCount,
}: HeroHeaderProps) {
  const popularTags = ["Mini Drafter", "Scientific Calculator", "Lab Coat", "Study Chair", "Hostel Cycle"];

  return (
    <div className="relative border-b border-[#E2E8F0] bg-white py-10 sm:py-14">
      {/* Soft background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(37,99,235,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-semibold mb-4">
          <Sparkles size={13} strokeWidth={2.5} />
          <span>Campus Marketplace • {totalListingsCount} Active Listings</span>
        </div>

        {/* Primary Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
          Find Everything You Need for College
        </h1>

        {/* Small description */}
        <p className="mt-3 text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          Affordable textbooks, drafting tools, lab gear, and hostel essentials directly
          from students in your college.
        </p>

        {/* Search input */}
        <div className="mt-7 max-w-xl mx-auto">
          <div className="relative flex items-center shadow-sm rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-[#2563EB]/10 transition-all duration-200">
            <Search
              className="absolute left-4 text-[#94A3B8] pointer-events-none"
              size={18}
              strokeWidth={2}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by product name, author, or branch (e.g., Drafter, CSE)..."
              className="w-full pl-11 pr-10 py-3.5 text-sm text-[#0F172A] placeholder-[#94A3B8] rounded-2xl focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3.5 text-xs text-[#94A3B8] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick filter keywords */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-1.5 text-xs text-[#64748B]">
            <span className="text-[#94A3B8]">Trending:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSearchChange(tag)}
                className="px-2.5 py-0.5 rounded-md bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
