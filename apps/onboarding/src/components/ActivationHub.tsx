import React from "react";
import { ArrowRight, Check, Landmark, Church, Heart, ShoppingBag, Users, LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import Header from "./Header";
import Footer from "./Footer";

interface Flow {
  id: string;
  Icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
  href: string;
  from: string;
  to: string;
  highlight: boolean;
}

const FLOWS: Flow[] = [
  {
    id: "diocese",
    Icon: Landmark,
    title: "Diocese / Archdiocese",
    desc: "Activate 50–200+ parishes at once with pre-loaded structure and data.",
    tag: "Batch activation",
    href: "/diocese-activation",
    from: "#0D2540",
    to: "#1B4472",
    highlight: false,
  },
  {
    id: "parish",
    Icon: Church,
    title: "Parish",
    desc: "Your store is already built. Just select, review, and activate in seconds.",
    tag: "1-click activation",
    href: "/parish-activation",
    from: "#0C2E1B",
    to: "#185A36",
    highlight: true,
  },
  {
    id: "cause",
    Icon: Heart,
    title: "Cause / Mission",
    desc: "Ministry, retreat group, nonprofit — activate support for your mission in minutes.",
    tag: "Fast & flexible",
    href: "/cause-activation",
    from: "#3A1010",
    to: "#6B2626",
    highlight: false,
  },
  {
    id: "biz",
    Icon: ShoppingBag,
    title: "Local Business",
    desc: "Turn every sale or service into direct support for a parish or cause.",
    tag: "Services & Products",
    href: "/vendor-registration-form",
    from: "#191929",
    to: "#2D2D50",
    highlight: false,
  },
  {
    id: "sponsor",
    Icon: Users,
    title: "Sponsor",
    desc: "Institutional visibility and trusted community presence for your brand.",
    tag: "Brand presence",
    href: "/sponsor-activation",
    from: "#2D1A00",
    to: "#5C3A0A",
    highlight: false,
  },
];

const ActivationHub = () => {
  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      <div className="sticky top-0 left-0 w-full z-40">
        <Header />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0f1729]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/2310641/pexels-photo-2310641.jpeg"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32 md:pt-28 md:pb-40 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#45b1e1] text-xs uppercase tracking-widest font-medium">
              Activation Engine
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Activate your Parish<br />
            Ecosystem{" "}
            <span className="text-[#45b1e1] italic" style={{ fontFamily: "Georgia, serif" }}>
              in Minutes
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
            We are not asking you to build anything.
            We are activating what is already built.
          </p>
        </div>
      </section>

      {/* ── Cards ────────────────────────────────────────────────────── */}
      <section className="relative z-20 -mt-20 md:-mt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-white/50 text-sm mb-8 font-medium">
            Choose your role to get started
          </p>

          {/* Top row: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {FLOWS.slice(0, 3).map((flow) => (
              <FlowCard key={flow.id} flow={flow} />
            ))}
          </div>

          {/* Bottom row: 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {FLOWS.slice(3).map((flow) => (
              <FlowCard key={flow.id} flow={flow} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Value strip ──────────────────────────────────────────────── */}
      <section className="py-12 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-4">
          {[
            "Pre-loaded parish data",
            "Zero setup required",
            "3 months free",
            "Activate in minutes",
          ].map((text) => (
            <div key={text} className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-[#006699]" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#faf9f7]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
            How does it work?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Select", desc: "Find your parish, diocese, cause, or business from pre-loaded data." },
              { step: "2", title: "Review", desc: "See your store already built — with giving, products, merch, and local business support." },
              { step: "3", title: "Activate", desc: "Go live instantly. 3 months free. Customize later from your dashboard." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#006699] flex items-center justify-center mb-4 shadow-lg shadow-[#006699]/20">
                  <span className="text-white font-bold text-xl">{s.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#006699]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to activate?
          </h2>
          <p className="text-white/60 mb-8">
            Start your free trial today. No payment required.
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-8 py-3 h-auto text-base rounded-xl"
          >
            Choose your role above <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-white/30 text-xs italic mt-10">
            "This is not an e-commerce platform. This is an activation engine for communities."
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ─── Flow Card ──────────────────────────────────────────────────────────────

function FlowCard({ flow }: { flow: Flow }) {
  const Icon = flow.Icon;
  return (
    <a
      href={flow.href}
      className={`group relative flex flex-col justify-between rounded-3xl p-7 text-left overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        flow.highlight ? "min-h-[260px] ring-2 ring-[#45b1e1]/30" : "min-h-[240px]"
      }`}
      style={{
        background: `linear-gradient(145deg, ${flow.from} 0%, ${flow.to} 100%)`,
      }}
    >
      {flow.highlight && (
        <span className="absolute top-0 right-6 bg-[#45b1e1] text-[#0f1729] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-b-lg">
          Most Popular
        </span>
      )}

      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#45b1e1]" />
        </div>
        <span className="text-[10px] font-semibold tracking-widest uppercase rounded-full px-3 py-1 bg-white/10 text-white/70 border border-white/10 backdrop-blur-sm">
          {flow.tag}
        </span>
      </div>

      <div className="mt-auto">
        <div className="mb-3 h-px bg-white/10" />
        <h3
          className="text-2xl italic font-normal text-white leading-tight mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {flow.title}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed mb-5">{flow.desc}</p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#45b1e1] group-hover:text-white group-hover:gap-3 transition-all">
          Get started <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}

export default ActivationHub;
