"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FileCheck2,
  AlertOctagon,
  Scale,
  Handshake,
  Ban,
  ShieldAlert,
  HelpCircle,
  ChevronRight,
  Printer,
  Check,
  FileText,
  BadgeAlert,
  Users,
} from "lucide-react";

interface TermSection {
  id: string;
  title: string;
  icon: any;
  summary: string;
  content: React.ReactNode;
}

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState<string>("acceptance");
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const sections: TermSection[] = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms & Eligibility",
      icon: FileCheck2,
      summary: "By accessing CampusExchange, you agree to abide by these terms. The platform is intended for college students, faculty, and alumni.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            Welcome to <strong>CampusExchange</strong>. These Terms and Conditions (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User,&rdquo; &ldquo;Student,&rdquo; or &ldquo;You&rdquo;) and CampusExchange regarding your access to and use of our website, services, and campus peer marketplace.
          </p>
          <p>
            To use this platform, you must:
          </p>
          <ul className="space-y-2 pl-2">
            <li>• Be an active student, faculty member, or verified alumnus of an accredited university or higher education institution.</li>
            <li>• Provide accurate and verifiable registration details (such as your institution email address).</li>
            <li>• Agree to comply with all applicable local laws, campus regulations, and community guidelines.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "account-conduct",
      title: "2. Account Registration & User Conduct",
      icon: Users,
      summary: "You are responsible for your account credentials and maintaining respectful communication with other students.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            When creating an account on CampusExchange:
          </p>
          <ul className="space-y-2.5 pl-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span><strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span><strong>Respectful Conduct:</strong> Harassment, abusive language, stalking, discrimination, or deceptive behavior toward other students in chats or public comments will result in immediate termination of account access.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span><strong>No Commercial Spam:</strong> Bulk scraping, automated bot postings, or commercial business promotions not directly relevant to student peer trading are strictly prohibited.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "prohibited-items",
      title: "3. Prohibited Items & Academic Integrity",
      icon: Ban,
      summary: "We strictly forbid items that violate campus policies, state laws, or academic honesty standards.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs">
            <div className="flex items-center gap-2 font-bold text-red-800 mb-1">
              <AlertOctagon className="w-4 h-4" />
              <span>Zero Tolerance Prohibited Items List</span>
            </div>
            <span>Posting any of the following items will lead to immediate listing removal and possible reporting to university authorities:</span>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <li className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>Academic Dishonesty:</strong> Unreleased exam questions, assignment answers, proxy attendance devices, or cheating materials.</span>
            </li>
            <li className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>Controlled Substances:</strong> Alcohol, tobacco, vapes, prescription medication, narcotics, or drug paraphernalia.</span>
            </li>
            <li className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>Stolen or Campus Property:</strong> Stolen laptops, lab equipment belonging to departments, or university library books.</span>
            </li>
            <li className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>Weapons & Hazardous Materials:</strong> Pocket knives, fireworks, combustible lab chemicals, or dangerous items.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "listing-rules",
      title: "4. Marketplace Listings & Item Integrity",
      icon: Handshake,
      summary: "Sellers must post genuine photographs, describe wear accurately, and set honest student-friendly prices.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>When you create an item listing on CampusExchange:</p>
          <ul className="space-y-2.5 pl-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span><strong>Accurate Representation:</strong> You must accurately represent the condition of the item (e.g., Brand New, Like New, Good, Fair). If a textbook has highlighted pages or an electronic device has cosmetic scratches, you must state this in the description.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span><strong>Authentic Photos:</strong> Photos uploaded must be genuine pictures of the physical item you possess, not stock promotional images.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span><strong>Prompt Updating:</strong> Once an item is handed over or sold, you must promptly mark the item as &ldquo;Sold&rdquo; or delete the listing from your profile.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "payments-handover",
      title: "5. Peer-to-Peer Handover & Transactions",
      icon: Scale,
      summary: "CampusExchange is a discovery platform. Transactions take place directly between buyer and seller in person on campus.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            CampusExchange operates as a peer-to-peer bulletin board connecting students. We do not process payments, escrow funds, or ship physical items.
          </p>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <BadgeAlert className="w-4 h-4 text-amber-700" />
              <span>Important Handover Guidelines:</span>
            </div>
            <ul className="space-y-1 pl-2">
              <li>1. Always meet in person during daylight hours in public campus zones (Library, Student Center, Canteen).</li>
              <li>2. Test electronics, scientific calculators, and lab tools on the spot before making a payment.</li>
              <li>3. Use direct peer UPI (Google Pay, PhonePe, Paytm) or cash only upon physical verification.</li>
              <li>4. Never send advance deposits or wire transfers to unknown individuals.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "liability-disclaimer",
      title: "6. Limitation of Liability & Disclaimers",
      icon: ShieldAlert,
      summary: "Items are sold 'as is' between students. CampusExchange is not liable for disputes or item defects.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            <strong>&ldquo;AS IS&rdquo; Platform Provision:</strong> CampusExchange is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make no warranties, expressed or implied, regarding the condition, safety, quality, or authenticity of items listed by individual students.
          </p>
          <p>
            <strong>No Liability for Transactions:</strong> CampusExchange, its student maintainers, and affiliated university groups shall not be held liable for any direct, indirect, incidental, or consequential damages arising from transactions, item defects, meetups, or user disputes.
          </p>
        </div>
      ),
    },
    {
      id: "moderation-bans",
      title: "7. Moderation, Suspensions & Dispute Resolution",
      icon: AlertOctagon,
      summary: "Our trust team reserves the right to remove listings, suspend accounts, and resolve platform abuses.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            To maintain campus safety, CampusExchange reserves the right to:
          </p>
          <ul className="space-y-2 pl-2">
            <li>• Remove any listing that violates our community standards without prior notice.</li>
            <li>• Suspend or permanently ban users who engage in fraudulent behavior or harass peers.</li>
            <li>• Assist college disciplinary committees or campus security when formal complaints are submitted.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "contact-legal",
      title: "8. Governing Law & Legal Questions",
      icon: HelpCircle,
      summary: "Got questions about our legal policies or need clarification? Get in touch with our team.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the university institution operates.
          </p>
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="font-semibold text-xs text-[#0F172A]">CampusExchange Legal & Safety Desk</div>
            <div className="text-xs text-[#64748B]">Email: <a href="mailto:legal@campusexchange.edu" className="text-[#2563EB] hover:underline font-mono">legal@campusexchange.edu</a></div>
            <div className="text-xs text-[#64748B]">Support Ticket: <Link href="/ContactUs" className="text-[#2563EB] hover:underline">Contact Support Form</Link></div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-50 via-white to-[#F8FAFC] py-14 sm:py-16 border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#2563EB] text-xs font-semibold mb-3">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Campus Marketplace Agreement</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  Terms & Conditions
                </h1>
                <p className="text-sm text-[#64748B] mt-2">
                  Last updated: September 18, 2026 • Effective immediately
                </p>
              </div>

              {/* Utility buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs transition cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-[#64748B]" />}
                  <span>{copiedLink ? "Link Copied!" : "Share Terms"}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>

            {/* Quick Principles Banner */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="text-xs font-bold text-[#0F172A] mb-1">🎓 Student-to-Student Only</div>
                <div className="text-xs text-[#64748B]">Exclusively for verified college students and campus members.</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="text-xs font-bold text-[#0F172A] mb-1">💰 0% Platform Commission</div>
                <div className="text-xs text-[#64748B]">Zero middleman fees. Keep 100% of your earnings.</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="text-xs font-bold text-[#0F172A] mb-1">🛡️ Safe Public Meetups</div>
                <div className="text-xs text-[#64748B]">Conduct handovers in populated, well-lit campus spaces.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section with Sticky Sidebar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Table of Contents */}
            <div className="lg:col-span-4 sticky top-24 hidden lg:block">
              <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
                <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4 px-2">
                  Sections
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? "bg-blue-50 text-[#2563EB]"
                            : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2563EB]" : "text-[#94A3B8]"}`} />
                          <span className="truncate">{section.title}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#2563EB]" : "text-[#CBD5E1]"}`} />
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Need help badge */}
              <div className="mt-4 p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
                <h4 className="text-xs font-bold mb-1">Report a Violation?</h4>
                <p className="text-[11px] text-slate-300 mb-3">
                  Help keep our campus trading space safe and trustworthy.
                </p>
                <Link
                  href="/ContactUs"
                  className="inline-block px-3.5 py-1.5 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition"
                >
                  Report Item / User
                </Link>
              </div>
            </div>

            {/* Right Column: Detailed Sections */}
            <div className="lg:col-span-8 space-y-8">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs scroll-mt-24"
                  >
                    <div className="flex items-start gap-3.5 mb-4 pb-4 border-b border-[#F1F5F9]">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
                          {section.title}
                        </h2>
                        <p className="text-xs font-medium text-[#2563EB] mt-0.5">
                          {section.summary}
                        </p>
                      </div>
                    </div>

                    {section.content}
                  </article>
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