"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  PlusCircle,
  User,
  Bookmark,
  ChevronDown,
} from "lucide-react";

interface MarketplaceNavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function MarketplaceNavbar({
  searchQuery,
  onSearchChange,
}: MarketplaceNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Username");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [userInitials, setUserInitials] = useState("XX");

  const profileRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  };

  const getUserName = () => {
    const user = localStorage.getItem("user");
    const dept = localStorage.getItem("branch");
    const yr = localStorage.getItem("year");
    if (user) {
      setIsLoggedIn(true);
      setUserName(user);
      setUserInitials(getInitials(user));
      setDepartment(dept ?? "");
      setYear(yr ?? "");
    }
  };


  useEffect(() => {
    getUserName();
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handlesignout() {
    localStorage.removeItem("user");
    localStorage.removeItem("branch");
    localStorage.removeItem("year");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("Username");
    setDepartment("");
    setYear("");
    setUserInitials("XX");
    setProfileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            id="marketplace-nav-logo"
          >
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#0F172A] text-[1.05rem] tracking-tight">
              Campus<span className="text-[#2563EB]">Exchange</span>
            </span>
          </Link>

          {/* Quick Search bar in Navbar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                size={16}
                strokeWidth={2}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products, drafters, books..."
                className="w-full pl-9 pr-8 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all duration-150"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] text-xs font-medium"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Nav links & actions */}

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              href="/Sell"
              id="marketplace-nav-sell-cta"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              <PlusCircle size={14} strokeWidth={2.5} />
              <span>Sell Item</span>
            </Link>

            {/* Profile Dropdown */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  id="marketplace-profile-btn"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center">
                    {userInitials}
                  </div>
                  <span className="text-xs font-medium text-[#0F172A]">{userName}</span>
                  <ChevronDown size={13} className="text-[#94A3B8]" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-2 border-b border-[#F1F5F9]">
                      <p className="text-xs font-semibold text-[#0F172A]">{userName}</p>
                      {(department || year) && (
                        <p className="text-[11px] text-[#64748B]">
                          {[department, year].filter(Boolean).join(" • ")}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/profile/mylistings"
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                    >
                      <User size={13} />
                      My Listings
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                    >
                      <Bookmark size={13} />
                      Saved Items
                    </Link>
                    <div className="border-t border-[#F1F5F9] my-1" />
                    <button
                      onClick={handlesignout}
                      type="button"
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-sm hover:shadow transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              size={15}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, drafters, books..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] text-xs text-[#0F172A] placeholder-[#94A3B8] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#E2E8F0] space-y-1">
            <Link
              href="/marketplace"
              className="block px-3 py-2 text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] rounded-lg"
            >
              Browse Marketplace
            </Link>
            <Link
              href="/#how-it-works"
              className="block px-3 py-2 text-xs font-medium text-[#64748B] hover:bg-[#F8FAFC] rounded-lg"
            >
              How It Works
            </Link>
            <Link
              href="/#cta"
              className="block px-3 py-2 text-xs font-medium text-[#64748B] hover:bg-[#F8FAFC] rounded-lg"
            >
              Sell an Item
            </Link>
            {isLoggedIn && (
              <div className="pt-2 flex items-center justify-between px-3 border-t border-[#F1F5F9]">
                <span className="text-xs text-[#64748B]">
                  {userName}
                  {(department || year) &&
                    ` (${[department, year].filter(Boolean).join(" • ")})`}
                </span>
                <button
                  type="button"
                  onClick={handlesignout}
                  className="text-xs text-rose-600 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}