"use client";

import {
  Wrench,
  BookOpen,
  Laptop,
  Home,
  FlaskConical,
  Grid3X3,
  Layers,
} from "lucide-react";
import { CategoryType } from "../types";

interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

interface CategoryItem {
  id: string;
  name: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

const CATEGORIES: CategoryItem[] = [
  { id: "all", name: "All", label: "All Items", icon: Layers },
  { id: "tools", name: "Engineering Tools", label: "Engineering Tools", icon: Wrench },
  { id: "books", name: "Books", label: "Books", icon: BookOpen },
  { id: "electronics", name: "Electronics", label: "Electronics", icon: Laptop },
  { id: "hostel", name: "Hostel", label: "Hostel", icon: Home },
  { id: "lab", name: "Lab Equipment", label: "Lab Equipment", icon: FlaskConical },
  { id: "others", name: "Others", label: "Others", icon: Grid3X3 },
];

export default function CategoryChips({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryChipsProps) {
  return (
    <div className="border-b border-[#E2E8F0] bg-white sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected =
              selectedCategory === cat.name ||
              (cat.name === "All" && (!selectedCategory || selectedCategory === "All"));
            const count =
              cat.name === "All"
                ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
                : categoryCounts[cat.name] || 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-[#0F172A] text-white shadow-sm ring-1 ring-[#0F172A]"
                    : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
                }`}
              >
                <Icon
                  size={14}
                  strokeWidth={2}
                  className={isSelected ? "text-white" : "text-[#94A3B8]"}
                />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
