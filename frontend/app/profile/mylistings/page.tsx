"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Search,
  ShoppingBag,
  Tag,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  LayoutGrid,
  List,
  IndianRupee,
  Package,
  TrendingUp,
  X,
  Share2,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import MarketplaceNavbar from "@/app/marketplace/components/MarketplaceNavbar";
import { CategoryType, ConditionType, Product } from "@/app/marketplace/types";

const CATEGORIES: (CategoryType | "All")[] = [
  "All",
  "Engineering Tools",
  "Books",
  "Electronics",
  "Hostel",
  "Lab Equipment",
  "Others",
];

const CONDITIONS: { value: ConditionType; label: string; color: string }[] = [
  { value: "Like New", label: "Like New", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "Good", label: "Good", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "Fair", label: "Fair", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function MyListingsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Authentication & User State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("ME");

  // Listings State
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCondition, setSelectedCondition] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "title">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modals & Action State
  const [deleteModalItem, setDeleteModalItem] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editModalItem, setEditModalItem] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<{
    title: string;
    description: string;
    price: string;
    originalPrice: string;
    category: CategoryType | "";
    condition: ConditionType | "";
    pickuplocation: string;
  }>({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    condition: "",
    pickuplocation: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // Helper for initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? "U";
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  };

  // Check auth & fetch user listings
  const fetchMyListings = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setIsLoggedIn(true);
    const storedUser = localStorage.getItem("user") || "Student";
    const storedBranch = localStorage.getItem("branch") || "";
    const storedYear = localStorage.getItem("year") || "";

    setUserName(storedUser);
    setDepartment(storedBranch);
    setYear(storedYear);
    setUserInitials(getInitials(storedUser));

    try {
      const response = await axios.get("http://localhost:3001/api/listings/my-listings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setListings(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch my listings:", error);
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
      } else {
        showToast("Could not load your listings. Please try again.", "error");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  // Filtered & Sorted Listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesCategory = item.category.toLowerCase().includes(q);
          const matchesDesc = (item.description || "").toLowerCase().includes(q);
          const matchesLocation = (item.pickuplocation || item.location || "").toLowerCase().includes(q);
          if (!matchesTitle && !matchesCategory && !matchesDesc && !matchesLocation) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== "All" && item.category !== selectedCategory) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== "All" && item.condition !== selectedCondition) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        // Default newest
        return 0;
      });
  }, [listings, searchQuery, selectedCategory, selectedCondition, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = listings.length;
    const totalInventoryValue = listings.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const avgPrice = totalCount > 0 ? Math.round(totalInventoryValue / totalCount) : 0;
    const categoriesCount = new Set(listings.map((item) => item.category)).size;

    return {
      totalCount,
      totalInventoryValue,
      avgPrice,
      categoriesCount,
    };
  }, [listings]);

  // Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: listings.length };
    listings.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [listings]);

  // Handle Delete Confirmation
  const handleDeleteListing = async () => {
    if (!deleteModalItem) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setDeletingId(deleteModalItem.id);
    try {
      await axios.delete(`http://localhost:3001/api/listings/${deleteModalItem.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Optimistically remove from state
      setListings((prev) => prev.filter((item) => item.id !== deleteModalItem.id));
      showToast(`"${deleteModalItem.title}" has been deleted.`, "success");
      setDeleteModalItem(null);
    } catch (error) {
      console.error("Error deleting listing:", error);
      showToast("Failed to delete listing. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: Product) => {
    setEditModalItem(item);
    setEditFormData({
      title: item.title,
      description: item.description || "",
      price: String(item.price),
      originalPrice: item.originalPrice ? String(item.originalPrice) : "",
      category: item.category,
      condition: item.condition,
      pickuplocation: item.pickuplocation || item.location || "",
    });
    setEditErrors({});
  };

  // Handle Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalItem) return;

    const errors: { [key: string]: string } = {};
    if (!editFormData.title.trim()) errors.title = "Title is required";
    if (!editFormData.price || Number(editFormData.price) <= 0) errors.price = "Valid selling price is required";
    if (!editFormData.category) errors.category = "Category is required";
    if (!editFormData.condition) errors.condition = "Condition is required";

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setSavingEdit(true);
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:3001/api/listings/${editModalItem.id}`,
        {
          title: editFormData.title.trim(),
          description: editFormData.description.trim(),
          price: editFormData.price,
          originalPrice: editFormData.originalPrice || null,
          category: editFormData.category,
          condition: editFormData.condition,
          pickuplocation: editFormData.pickuplocation.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setListings((prev) =>
        prev.map((item) =>
          item.id === editModalItem.id
            ? {
                ...item,
                title: editFormData.title.trim(),
                description: editFormData.description.trim(),
                price: Number(editFormData.price),
                originalPrice: editFormData.originalPrice ? Number(editFormData.originalPrice) : null,
                category: editFormData.category as CategoryType,
                condition: editFormData.condition as ConditionType,
                pickuplocation: editFormData.pickuplocation.trim(),
                location: editFormData.pickuplocation.trim(),
              }
            : item
        )
      );

      showToast("Listing updated successfully!", "success");
      setEditModalItem(null);
    } catch (error) {
      console.error("Error updating listing:", error);
      showToast("Failed to update listing. Please try again.", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  // Copy shareable link
  const handleShare = (item: Product) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/marketplace?search=${encodeURIComponent(item.title)}`;
      navigator.clipboard.writeText(url);
      showToast("Listing link copied to clipboard!", "info");
    }
  };

  // Unauthenticated State View
  if (isLoggedIn === false) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <MarketplaceNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 sm:p-10 text-center">
            <div className="w-16 h-16 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#2563EB]">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Access Your Listings</h2>
            <p className="text-sm text-[#64748B] mt-2 mb-8 leading-relaxed">
              Please log in with your student account to view, manage, and track your active campus marketplace listings.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all text-center flex items-center justify-center gap-2"
              >
                Sign In to Account
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/marketplace"
                className="w-full py-3 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                Return to Marketplace
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* 1. Global Navbar */}
      <MarketplaceNavbar
        searchQuery={searchQuery}
        onSearchChange={(q) => startTransition(() => setSearchQuery(q))}
      />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${
              toastMessage.type === "success"
                ? "bg-white/95 border-emerald-200 text-emerald-900"
                : toastMessage.type === "error"
                ? "bg-white/95 border-rose-200 text-rose-900"
                : "bg-white/95 border-blue-200 text-[#0F172A]"
            }`}
          >
            {toastMessage.type === "success" && <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />}
            {toastMessage.type === "error" && <AlertCircle size={18} className="text-rose-600 shrink-0" />}
            {toastMessage.type === "info" && <Sparkles size={18} className="text-[#2563EB] shrink-0" />}
            <span className="text-xs font-medium">{toastMessage.text}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-[#94A3B8] hover:text-[#0F172A] ml-2"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="text-[#CBD5E1]" />
          <Link href="/marketplace" className="hover:text-[#0F172A] transition-colors">
            Marketplace
          </Link>
          <ChevronRight size={13} className="text-[#CBD5E1]" />
          <span className="text-[#0F172A] font-semibold">My Listings</span>
        </div>

        {/* Profile / Listings Hero Section */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-bl from-blue-100/60 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* User Identity Info */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1E40AF] text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-md shrink-0">
                {userInitials}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                    {userName ? `${userName}'s Inventory` : "My Listings"}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
                    <ShieldCheck size={12} />
                    Verified Student Seller
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-1 flex items-center gap-2">
                  <span>{department || "Engineering"}</span>
                  {year && <span>• Year {year}</span>}
                  <span>• Campus Exchange Member</span>
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fetchMyListings(true)}
                disabled={refreshing}
                title="Refresh listings"
                className="p-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-all disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin text-[#2563EB]" : ""} />
              </button>
              <Link
                href="/Sell"
                id="my-listings-post-new-btn"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Post New Listing</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-7 pt-6 border-t border-[#F1F5F9]">
            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]/80">
              <div className="flex items-center justify-between text-[#64748B] mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Total Items</span>
                <Package size={15} className="text-[#2563EB]" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0F172A]">{stats.totalCount}</p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Listed in marketplace</p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]/80">
              <div className="flex items-center justify-between text-[#64748B] mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Total Value</span>
                <IndianRupee size={15} className="text-emerald-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0F172A]">₹{stats.totalInventoryValue.toLocaleString()}</p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Estimated gross value</p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]/80">
              <div className="flex items-center justify-between text-[#64748B] mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Price</span>
                <TrendingUp size={15} className="text-indigo-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0F172A]">₹{stats.avgPrice.toLocaleString()}</p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Per item average</p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]/80">
              <div className="flex items-center justify-between text-[#64748B] mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Categories</span>
                <Layers size={15} className="text-amber-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#0F172A]">{stats.categoriesCount}</p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Active categories</p>
            </div>
          </div>
        </div>

        {/* Filter, Search & View Controls Bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            {/* Search within my listings */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your listings by title, category, spot..."
                className="w-full pl-9 pr-8 py-2.5 bg-[#F8FAFC] focus:bg-white text-xs text-[#0F172A] placeholder-[#94A3B8] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns & View Mode Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
              {/* Condition Filter */}
              <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5">
                <span className="text-[11px] text-[#94A3B8] font-medium hidden sm:inline">Condition:</span>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="text-xs font-semibold text-[#0F172A] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="All">All Conditions</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5">
                <span className="text-[11px] text-[#94A3B8] font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold text-[#0F172A] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="newest">Recently Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Title: A to Z</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-[#F8FAFC] p-1 border border-[#E2E8F0] rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white text-[#2563EB] shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white text-[#2563EB] shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                  aria-label="List view"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] border border-[#E2E8F0]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Listing Area */}
        {loading || isPending ? (
          /* Loading Skeleton State */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] p-4 animate-pulse space-y-4">
                <div className="w-full aspect-4/3 bg-[#F1F5F9] rounded-xl" />
                <div className="h-4 bg-[#F1F5F9] rounded-md w-3/4" />
                <div className="h-3 bg-[#F1F5F9] rounded-md w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-[#F1F5F9] rounded-md w-1/3" />
                  <div className="h-8 bg-[#F1F5F9] rounded-lg w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          /* Render Active Listings */
          viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredListings.map((item) => {
                const discount =
                  item.originalPrice && item.originalPrice > item.price
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : null;

                const conditionConfig =
                  CONDITIONS.find((c) => c.value === item.condition) || {
                    value: item.condition,
                    label: item.condition,
                    color: "bg-slate-100 text-slate-700 border-slate-200",
                  };

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Image Thumbnail Container */}
                      <div className="relative aspect-4/3 bg-[#F8FAFC] overflow-hidden border-b border-[#F1F5F9]">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8] p-4 text-center">
                            <ShoppingBag size={32} strokeWidth={1.5} className="mb-1 text-[#CBD5E1]" />
                            <span className="text-[11px] font-medium">No Image Uploaded</span>
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 backdrop-blur-xs text-[#0F172A] border border-[#E2E8F0] shadow-xs">
                            {item.category}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shadow-xs ${conditionConfig.color}`}
                          >
                            {item.condition}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-baseline gap-2 mb-1.5">
                          <span className="text-lg font-bold text-[#0F172A]">₹{item.price}</span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-[#94A3B8] line-through">₹{item.originalPrice}</span>
                          )}
                          {discount && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#64748B] line-clamp-2 mt-1 min-h-[32px]">
                          {item.description || "No description provided for this listing."}
                        </p>

                        {/* Meta Tags */}
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#F1F5F9] text-[11px] text-[#64748B]">
                          {(item.pickuplocation || item.location) && (
                            <div className="flex items-center gap-1 truncate">
                              <MapPin size={12} className="text-[#94A3B8] shrink-0" />
                              <span className="truncate">{item.pickuplocation || item.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 ml-auto shrink-0 text-[#94A3B8]">
                            <Calendar size={12} />
                            <span>{item.postedTime || "Active"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] transition-colors shadow-xs"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShare(item)}
                        title="Copy share link"
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors shadow-xs"
                      >
                        <Share2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteModalItem(item)}
                        title="Delete listing"
                        className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-500 hover:text-rose-700 border border-rose-200 transition-colors shadow-xs"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List / Tabular Management View */
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Item Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Condition</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredListings.map((item) => {
                      const conditionConfig =
                        CONDITIONS.find((c) => c.value === item.condition) || {
                          value: item.condition,
                          label: item.condition,
                          color: "bg-slate-100 text-slate-700 border-slate-200",
                        };

                      return (
                        <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors group">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] overflow-hidden shrink-0">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#94A3B8]">
                                    <ShoppingBag size={16} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[#0F172A] truncate group-hover:text-[#2563EB] transition-colors">
                                  {item.title}
                                </p>
                                <p className="text-[11px] text-[#94A3B8] truncate max-w-xs">
                                  {item.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                              {item.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${conditionConfig.color}`}
                            >
                              {item.condition}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-[#0F172A] text-sm">₹{item.price}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-[10px] text-[#94A3B8] line-through">₹{item.originalPrice}</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-[#64748B]">
                            <div className="flex items-center gap-1 max-w-[140px] truncate">
                              <MapPin size={12} className="text-[#94A3B8] shrink-0" />
                              <span className="truncate">{item.pickuplocation || item.location || "Campus"}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 transition-colors"
                                title="Edit listing"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleShare(item)}
                                className="p-1.5 rounded-lg bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] transition-colors"
                                title="Copy share link"
                              >
                                <Share2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteModalItem(item)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                title="Delete listing"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : listings.length === 0 ? (
          /* Empty State when no items uploaded yet */
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-10 sm:p-14 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center mx-auto mb-5 text-[#2563EB]">
              <Package size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">You haven't listed any items yet</h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 mb-7 max-w-sm mx-auto leading-relaxed">
              Have extra textbooks, drafters, calculators, or hostel gear? Sell directly to fellow students across your campus.
            </p>
            <Link
              href="/Sell"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Create Your First Listing</span>
            </Link>
          </div>
        ) : (
          /* No Search Match State */
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-10 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto mb-4 text-[#94A3B8]">
              <Search size={22} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">No matching listings found</h3>
            <p className="text-xs text-[#64748B] mt-1.5 mb-6">
              No items in your inventory match &ldquo;{searchQuery || selectedCategory}&rdquo;. Try clearing your active search filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedCondition("All");
              }}
              className="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* ── Quick Edit Modal ── */}
      {editModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Edit3 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Edit Listing</h3>
                  <p className="text-[11px] text-[#94A3B8]">Update details for this campus item</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalItem(null)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="overflow-y-auto pr-1 space-y-4 flex-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  placeholder="e.g. Drafter, Casio FX-991EX"
                />
                {editErrors.title && <p className="text-[11px] text-rose-500 mt-1">{editErrors.title}</p>}
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="350"
                  />
                  {editErrors.price && <p className="text-[11px] text-rose-500 mt-1">{editErrors.price}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Original Price (₹) <span className="text-[#94A3B8] font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={editFormData.originalPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    placeholder="900"
                  />
                </div>
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as CategoryType })}
                    className="w-full px-3.5 py-2.5 text-xs text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Condition</label>
                  <select
                    value={editFormData.condition}
                    onChange={(e) => setEditFormData({ ...editFormData, condition: e.target.value as ConditionType })}
                    className="w-full px-3.5 py-2.5 text-xs text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={editFormData.pickuplocation}
                  onChange={(e) => setEditFormData({ ...editFormData, pickuplocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  placeholder="e.g. Hostel Block B, Library Gate"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none"
                  placeholder="Provide honest details on condition and included accessories..."
                />
              </div>

              <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingEdit ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-4 text-rose-600">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Delete this listing?</h3>
            <p className="text-xs text-[#64748B] mt-1.5 mb-6 leading-relaxed">
              Are you sure you want to remove <strong className="text-[#0F172A]">&ldquo;{deleteModalItem.title}&rdquo;</strong> from the marketplace? This action cannot be undone.
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
                disabled={Boolean(deletingId)}
                className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Keep Item
              </button>
              <button
                type="button"
                onClick={handleDeleteListing}
                disabled={Boolean(deletingId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {deletingId ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                <span>{deletingId ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}