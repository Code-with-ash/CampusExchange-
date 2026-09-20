import { BookOpen, Wrench, Laptop, Home, FlaskConical, Grid3X3 } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: "cat-books",
    icon: BookOpen,
    label: "Books",
    href : "/marketplace",
    color: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    id: "cat-tools",
    icon: Wrench,
    label: "Engineering Tools",
    href : "/marketplace",
    color: "#F0FDF4",
    iconColor: "#16A34A",
  },
  {
    id: "cat-electronics",
    icon: Laptop,
    label: "Electronics",
    href : "/marketplace",
    color: "#FFF7ED",
    iconColor: "#EA580C",
  },
  {
    id: "cat-hostel",
    icon: Home,
    label: "Hostel Essentials",
    href : "/marketplace",
    color: "#FDF4FF",
    iconColor: "#9333EA",
  },
  {
    id: "cat-lab",
    icon: FlaskConical,
    label: "Lab Equipment",
    href : "/marketplace",
    color: "#FFF1F2",
    iconColor: "#E11D48",
  },
  {
    id: "cat-others",
    icon: Grid3X3,
    label: "Others",
    href : "/marketplace",
    color: "#F8FAFC",
    iconColor: "#64748B",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 sm:py-24 bg-white border-t border-[#E2E8F0]" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
            Browse by Category
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Find what you need
          </h2>
          <p className="mt-4 text-[#64748B] max-w-lg mx-auto text-base">
            From textbooks to tools — everything a student needs, at student prices.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                id={cat.id}
                href={cat.href}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#2563EB]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon size={22} color={cat.iconColor} strokeWidth={2} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#0F172A] leading-tight">{cat.label}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
