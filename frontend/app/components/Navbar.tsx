"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Menu,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Browse" },
  { href: "/#how-it-works", label: "How to Sell?" },
  { href: "/#features", label: "About" },
];
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Student");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? "S";
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  };

  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
      setUserName(
        localStorage.getItem("user") ||
          localStorage.getItem("username") ||
          "Student",
      );
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const handleSignOut = () => {
    ["token", "user", "username", "branch", "year"].forEach((key) =>
      localStorage.removeItem(key),
    );
    setIsLoggedIn(false);
    setUserName("Student");
    setProfileMenuOpen(false);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" id="nav-logo">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[#0F172A] text-[1.05rem] tracking-tight">
              Campus<span className="text-[#2563EB]">Exchange</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                id={`nav-${link.label.toLowerCase()}`}
                className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F8FAFC] transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  id="nav-profile"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={profileMenuOpen}
                  className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white py-1 pl-1 pr-3 text-left hover:border-[#CBD5E1]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#2563EB]">
                    {getInitials(userName)}
                  </span>
                  <span className="max-w-32 truncate text-sm font-medium text-[#0F172A]">
                    {userName}
                  </span>
                  <ChevronDown size={14} className="text-[#94A3B8]" />
                </button>
                {profileMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[#E2E8F0] bg-white py-1 shadow-lg"
                  >
                    <Link
                      href="/profile/mylistings"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    >
                      <User size={15} />
                      My Listings
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 border-t border-[#F1F5F9] px-3.5 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                id="nav-login"
                className="px-4 py-2 text-sm font-medium text-[#2563EB] hover:text-[#0F172A] transition-colors duration-150"
              >
                Login
              </Link>
            )}
            <Link
              href="/Sell"
              id="nav-sell-item"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              Sell Item
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="nav-mobile-menu"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#E2E8F0] space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 px-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 rounded-lg bg-[#F8FAFC] px-3 py-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#2563EB]">
                      {getInitials(userName)}
                    </span>
                    <span className="truncate text-sm font-medium text-[#0F172A]">
                      {userName}
                    </span>
                  </div>
                  <Link
                    href="/profile/mylistings"
                    onClick={() => setIsOpen(false)}
                    className="py-2.5 text-center text-sm font-medium text-[#2563EB] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                  >
                    My Listings
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="py-2.5 text-center text-sm font-medium text-rose-600 border border-[#E2E8F0] rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                >
                  Login
                </Link>
              )}
              <Link
                href="/Sell"
                onClick={() => setIsOpen(false)}
                className="py-2.5 text-center text-sm font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8] transition-colors"
              >
                Sell Item
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
