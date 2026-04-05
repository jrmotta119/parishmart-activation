import React from "react";
import { Users, ShoppingBag, Heart, ChevronRight } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Users,
    title: "Communities Connect",
    body: "Digital storefronts bring together mission-driven communities and trusted local businesses.",
  },
  {
    number: "2",
    icon: ShoppingBag,
    title: "Businesses Engage & Grow",
    body: "Local businesses offer products and services while expanding their reach through community-based engagement.",
  },
  {
    number: "3",
    icon: Heart,
    title: "Commerce Generates Support",
    body: "A portion of every transaction flows back to strengthen the mission — transforming everyday purchases into sustainable support.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-14">
          <p className="text-lg text-gray-500">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ParishMart Activates a Virtuous Cycle
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.number}>
                {/* Step card */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center">
                  {/* Number badge */}
                  <div className="w-9 h-9 rounded-full bg-[#006699] flex items-center justify-center mb-5">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                  {/* Icon ring */}
                  <div className="w-16 h-16 rounded-full bg-[#006699]/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-[#006699]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.body}</p>
                </div>

                {/* Connector — visible only on desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex flex-col items-center justify-center px-1 self-center">
                    <div className="flex items-center gap-0">
                      <div className="w-6 h-px bg-[#006699]/30" />
                      <div className="w-4 h-px bg-[#006699]/30 border-t border-dashed border-[#006699]/30" />
                      <ChevronRight className="w-5 h-5 text-[#006699]/60" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
