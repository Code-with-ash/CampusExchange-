"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import MarketplaceNavbar from "./components/MarketplaceNavbar";
import HeroHeader from "./components/HeroHeader";
import CategoryChips from "./components/CategoryChips";
import FilterSidebar from "./components/FilterSidebar";
import ListingCard from "./components/ListingCard";
import EmptyState from "./components/EmptyState";
import ProductSkeletonGrid from "./components/ProductSkeleton";
import Footer from "../components/Footer";
import { ConditionType, FilterState, Product } from "./types";
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from "lucide-react";

export default function MarketplacePage() {
  const [isPending, startTransition] = useTransition();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [desktopFilterOpen, setDesktopFilterOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/listings", { cache: "no-store" });
        const json = await response.json();
        console.log("Fetched listings:", json); // Debugging log
        if (json.success) {
          setProducts(json.data);
        }
      } catch (error) {
        console.error("Failed to load listings", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedCategory: "All",
    selectedConditions: [],
    priceRange: [0, 10000],
    sortBy: "recent",
  });

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "Engineering Tools": 0,
      Books: 0,
      Electronics: 0,
      Hostel: 0,
      "Lab Equipment": 0,
      Others: 0,
    };

    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      } else {
        counts["Others"] = (counts["Others"] || 0) + 1;
      }
    });

    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesBranch = (product.branch || "").toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q) ?? false;
        if (!matchesTitle && !matchesCategory && !matchesBranch && !matchesDesc) {
          return false;
        }
      }

      if (filters.selectedCategory && filters.selectedCategory !== "All") {
        if (product.category !== filters.selectedCategory) {
          return false;
        }
      }

      if (filters.selectedConditions.length > 0) {
        if (!filters.selectedConditions.includes(product.condition)) {
          return false;
        }
      }

      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-low") return a.price - b.price;
      if (filters.sortBy === "price-high") return b.price - a.price;
      return 0;
    });
  }, [filters, products]);

  // Handlers
  const handleSearchChange = (query: string) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, searchQuery: query }));
    });
  };

  const handleCategorySelect = (category: string) => {
    startTransition(() => {
      setFilters((prev) => ({
        ...prev,
        selectedCategory: prev.selectedCategory === category && category !== "All" ? "All" : category,
      }));
    });
  };

  const handleToggleCondition = (condition: ConditionType) => {
    startTransition(() => {
      setFilters((prev) => {
        const exists = prev.selectedConditions.includes(condition);
        const updated = exists
          ? prev.selectedConditions.filter((c) => c !== condition)
          : [...prev.selectedConditions, condition];
        return { ...prev, selectedConditions: updated };
      });
    });
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, priceRange: range }));
    });
  };

  const handleResetFilters = () => {
    startTransition(() => {
      setFilters({
        searchQuery: "",
        selectedCategory: "All",
        selectedConditions: [],
        priceRange: [0, 10000],
        sortBy: "recent",
      });
    });
  };

  // Active filter count
  const activeFilterCount =
    (filters.selectedCategory !== "All" ? 1 : 0) +
    filters.selectedConditions.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* 1. Sticky Navbar */}
      <MarketplaceNavbar
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* 2. Hero Header */}
      <HeroHeader
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        totalListingsCount={products.length}
      />

      {/* 3. Category Chips Bar */}
      <CategoryChips
        selectedCategory={filters.selectedCategory}
        onSelectCategory={handleCategorySelect}
        categoryCounts={categoryCounts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Controls Bar: Total counts, filter toggle, sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
              {filters.selectedCategory === "All" ? "All Listings" : filters.selectedCategory}
            </h2>
            <span className="text-xs text-[#64748B] bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0] font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
            </span>

            {filters.searchQuery && (
              <span className="text-xs text-[#64748B] flex items-center gap-1">
                for &ldquo;<span className="font-semibold text-[#0F172A]">{filters.searchQuery}</span>&rdquo;
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="text-[#94A3B8] hover:text-[#0F172A] ml-1"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Desktop Filter Toggle */}
            <button
              type="button"
              onClick={() => setDesktopFilterOpen(!desktopFilterOpen)}
              className={`hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                desktopFilterOpen
                  ? "bg-white text-[#2563EB] border-[#BFDBFE] shadow-xs"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]"
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>{desktopFilterOpen ? "Hide Filters" : "Show Filters"}</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile Filter Trigger */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-[#0F172A] border border-[#E2E8F0] shadow-xs"
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 shadow-xs">
              <ArrowUpDown size={13} className="text-[#94A3B8]" />
              <span className="text-[11px] text-[#94A3B8] font-medium hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState["sortBy"],
                  }))
                }
                className="text-xs font-medium text-[#0F172A] bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex items-start gap-7">
          {/* 4. Desktop Filter Sidebar */}
          {desktopFilterOpen && (
            <div className="hidden md:block w-64 lg:w-72 shrink-0 sticky top-36">
              <FilterSidebar
                selectedCategory={filters.selectedCategory}
                onSelectCategory={handleCategorySelect}
                selectedConditions={filters.selectedConditions}
                onToggleCondition={handleToggleCondition}
                priceRange={filters.priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                onResetFilters={handleResetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          )}

          {/* 5. Marketplace Grid */}
          <div className="flex-1 w-full min-w-0">
            {loading || isPending ? (
              <ProductSkeletonGrid count={8} />
            ) : filteredProducts.length > 0 ? (
              <div
                id="marketplace-grid"
                className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${
                  desktopFilterOpen
                    ? "lg:grid-cols-3 xl:grid-cols-4"
                    : "lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ListingCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* 6. Empty State */
              <EmptyState
                title="No college items match your filters"
                description={`We couldn't find any listings for "${filters.searchQuery || filters.selectedCategory}". Try clearing your search query or broadening your price filter.`}
                onReset={handleResetFilters}
                showReset={activeFilterCount > 0}
              />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#2563EB]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">Filter Listings</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A]"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>

              <FilterSidebar
                selectedCategory={filters.selectedCategory}
                onSelectCategory={handleCategorySelect}
                selectedConditions={filters.selectedConditions}
                onToggleCondition={handleToggleCondition}
                priceRange={filters.priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                onResetFilters={handleResetFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>

            <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}