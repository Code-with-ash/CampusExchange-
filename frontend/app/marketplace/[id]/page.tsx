import Link from "next/link";
import { notFound } from "next/navigation";
import MarketplaceNavbarWrapper from "./MarketplaceNavbarWrapper";
import Footer from "../../components/Footer";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Share2,
  Heart,
  BadgeAlert,
} from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  let product: any = null;

  try {
    const response = await fetch("http://localhost:3001/api/listings", { cache: "no-store" });
    const json = await response.json();
    product = (json.data || []).find((item: any) => item.id === id);
  } catch (error) {
    product = null;
  }

  if (!product) {
    notFound();
  }

  const fallbackImage =
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80";
  const mainImage = product.imageUrl || (Array.isArray(product.images) ? product.images[0] : "") || fallbackImage;
  const whatsappMessage = encodeURIComponent(
    `Hi ${product.sellerName || "there"}, I saw your listing for "${product.title}" (₹${product.price}) on Campus Exchange. Is it still available?`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <MarketplaceNavbarWrapper />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to all listings</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 bg-[#F8FAFC] p-6 sm:p-10 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-[#E2E8F0]">
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] bg-white">
              <img
                src={mainImage}
                alt={product.title}
                // onError={(e) => {
                //   const target = e.currentTarget as HTMLImageElement;
                //   if (target.src !== fallbackImage) target.src = fallbackImage;
                // }}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#0F172A] text-xs font-semibold rounded-lg border border-[#E2E8F0] shadow-xs">
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  {product.condition}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94A3B8] inline-flex items-center gap-1">
                    <Clock size={12} />
                    {product.postedTime || "Recently listed"}
                  </span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight leading-snug">
                {product.title}
              </h1>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#0F172A]">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-[#94A3B8] line-through">
                      ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <p className="text-xs text-emerald-600 font-medium">
                    You save ₹{(Number(product.originalPrice) - Number(product.price)).toLocaleString("en-IN")} (
                    {Math.round(
                      ((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100
                    )}
                    % discount compared to retail)
                  </p>
                )}
              </div>

              {product.description && (
                <div>
                  <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
                    Item Description
                  </h2>
                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-sm flex items-center justify-center border border-[#BFDBFE]">
                      {product.sellerName ? product.sellerName[0] : "S"}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-[#0F172A]">
                          {product.sellerName || "Verified Student"}
                        </p>
                        <span className="text-[#2563EB]" title="Verified Student Identity">
                          <ShieldCheck size={14} strokeWidth={2.5} />
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">
                        {product.branch || "Campus Seller"} • {product.sellerYear || "Student"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-1 text-[11px] text-[#64748B]">
                  <MapPin size={12} className="text-[#94A3B8]" />
                  <span>Pickup location: <strong className="text-[#0F172A]">{product.location || product.pickuplocation || "Campus Library / Main Gate"}</strong></span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/${(product.whatsappNumber || "+919876543210").replace(/[^0-9]/g, "")}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all"
              >
                <MessageCircle size={17} strokeWidth={2.5} />
                <span>Chat with Seller on WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1.5 bg-white transition-colors"
                >
                  <Heart size={14} />
                  <span>Save Item</span>
                </button>
                <button
                  type="button"
                  className="py-2.5 px-3 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1.5 bg-white transition-colors"
                  title="Share"
                >
                  <Share2 size={14} />
                </button>
              </div>

              <div className="pt-2 flex items-start gap-1.5 text-[11px] text-[#94A3B8]">
                <BadgeAlert size={13} className="shrink-0 mt-0.5 text-amber-500" />
                <span>Always meet in public campus locations like hostels, library, or food courts for inspection and exchange.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
