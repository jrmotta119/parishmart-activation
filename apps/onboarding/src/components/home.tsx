import React, { useState, useEffect } from "react";
import { ArrowRight, Check, Landmark, Church, Heart, ShoppingBag, Users, LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";

// ─── Data ───────────────────────────────────────────────────────────────────

interface ActivationFlow {
  Icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
  href: string;
  from: string;
  to: string;
}

const ACTIVATION_FLOWS: ActivationFlow[] = [
  {
    Icon: Landmark,
    title: "Diocese",
    desc: "Activate 50–200+ parishes at once with pre-loaded structure.",
    tag: "Batch activation",
    href: "/diocese-activation",
    from: "#0D2540",
    to: "#1B4472",
  },
  {
    Icon: Church,
    title: "Parish",
    desc: "Your store is already built. Select, review, and activate in seconds.",
    tag: "1-click",
    href: "/parish-activation",
    from: "#0C2E1B",
    to: "#185A36",
  },
  {
    Icon: Heart,
    title: "Cause / Mission",
    desc: "Ministry, retreat group, or nonprofit — activate support in minutes.",
    tag: "Fast & flexible",
    href: "/cause-activation",
    from: "#3A1010",
    to: "#6B2626",
  },
  {
    Icon: ShoppingBag,
    title: "Local Business",
    desc: "Turn every sale or service into direct support for a parish or cause.",
    tag: "Services & Products",
    href: "/vendor-registration-form",
    from: "#191929",
    to: "#2D2D50",
  },
  {
    Icon: Users,
    title: "Sponsor",
    desc: "Institutional visibility and community impact through trusted presence.",
    tag: "Brand presence",
    href: "/sponsor-activation",
    from: "#2D1A00",
    to: "#5C3A0A",
  },
];

const ENGINES = [
  { icon: "♡", title: "Online Giving", desc: "Donations and campaigns that fund the mission." },
  { icon: "✛", title: "Religious Gifts", desc: "Curated faith-based catalog, no inventory needed." },
  { icon: "◈", title: "Parish Merch", desc: "Branded products that build community identity." },
  { icon: "◉", title: "Local Business", desc: "Community commerce that generates sustainable revenue." },
];

const FLYWHEEL = [
  { step: "1", text: "Parish activates its store" },
  { step: "2", text: "Giving + products go live instantly" },
  { step: "3", text: "Parish invites local businesses" },
  { step: "4", text: "Businesses generate revenue" },
  { step: "5", text: "Revenue supports causes & missions" },
  { step: "6", text: "Community grows, more businesses join" },
];

const TESTIMONIALS = [
  {
    initials: "OA",
    name: "Fr. Omar Ayubi",
    org: "Saint Katharine Drexel — Weston, FL",
    quote:
      "ParishMart opens the door to a solution that can help strengthen parish life, support the missions, and generate resources in an organized and transparent way.",
  },
  {
    initials: "MV",
    name: "Maria Angelica Valencia",
    org: "Schoenstatt Apostolic Movement — Miami",
    quote:
      "More than a platform, ParishMart became a providential tool for our mission — enabling fundraising, uniting missionaries, and generating tangible support.",
  },
  {
    initials: "SR",
    name: "Soly Rodriguez",
    org: "Schoenstatt Movement",
    quote:
      "ParishMart has enabled us to manage multiple online stores for different apostolic initiatives in a simple and organized way.",
  },
];

const STATS = [
  { value: "< 2 min", label: "Activation time" },
  { value: "1,000+", label: "Parishes pre-loaded" },
  { value: "4", label: "Revenue engines" },
  { value: "$0", label: "Upfront cost" },
];

// ─── Component ──────────────────────────────────────────────────────────────

const HomePage = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const h = () => setShowAnnouncement(window.scrollY === 0);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${showAnnouncement ? "translate-y-0" : "-translate-y-full"}`}
      >
        <AnnouncementStrip />
      </div>

      {/* Header */}
      <div
        className="sticky left-0 w-full z-40 bg-white transition-all duration-300 ease-in-out"
        style={{ top: showAnnouncement ? 40 : 0 }}
      >
        <Header />
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1207965/pexels-photo-1207965.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1729]/95 via-[#0f1729]/85 to-[#0f1729]/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="text-[#4DB8E0] text-sm uppercase tracking-widest mb-4 font-medium">
              Activation Engine for Communities
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Activate your Parish Ecosystem{" "}
              <span className="text-[#4DB8E0]">in Minutes</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 mb-10 max-w-2xl">
              ParishMart turns everyday commerce into sustainable support for parishes,
              causes, and communities — with pre-loaded data, smart templates, and zero
              friction activation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => (window.location.href = "/activate")}
                className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-8 py-4 text-lg h-auto rounded-xl shadow-xl"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <button
                onClick={() =>
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                }
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg rounded-xl transition-colors"
              >
                See how it works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-[#006699] py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/60 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IS PARISHMART FOR ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0f1729]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[#4DB8E0] text-xs uppercase tracking-widest font-medium">
                One Ecosystem, Five Players
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Everyone has a role in supporting the mission
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Choose your role and activate in minutes. Everything is pre-built.
            </p>
          </div>

          {/* Top row: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {ACTIVATION_FLOWS.slice(0, 3).map((flow) => {
              const Icon = flow.Icon;
              return (
                <a
                  key={flow.title}
                  href={flow.href}
                  className={`group relative flex flex-col justify-between rounded-3xl p-7 text-left overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    flow.title === "Parish" ? "min-h-[260px] ring-2 ring-[#45b1e1]/30" : "min-h-[240px]"
                  }`}
                  style={{ background: `linear-gradient(145deg, ${flow.from} 0%, ${flow.to} 100%)` }}
                >
                  {flow.title === "Parish" && (
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
                    <h3 className="text-2xl italic font-normal text-white leading-tight mb-2" style={{ fontFamily: "Georgia, serif" }}>
                      {flow.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-5">{flow.desc}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#45b1e1] group-hover:text-white group-hover:gap-3 transition-all">
                      Get started <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Bottom row: 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {ACTIVATION_FLOWS.slice(3).map((flow) => {
              const Icon = flow.Icon;
              return (
                <a
                  key={flow.title}
                  href={flow.href}
                  className="group relative flex flex-col justify-between rounded-3xl p-7 text-left min-h-[240px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  style={{ background: `linear-gradient(145deg, ${flow.from} 0%, ${flow.to} 100%)` }}
                >
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
                    <h3 className="text-2xl italic font-normal text-white leading-tight mb-2" style={{ fontFamily: "Georgia, serif" }}>
                      {flow.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-5">{flow.desc}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#45b1e1] group-hover:text-white group-hover:gap-3 transition-all">
                      Get started <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4 ENGINES ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm text-[#006699] uppercase tracking-widest mb-2 font-medium">Every Store Includes</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              4 revenue engines, activated by default
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Each parish, cause, or diocese store launches with four connected engines — all pre-configured and ready to generate impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ENGINES.map((e) => (
              <div key={e.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-lg transition-all">
                <span className="text-3xl block mb-3" style={{ fontFamily: "Georgia, serif", color: "#006699" }}>{e.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{e.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLYWHEEL ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm text-[#006699] uppercase tracking-widest mb-2 font-medium">The Flywheel</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              It becomes self-sustaining
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Once activated, the ecosystem grows on its own. More support leads to more engagement, which leads to more growth.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FLYWHEEL.map((f) => (
              <div key={f.step} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#006699] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{f.step}</span>
                </div>
                <p className="text-sm text-gray-700 pt-1">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-[#006699] font-semibold text-sm">
              → Cycle repeats. The community grows. Support becomes sustainable.
            </p>
          </div>
        </div>
      </section>

      {/* ── ACTIVATION vs TRADITIONAL ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Activation, not creation
            </h2>
            <p className="text-gray-500">We don't ask you to build anything. We activate what's already built.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-4">Traditional Marketplace</p>
              <ul className="space-y-3 text-sm text-gray-500">
                {["Create store from scratch", "Upload every product manually", "Configure payments", "Design branding", "Fill long forms", "Days or weeks to launch"].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#006699] rounded-2xl p-6 text-white">
              <p className="text-xs font-semibold text-[#4DB8E0] uppercase tracking-wider mb-4">ParishMart</p>
              <ul className="space-y-3 text-sm">
                {["Select from pre-loaded data", "Products & catalog ready", "Payments configured automatically", "Templates with your branding", "Minimal inputs, maximum impact", "Activate in minutes"].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-300 mt-0.5 flex-shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm text-[#006699] uppercase tracking-widest mb-2 font-medium">Real Stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted by parishes and apostolic movements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border-2 border-gray-200 p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#006699] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{t.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500 italic">{t.org}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic text-sm leading-relaxed flex-grow">
                  "{t.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#006699]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to activate your community?
          </h2>
          <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
            Start with 3 months free. No setup cost. No technical knowledge required.
            Your parish ecosystem can be live in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/activate")}
              className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-10 py-4 text-lg h-auto rounded-xl"
            >
              Activate Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <button
              onClick={() => (window.location.href = "https://calendly.com/gurupia/parishmart")}
              className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-10 py-4 text-lg rounded-xl transition-colors"
            >
              Schedule a Demo
            </button>
          </div>

          <p className="text-white/40 text-sm italic mt-12">
            "This is not an e-commerce platform.
            This is an activation engine for communities."
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
