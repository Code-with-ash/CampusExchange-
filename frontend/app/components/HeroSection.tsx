"use client";

import { Search } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC]" id="hero">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #E2E8F0 1px, transparent 0)`,
          backgroundSize: "32px 32px",
          opacity: 0.5,
        }}
      />
      {/* Soft glow accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(37,99,235,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-20">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span
            id="hero-badge"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-semibold tracking-wide uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] inline-block" />
            Student-only marketplace
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center font-bold text-[#0F172A] tracking-tight text-balance leading-[1.08]" style={{ fontSize: "clamp(2.6rem, 6vw, 4.25rem)" }}>
          The Marketplace{" "}
          <span className="text-[#2563EB]">Built for</span>
          <br />
          Your Campus.
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-2xl mx-auto text-center text-[#64748B] text-pretty leading-relaxed" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
          Find affordable books, engineering tools, electronics, and hostel
          essentials from students in your own college.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
          <Link
            href="/marketplace"
            id="hero-browse-btn"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all duration-200"
          >
            Browse Listings
          </Link>
          <Link
            href="#cta"
            id="hero-sell-btn"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-[#0F172A] bg-white border border-[#E2E8F0] rounded-xl hover:border-[#CBD5E1] hover:shadow-sm transition-all duration-200"
          >
            Sell an Item
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search
              className="absolute left-4 text-[#94A3B8] pointer-events-none"
              size={18}
              strokeWidth={2}
            />
            <input
              id="hero-search"
              type="text"
              placeholder="Search for books, drafter, calculator…"
              className="w-full pl-11 pr-4 py-3.5 text-sm text-[#0F172A] placeholder-[#94A3B8] bg-white border border-[#E2E8F0] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-200"
            />
            <button
              id="hero-search-btn"
              type="button"
              className="absolute right-2 px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8] transition-colors duration-200"
            >
              Search
            </button>
          </div>
          <p className="mt-3 text-center text-[#94A3B8] text-xs">
            Popular: Fluid Mechanics, Texas TI-84, Engineering Drawing Set, Lab Coat
          </p>
        </div>
      </div>
    </section>
  );
}
