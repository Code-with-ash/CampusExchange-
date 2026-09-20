import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Browse Listings", href: "/marketplace" },
    { label: "Sell an Item", href: "/Sell" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/PrivacyPolicy" },
    { label: "Terms of Service", href: "/TermsAndConditions" },
  ],
  Support: [
    { label: "Contact Us", href: "/ContactUs" },
    // { label: "Report a Listing", href: "/ContactUs" },
  ],
};

// const socials = [
//   // { icon: Twitter, label: "Twitter", href: "#" },
//   // { icon: Instagram, label: "Instagram", href: "#" },
//   // { icon: Github, label: "GitHub", href: "#" },
// ];

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-[#1E293B]" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4" id="footer-logo">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-white text-[1.05rem] tracking-tight">
                Campus<span className="text-[#60A5FA]">Exchange</span>
              </span>
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-xs">
              The peer-to-peer marketplace designed exclusively for college students.
              Buy, sell, and save within your campus community.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-widest mb-4">
                {section}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#475569]">
            © {new Date().getFullYear()} Campus Exchange. All rights reserved.
          </p>
          <p className="text-xs text-[#475569]">
            Made with ❤️ for students, by a student
          </p>
        </div>
      </div>
    </footer>
  );
}
