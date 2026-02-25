import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Check,
  ChevronRight,
  TrendingUp,
  Users,
  Heart,
  BarChart3,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";

// ─── Data ────────────────────────────────────────────────────────────────────

const valueBarItems = [
  "Purpose-Driven Commerce",
  "Lower Customer Acquisition Cost",
  "Long-Term Relationships",
  "Structured Revenue Sharing",
];

const howItWorksSteps = [
  {
    number: "1",
    title: "Apply & Get Approved",
    body: "Share your business information and story. Our team reviews each partner to ensure alignment with our mission and community values.",
    isLink: true,
  },
  {
    number: "2",
    title: "Set Up Your Seller Page",
    body: "Create your branded seller page within ParishMart and list your products or services.",
    isLink: false,
  },
  {
    number: "3",
    title: "Start Selling with Purpose",
    body: "Every purchase generates revenue for your business — while also supporting a parish or cause you select.",
    isLink: false,
  },
];

const whyChooseItems = [
  {
    icon: TrendingUp,
    title: "Sustainable Customer Growth",
    body: "Access a differentiated sales channel and reach values-driven customers organically.",
  },
  {
    icon: Users,
    title: "Targeted, Purpose-Driven Audience",
    body: "Connect with engaged communities actively seeking mission-aligned products and services.",
  },
  {
    icon: Heart,
    title: "Simple Integration & Ongoing Support",
    body: "Benefit from an easy onboarding process, user-friendly management tools, and marketing support within faith-based communities.",
  },
  {
    icon: BarChart3,
    title: "Transparent & Secure Model",
    body: "Operate with clear revenue sharing, secure payment processing, and reliable reporting.",
  },
];

const bridgeItems = [
  { bold: "Your business", rest: " continues to grow." },
  { bold: "Parishes", rest: " receive meaningful support." },
  { bold: "Communities", rest: " remain connected." },
];

const placeholderTestimonials = [
  {
    id: "jd",
    initials: "JD",
    name: "John D.",
    organization: "Local Business Owner",
    quote:
      "Joining ParishMart has been a game changer for our business. We've connected with a loyal, values-driven customer base and seen meaningful growth in repeat customers.",
  },
  {
    id: "ml",
    initials: "ML",
    name: "Maria L.",
    organization: "Small Business Owner",
    quote:
      "ParishMart gave us a platform to reach customers who truly care about where they shop. The sense of community and purpose has made all the difference for our brand.",
  },
  {
    id: "rc",
    initials: "RC",
    name: "Robert C.",
    organization: "Community Business Partner",
    quote:
      "Being part of ParishMart means our sales directly support local parishes. It's the kind of business relationship we always wanted — meaningful and community-centered.",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const SellWithUs = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowAnnouncement(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Strip */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${showAnnouncement ? "translate-y-0" : "-translate-y-full"}`}
        style={{ willChange: "transform" }}
      >
        <AnnouncementStrip />
      </div>

      {/* Header */}
      <div
        className="sticky left-0 w-full z-40 bg-gray-50 transition-all duration-300 ease-in-out"
        style={{ top: showAnnouncement ? 40 : 0 }}
      >
        <Header />
      </div>

      {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
      <section className="relative w-full flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1060803/pexels-photo-1060803.jpeg"
            alt="Business team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2341]/95 via-[#1a2341]/80 to-[#1a2341]/20" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — text */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Grow Your Business with Purpose
              </h1>
              <p className="text-lg text-white/85 mb-10">
                ParishMart connects your business with purpose-driven communities
                — helping you expand your customer base while giving back a portion
                of every sale to support a parish or cause of your choice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => (window.location.href = "/vendor-registration-form")}
                  className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-8 py-3 text-base h-auto"
                >
                  Start Selling with Purpose
                </Button>
                <Button
                  onClick={() => (window.location.href = "https://shop.parishmart.com/contact")}
                  variant="outline"
                  className="border-2 border-white text-white bg-[#006699] hover:bg-white/30 font-semibold px-8 py-3 text-base h-auto"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>

            {/* Right — video */}
            <div className="w-full">
              <div
                className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20"
                style={{ paddingTop: "56.25%" }}
              >
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/flELulcfGlM"
                  title="Sell With Us — ParishMart"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE BAR ─────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-nowrap justify-center items-center overflow-x-auto">
          {valueBarItems.map((item, idx) => (
            <div key={item} className="flex items-center">
              <div className="flex items-center gap-1.5 text-gray-700 text-sm font-medium px-3 whitespace-nowrap">
                <Check className="w-4 h-4 text-[#006699] flex-shrink-0" />
                <span>{item}</span>
              </div>
              {idx < valueBarItems.length - 1 && (
                <div className="w-px h-5 bg-gray-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW PARISHMART WORKS FOR YOUR BUSINESS ────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-14">
            <p className="text-lg text-gray-500 mb-1">Getting Started</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How ParishMart Works for Your Business
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
            {howItWorksSteps.map((step, idx) => (
              <div key={step.number} className="flex flex-1 items-stretch">
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-full bg-[#006699] flex items-center justify-center mb-5">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                  {step.isLink ? (
                    <a
                      href="/vendor-registration-form"
                      className="text-lg font-semibold text-black hover:text-[#006699] mb-3 cursor-pointer"
                    >
                      {step.title}
                    </a>
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  )}
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">{step.body}</p>
                </div>
                {idx < howItWorksSteps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center px-1 self-center">
                    <ChevronRight className="w-5 h-5 text-[#006699]/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button
              onClick={() => (window.location.href = "/vendor-registration-form")}
              className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-10 py-3 text-base h-auto"
            >
              Register Today!
            </Button>
          </div>
        </div>
      </section>

      {/* ── WHY BUSINESSES CHOOSE PARISHMART ──────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-14">
            <p className="text-lg text-gray-500 mb-1">Our Commitment</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Businesses Choose ParishMart
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyChooseItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-4 items-start p-6 rounded-xl border-2 border-gray-200 shadow-sm bg-white"
                >
                  <div className="w-10 h-10 rounded-full bg-[#006699] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMMERCE THAT STRENGTHENS COMMUNITY ───────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Commerce that Strengthens Community
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mb-12">
            ParishMart creates an ecosystem where businesses grow while
            supporting local missions in a way that feels natural and sustainable.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            {bridgeItems.map((item) => (
              <div key={item.bold} className="flex-1">
                <p className="text-gray-700">
                  <span className="font-bold text-[#006699]">{item.bold}</span>
                  {item.rest}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (PLACEHOLDER) ─────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-14">
            <p className="text-lg text-gray-500 mb-1">Real Stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted by Local Businesses
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {placeholderTestimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#006699] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{t.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500 italic">{t.organization}</p>
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

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#006699]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Business with Purpose?
          </h2>
          <p className="text-white/85 text-lg mb-10">
            Join ParishMart today and be part of transforming everyday commerce
            into meaningful impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/vendor-registration-form")}
              className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-8 py-3 text-base h-auto"
            >
              Start Selling with Purpose
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SellWithUs;
