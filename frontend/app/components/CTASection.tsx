import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]" id="cta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#2563EB] rounded-3xl px-8 py-16 sm:px-14 sm:py-20 text-center shadow-xl">
          {/* Background decoration */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />

          <div className="relative">
            {/* Icon */}
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package size={26} className="text-white" strokeWidth={2} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
              Have unused college items?
            </h2>
            <p className="mt-3 text-blue-200 text-lg font-medium">
              Turn them into cash.
            </p>
            <p className="mt-4 text-blue-100/80 max-w-md mx-auto text-sm leading-relaxed">
              List your old books, tools, or gear in minutes. Thousands of students are
              looking for exactly what you have.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/Sell"
                id="cta-start-selling"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-white text-[#2563EB] rounded-xl hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Start Selling
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <Link
                href="#how-it-works"
                id="cta-learn-how"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold border border-white/30 text-white rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Learn how it works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
