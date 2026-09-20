"use client";

import MarketplaceNavbar from "../components/MarketplaceNavbar";
import { useRouter } from "next/navigation";

export default function MarketplaceNavbarWrapper() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(query)}`);
    }
  };

  return <MarketplaceNavbar searchQuery="" onSearchChange={handleSearch} />;
}
