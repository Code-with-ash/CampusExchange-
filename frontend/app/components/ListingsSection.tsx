"use client"
import Link from "next/link";
import ListingCard, { ListingCardProps } from "./ListingCard";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { Product } from "../marketplace/types";



export default function ListingsSection() {
  const [listings, setListings] = useState<Product[]>([]);
  useEffect(() => {
    const getData = async () => {
      const response = await fetch("http://localhost:3001/api/listings");
      const data = await response.json();
      setListings(data.data);
    };
    getData();
  }, []);
  return (
    <section className="py-20 sm:py-24 bg-white border-t border-[#E2E8F0]" id="listings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
              Featured Listings
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
              Fresh on the market
            </h2>
            <p className="mt-3 text-[#64748B] text-base">
              Hand-picked listings from students on your campus.
            </p>
          </div>
          <Link
            href="/marketplace"
            id="listings-view-all"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors shrink-0"
          >
            View all listings
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Listings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(listings) && listings.slice(0, 6).map((listing: Product) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
