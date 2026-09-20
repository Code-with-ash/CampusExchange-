"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, SlidersHorizontal, Check } from "lucide-react";
import { ConditionType } from "../types";

interface FilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedConditions: ConditionType[];
  onToggleCondition: (cond: ConditionType) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

const CATEGORIES = [
  "All",
  "Engineering Tools",
  "Books",
  "Electronics",
  "Hostel",
  "Lab Equipment",
  "Others",
];

const CONDITIONS: { label: ConditionType; description: string }[] = [
  { label: "Like New", description: "Minimal to no signs of wear" },
  { label: "Good", description: "Minor cosmetic wear, 100% working" },
  { label: "Fair", description: "Noticeable wear, fully functional" },
];

export default function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  selectedConditions,
  onToggleCondition,
  priceRange,
  onPriceRangeChange,
  onResetFilters,
  activeFilterCount,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    price: true,
    condition: true,
    category: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const pricePresets = [
    { label: "All Prices", min: 0, max: 10000 },
    { label: "< ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1500", min: 500, max: 1500 },
    { label: "> ₹1500", min: 1500, max: 10000 },
  ];

  return (
    <aside className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm space-y-6">
      {/* Header with active count & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#2563EB]" />
          <h2 className="text-sm font-semibold text-[#0F172A]">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#2563EB] font-medium transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Price Range Section */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#0F172A] uppercase tracking-wider hover:text-[#2563EB] transition-colors"
        >
          <span>Price Range</span>
          {openSections.price ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.price && (
          <div className="space-y-3 pt-1 animate-in fade-in duration-150">
            {/* Quick price presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {pricePresets.map((preset) => {
                const isActive =
                  priceRange[0] === preset.min && priceRange[1] === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onPriceRangeChange([preset.min, preset.max])}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                      isActive
                        ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Slider input */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-[#64748B] mb-2 font-medium">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1] >= 10000 ? "10,000+" : priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) =>
                  onPriceRangeChange([priceRange[0], Number(e.target.value)])
                }
                className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#F1F5F9]" />

      {/* 2. Condition Section */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection("condition")}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#0F172A] uppercase tracking-wider hover:text-[#2563EB] transition-colors"
        >
          <span>Condition</span>
          {openSections.condition ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.condition && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
            {CONDITIONS.map((c) => {
              const isChecked = selectedConditions.includes(c.label);
              return (
                <label
                  key={c.label}
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#F8FAFC] cursor-pointer group transition-colors"
                >
                  <div
                    onClick={() => onToggleCondition(c.label)}
                    className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-all ${
                      isChecked
                        ? "bg-[#2563EB] border-[#2563EB] text-white"
                        : "border-[#CBD5E1] group-hover:border-[#94A3B8] bg-white"
                    }`}
                  >
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </div>
                  <div className="flex-1 select-none">
                    <p className="text-xs font-medium text-[#0F172A]">{c.label}</p>
                    <p className="text-[11px] text-[#94A3B8]">{c.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-[#F1F5F9]" />

      {/* 3. Category Section */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#0F172A] uppercase tracking-wider hover:text-[#2563EB] transition-colors"
        >
          <span>Category</span>
          {openSections.category ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {openSections.category && (
          <div className="space-y-1 pt-1 animate-in fade-in duration-150">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
