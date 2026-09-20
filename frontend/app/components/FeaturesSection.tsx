import { Shield, Tag, MessageCircle } from "lucide-react";

const features = [
  {
    id: "feature-secure",
    icon: Shield,
    title: "Secure Student Marketplace",
    description:
      "Every seller is a verified student from your college. Shop with confidence knowing you're dealing with real peers.",
    color: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    id: "feature-affordable",
    icon: Tag,
    title: "Affordable Second-Hand Deals",
    description:
      "Save up to 80% compared to retail prices. Get the tools and books you need without breaking the bank.",
    color: "#F0FDF4",
    iconColor: "#16A34A",
  },
  {
    id: "feature-whatsapp",
    icon: MessageCircle,
    title: "Direct WhatsApp Contact",
    description:
      "No middleman. Connect directly with sellers over WhatsApp for instant negotiation and pickup coordination.",
    color: "#FFF7ED",
    iconColor: "#EA580C",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24 bg-[#F8FAFC]" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
            Why Campus Exchange
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Built around student needs
          </h2>
          <p className="mt-4 text-[#64748B] max-w-xl mx-auto text-base leading-relaxed">
            We designed every feature for the college experience — fast, simple,
            and trustworthy.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                id={f.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: f.color }}
                >
                  <Icon size={22} color={f.iconColor} strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold text-[#0F172A] mb-2.5 leading-snug">
                  {f.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
