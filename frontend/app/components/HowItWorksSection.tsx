import { ListPlus, Search, MessageSquare } from "lucide-react";

const steps = [
  {
    id: "step-list",
    step: "01",
    icon: ListPlus,
    title: "List your item",
    description:
      "Take a photo, add a title, price, and condition. Your listing goes live in under 2 minutes.",
  },
  {
    id: "step-discover",
    step: "02",
    icon: Search,
    title: "Students discover it",
    description:
      "Buyers in your college browse listings and find exactly what they need at the right price.",
  },
  {
    id: "step-connect",
    step: "03",
    icon: MessageSquare,
    title: "Connect on WhatsApp",
    description:
      "Buyers reach you directly on WhatsApp. Agree on a price, meet on campus, and close the deal.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
            Sell in 3 simple steps
          </h2>
          <p className="mt-4 text-[#64748B] max-w-lg mx-auto text-base leading-relaxed">
            No complicated forms. No fees. Just list, connect, and sell.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-[#E2E8F0] z-0" />

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                id={s.id}
                className="relative z-10 flex flex-col items-center text-center p-6"
              >
                {/* Step number badge */}
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center mb-5 relative">
                  <Icon size={22} className="text-[#2563EB]" strokeWidth={2} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#2563EB] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#0F172A] mb-2.5">{s.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed max-w-xs mx-auto">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
