"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Database,
  Trash2,
  Mail,
  ChevronRight,
  Sparkles,
  Printer,
  Check,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: any;
  summary: string;
  content: React.ReactNode;
}

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const sections: Section[] = [
    {
      id: "overview",
      title: "1. Overview & Campus Commitment",
      icon: ShieldCheck,
      summary: "CampusExchange is built by students for students. We strictly do not sell your personal data to advertisers or third-party brokers.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            Welcome to <strong>CampusExchange</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting the privacy and personal data of every student who uses our peer-to-peer campus marketplace.
          </p>
          <p>
            This Privacy Policy explains what information we collect, why we collect it, how it is secured, and what controls you have when using our website and services. By accessing CampusExchange, you acknowledge the terms outlined in this policy.
          </p>
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Our Core Promise: </span>
              We do not track you across the web, run predatory third-party advertising, or monetize student identities. Information collected is strictly used to maintain a trusted and safe college trading network.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      icon: FileText,
      summary: "We only collect essential details needed to create your account, verify your college affiliation, and display your listings.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            To provide a trustworthy campus-only platform, we collect the following types of information:
          </p>
          <ul className="space-y-3 pl-2">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <div>
                <strong className="text-[#0F172A]">Account & Student Identity:</strong> When you register, we collect your name, college email address (e.g., ending with <code>.edu</code> or college domain), institution/university name, course/branch, and year of study.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <div>
                <strong className="text-[#0F172A]">Listing Content:</strong> Titles, item descriptions, prices, category tags (e.g., Engineering Tools, Textbooks, Hostel Essentials), condition, and uploaded photos of the items you wish to sell.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <div>
                <strong className="text-[#0F172A]">Verification Credentials:</strong> Optional student ID cards or verification tokens provided to earn the &ldquo;Verified Student&rdquo; badge.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <div>
                <strong className="text-[#0F172A]">Usage & Device Data:</strong> Standard server logs, browser type, operating system, and IP address collected automatically for spam mitigation and network defense.
              </div>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Information",
      icon: UserCheck,
      summary: "Your data is used to operate the marketplace, connect buyers and sellers within the same campus, and block fraud.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>We use the data we collect solely for the following legitimate purposes:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <h5 className="text-xs font-bold text-[#0F172A] mb-1">Campus Community Matching</h5>
              <p className="text-xs text-[#64748B]">Showing relevant listings to students in the same university or nearby hostels.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <h5 className="text-xs font-bold text-[#0F172A] mb-1">Peer Communication</h5>
              <p className="text-xs text-[#64748B]">Allowing interested student buyers to reach out directly to sellers via secure channels.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <h5 className="text-xs font-bold text-[#0F172A] mb-1">Fraud & Scam Prevention</h5>
              <p className="text-xs text-[#64748B]">Detecting spam bots, banned accounts, duplicate accounts, or stolen merchandise.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <h5 className="text-xs font-bold text-[#0F172A] mb-1">Platform Updates & Support</h5>
              <p className="text-xs text-[#64748B]">Responding to customer tickets and sending account verification confirmations.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "campus-visibility",
      title: "4. Campus Visibility vs. Private Data",
      icon: Eye,
      summary: "You have complete transparency over what other college students can see versus what is kept strictly private.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>We maintain strict boundaries between public campus profiles and confidential account data:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#E2E8F0] rounded-xl overflow-hidden">
              <thead className="bg-[#F1F5F9] text-[#0F172A] font-bold">
                <tr>
                  <th className="p-3">Data Field</th>
                  <th className="p-3">Visible to Campus Peers</th>
                  <th className="p-3">Private & Encrypted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#64748B]">
                <tr>
                  <td className="p-3 font-medium text-[#0F172A]">Display Name & College / Branch</td>
                  <td className="p-3 text-emerald-600 font-semibold">Yes (On listings & profile)</td>
                  <td className="p-3">No</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#0F172A]">Listing Photos, Title & Price</td>
                  <td className="p-3 text-emerald-600 font-semibold">Yes (Marketplace Browse)</td>
                  <td className="p-3">No</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#0F172A]">College Email & Phone Number</td>
                  <td className="p-3 text-amber-600 font-medium">Only if explicitly shared by you in chat</td>
                  <td className="p-3 text-emerald-600 font-semibold">Yes (Hidden by default)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#0F172A]">Student ID Verification Photos</td>
                  <td className="p-3 text-red-500 font-semibold">Never visible to public</td>
                  <td className="p-3 text-emerald-600 font-semibold">Yes (Deleted after manual check)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#0F172A]">Password / Auth Tokens</td>
                  <td className="p-3 text-red-500 font-semibold">Never visible</td>
                  <td className="p-3 text-emerald-600 font-semibold">Yes (Hashed with bcrypt/salt)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "data-security",
      title: "5. Data Storage & Security Measures",
      icon: Lock,
      summary: "All communications and passwords are encrypted using modern cryptographic standards.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            We implement industry-standard administrative, physical, and technical safeguards to protect your personal information:
          </p>
          <ul className="space-y-2.5 pl-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong>TLS/HTTPS Encryption:</strong> All data transmitted between your browser and our servers is secured with TLS 1.3 encryption.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong>Hashed Passwords:</strong> Passwords are never stored in plaintext and are salted and hashed using cryptographic algorithms.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong>Restricted Database Access:</strong> Only authorized system operators have access to database clusters under strict multi-factor authentication.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "cookies-storage",
      title: "6. Cookies & Local Storage",
      icon: Database,
      summary: "We only use essential functional cookies for authentication state and local UI preferences.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            CampusExchange uses minimal, essential cookies and browser LocalStorage solely to:
          </p>
          <ul className="space-y-2 pl-2">
            <li>• Maintain your active session when logged into the marketplace.</li>
            <li>• Remember your selected filter preferences (such as price filters or category choice).</li>
            <li>• Prevent Cross-Site Request Forgery (CSRF) attacks.</li>
          </ul>
          <p>
            We do <strong>not</strong> load third-party ad-tracking pixels (e.g. Facebook Pixel, ad retargeting networks).
          </p>
        </div>
      ),
    },
    {
      id: "your-rights",
      title: "7. Your Rights & Data Controls",
      icon: Trash2,
      summary: "You can update your listings, edit your profile, or delete your entire account and all data at any time.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>As a CampusExchange user, you have full control over your data:</p>
          <ul className="space-y-2.5 pl-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span><strong>Right to Access & Edit:</strong> You can edit your profile information, phone visibility, and listing details from your Profile settings at any time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span><strong>Right to Erasure (Account Deletion):</strong> You can request immediate and permanent deletion of your account and all associated listings by contacting <span className="font-semibold text-[#0F172A]">support@campusexchange.edu</span>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span><strong>Right to Data Export:</strong> You may request a JSON export of your listings and profile data.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "contact-privacy",
      title: "8. Contact Data Privacy Officer",
      icon: Mail,
      summary: "Have questions about our privacy practices? Reach out to our campus data team.",
      content: (
        <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please reach out to us:
          </p>
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="font-semibold text-xs text-[#0F172A]">CampusExchange Data Protection Desk</div>
            <div className="text-xs text-[#64748B]">Email: <a href="mailto:privacy@campusexchange.edu" className="text-[#2563EB] hover:underline font-mono">privacy@campusexchange.edu</a></div>
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
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Privacy & Student Data Protection</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  Privacy Policy
                </h1>
                <p className="text-sm text-[#64748B] mt-2">
                  Last updated: September 18, 2026 • Version 2.1
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
                  <span>{copiedLink ? "Link Copied!" : "Share Policy"}</span>
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

            {/* Quick Plain English Banner */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white border border-blue-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    Campus Privacy First
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    We will never sell or monetize your personal college data. Everything is designed around safe student-to-student exchanges.
                  </p>
                </div>
              </div>
              <Link
                href="/ContactUs"
                className="shrink-0 px-3.5 py-1.5 text-xs font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                Ask a Question →
              </Link>
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
                  Table of Contents
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
                <h4 className="text-xs font-bold mb-1">Have questions about your data?</h4>
                <p className="text-[11px] text-slate-300 mb-3">
                  Reach out to our student data privacy officers anytime.
                </p>
                <Link
                  href="/ContactUs"
                  className="inline-block px-3.5 py-1.5 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition"
                >
                  Contact Desk
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