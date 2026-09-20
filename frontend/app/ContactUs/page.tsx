"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ChevronDown,
  Copy,
  Check,
  Sparkles,
  LifeBuoy,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Safety" | "Listings";
}

const faqs: FAQItem[] = [
  {
    category: "Safety",
    question: "Where should I meet the buyer/seller on campus?",
    answer:
      "We strongly recommend meeting in well-lit, populated public spots on your campus, such as the college library foyer, student center/union, or the main cafeteria during daytime hours. Never meet in private residences or off-campus secluded spots.",
  },
  {
    category: "General",
    question: "Is CampusExchange free for college students?",
    answer:
      "Yes! CampusExchange is 100% free for students. There are no listing fees, buyer fees, or transaction commissions. You trade directly with peers.",
  },
  {
    category: "General",
    question: "How does verification work?",
    answer:
      "Students can verify their account using their official college email ID (.edu / campus domain) or student ID card. Verified students receive a verified badge on all their listings and profile.",
  },
  {
    category: "Listings",
    question: "How do I mark an item as sold or remove it?",
    answer:
      "Go to your Profile page, find the listing under 'My Listings', and click 'Mark as Sold' or 'Delete Listing'. This keeps the marketplace updated for everyone.",
  },
  {
    category: "Safety",
    question: "What should I do if I suspect a fraudulent listing or spam?",
    answer:
      "Click the 'Report Listing' button directly on the item page or contact our support team at support@campusexchange.edu. We inspect and take down violations promptly.",
  },
];

export default function ContactUs() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeFaqTab, setActiveFaqTab] = useState<string>("All");

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredFaqs =
    activeFaqTab === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === activeFaqTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-[#F8FAFC] py-16 sm:py-20 border-b border-[#E2E8F0]">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-semibold mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Community & Support Desk</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              We&apos;re here to help you trade safely
            </h1>
            <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              Got a question about a listing, need verification assistance, or want to bring CampusExchange to your college? Reach out to our student support team.
            </p>
          </div>
        </section>

        {/* Quick Contact Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 flex justify-center">
          <div className="w-full max-w-md">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-1">Support</h3>
              <p className="text-xs text-[#64748B] mb-3">Questions on listings, accounts, and features or anything else.</p>
              <div className="flex items-center justify-between text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2">
                <span className="font-mono text-[#0F172A] truncate">support@campusexchange.edu</span>
                <button
                  onClick={() => handleCopy("support@campusexchange.edu")}
                  className="text-[#64748B] hover:text-[#2563EB] ml-2 p-1 cursor-pointer"
                  title="Copy email"
                >
                  {copiedEmail === "support@campusexchange.edu" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border-t border-[#E2E8F0] py-14 sm:py-18">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-[#64748B] mt-2">
                Quick answers to common questions about buying and selling on CampusExchange.
              </p>

              {/* Filter Tabs */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {["All", "Safety", "General", "Listings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFaqTab(tab)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      activeFaqTab === tab
                        ? "bg-[#2563EB] text-white shadow-xs"
                        : "bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all bg-[#F8FAFC]/50 hover:border-blue-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    >
                      <span className="text-sm font-bold text-[#0F172A]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#64748B] transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-[#2563EB]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-[#64748B] leading-relaxed border-t border-[#E2E8F0]/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}