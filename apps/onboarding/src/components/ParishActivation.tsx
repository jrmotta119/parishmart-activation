import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowRight, ArrowLeft, Search, Check, ExternalLink } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import parishes from "@/data/preloadedParishes.json";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Parish {
  id: string;
  name: string;
  address: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  pastor: string;
  email: string;
  website: string;
  deanery: string;
  founded: string;
  description: string;
}

type Screen = "search" | "preview" | "activate" | "success";

// ─── Constants ──────────────────────────────────────────────────────────────

const HERO_IMAGES = [
  "https://images.pexels.com/photos/208216/pexels-photo-208216.jpeg",
  "https://images.pexels.com/photos/1207965/pexels-photo-1207965.jpeg",
  "https://images.pexels.com/photos/159862/art-school-of-athens-raphael-italian-159862.jpeg",
  "https://images.pexels.com/photos/2310641/pexels-photo-2310641.jpeg",
];

function heroForParish(id: string) {
  const idx = Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % HERO_IMAGES.length;
  return HERO_IMAGES[idx];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const ENGINE_CARDS = [
  {
    title: "Online Giving",
    subtitle: "Support your parish and causes",
    symbol: "♡",
    from: "#0C2E1B",
    to: "#185A36",
  },
  {
    title: "Religious Gifts",
    subtitle: "Curated catalog ready to go",
    symbol: "✛",
    from: "#0D2540",
    to: "#1B4472",
  },
  {
    title: "Parish Merch",
    subtitle: "Branded with your parish identity",
    symbol: "◈",
    from: "#3A1010",
    to: "#6B2626",
  },
  {
    title: "Local Business Supporters",
    subtitle: "Space for community businesses",
    symbol: "◉",
    from: "#191929",
    to: "#2D2D50",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

const ParishActivation = () => {
  const [screen, setScreen] = useState<Screen>("search");
  const [query, setQuery] = useState("");
  const [selectedParish, setSelectedParish] = useState<Parish | null>(null);

  // Activation form
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [confirmAuthorized, setConfirmAuthorized] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [confirmPayout, setConfirmPayout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  // ── Search logic ──

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return (parishes as Parish[])
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.zipCode.includes(q) ||
          p.deanery?.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query]);

  const selectParish = (p: Parish) => {
    setSelectedParish(p);
    setContactEmail(p.email || "");
    setContactPhone(p.phone || "");
    go("preview");
  };

  // ── Activate ──

  const handleActivate = async () => {
    setIsSubmitting(true);
    // TODO: wire to backend POST /api/registration
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    go("success");
  };

  const canActivate = confirmAuthorized && confirmTerms && confirmPayout;

  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {screen !== "search" && (
        <div className="sticky top-0 left-0 w-full z-40 bg-white border-b border-gray-100">
          <Header />
        </div>
      )}

      <div className="flex-1">
        {/* ── STEP 1: FIND YOUR PARISH ─────────────────────────────────── */}
        {screen === "search" && (
          <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white">
            <div className="sticky top-0 left-0 w-full z-40 bg-white/80 backdrop-blur border-b border-gray-100">
              <Header />
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-24">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Find your Parish
                </h1>
                <p className="text-lg text-gray-500">
                  Your parish may already be ready. Just select and activate.
                </p>
              </div>

              {/* Search bar */}
              <div className="relative max-w-xl mx-auto mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by parish name, city, or ZIP…"
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-[#006699] focus:outline-none focus:ring-2 focus:ring-[#006699]/20 transition-all shadow-sm"
                  autoFocus
                />
              </div>

              {/* Results */}
              {query.trim() && (
                <div className="space-y-4">
                  {filtered.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">
                      No parishes found for "{query}". Try a different name or ZIP code.
                    </p>
                  ) : (
                    filtered.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-4 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => selectParish(p)}
                      >
                        {/* Image */}
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={heroForParish(p.id)}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-base md:text-lg group-hover:text-[#006699] transition-colors truncate">
                            {p.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {p.city}, {p.state} {p.zipCode}
                          </p>
                          {p.deanery && (
                            <p className="text-xs text-gray-400 mt-0.5">{p.deanery}</p>
                          )}
                        </div>

                        {/* CTA */}
                        <Button
                          variant="outline"
                          className="border-[#006699] text-[#006699] flex-shrink-0 group-hover:bg-[#006699] group-hover:text-white transition-all"
                        >
                          Select <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {!query.trim() && (
                <p className="text-center text-gray-400 text-sm mt-4">
                  Start typing to search from {(parishes as Parish[]).length}+ parishes
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: PREVIEW STORE ────────────────────────────────────── */}
        {screen === "preview" && selectedParish && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Your Parish Store is Ready
              </h2>
              <p className="text-gray-500">Review and activate in seconds</p>
            </div>

            {/* Store preview */}
            <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-lg bg-[#faf6ee] mb-10">
              {/* Hero */}
              <div className="relative h-48 md:h-60 w-full overflow-hidden">
                <img
                  src={heroForParish(selectedParish.id)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 px-5 pb-5">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-white/80 shadow flex items-center justify-center flex-shrink-0">
                    <span className="text-[#006699] font-bold text-lg">
                      {initials(selectedParish.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pb-0.5">
                    <h2 className="text-xl md:text-2xl italic text-white leading-tight truncate" style={{ fontFamily: "Georgia, serif" }}>
                      {selectedParish.name}
                    </h2>
                    <p className="text-xs text-white/70 mt-0.5 tracking-wide">
                      {selectedParish.city}, {selectedParish.state}
                      {selectedParish.founded && ` · Est. ${selectedParish.founded}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="px-5 pt-5 pb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#006699] mb-2">
                  About Your Parish
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {selectedParish.description || `Welcome to ${selectedParish.name}. A vibrant Catholic community in ${selectedParish.city}, ${selectedParish.state}, serving the faithful since ${selectedParish.founded || "its founding"}.`}
                </p>
              </div>

              <div className="h-px mx-5 mb-4 bg-[#d4a853]/30" />

              {/* 4 Engine Cards */}
              <div className="grid grid-cols-2 gap-3 px-4 pb-6">
                {ENGINE_CARDS.map((card) => (
                  <div
                    key={card.title}
                    className="relative flex flex-col justify-between rounded-2xl p-4 text-left min-h-[130px] md:min-h-[150px] overflow-hidden"
                    style={{ background: `linear-gradient(140deg, ${card.from} 0%, ${card.to} 100%)` }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xl md:text-2xl leading-none" style={{ color: "#4DB8E0", fontFamily: "Georgia, serif" }}>
                        {card.symbol}
                      </span>
                      <span className="text-[9px] font-medium tracking-widest uppercase rounded-full px-2 py-0.5 bg-white/10 text-[#4DB8E0] border border-[#4DB8E0]/30">
                        Active
                      </span>
                    </div>
                    <div>
                      <div className="mb-2 h-px opacity-25 bg-[#4DB8E0]" />
                      <h3 className="text-base md:text-lg italic leading-tight text-white" style={{ fontFamily: "Georgia, serif" }}>
                        {card.title}
                      </h3>
                      <p className="text-[10px] md:text-[11px] mt-1 text-white/60">{card.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => go("search")}
                variant="outline"
                className="border-[#006699] text-[#006699]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Different parish
              </Button>
              <Button
                onClick={() => go("activate")}
                className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-8 py-3 h-auto text-base"
              >
                Activate My Store <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: ACTIVATE ─────────────────────────────────────────── */}
        {screen === "activate" && selectedParish && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Activate Your Parish Store
              </h2>
              <p className="text-gray-500">Start supporting your parish today</p>
            </div>

            <div className="grid md:grid-cols-[1fr_320px] gap-8">
              {/* Left: Form */}
              <div className="space-y-8">
                {/* Store summary strip */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[#006699] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{initials(selectedParish.name)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedParish.name}</p>
                    <p className="text-xs text-gray-500">{selectedParish.city}, {selectedParish.state}</p>
                  </div>
                </div>

                {/* Contact info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Primary Contact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm text-gray-600 mb-1">Full name</Label>
                      <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your name" maxLength={100} />
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-600 mb-1">Role</Label>
                      <Input value={contactRole} onChange={(e) => setContactRole(e.target.value)} placeholder="e.g. Pastor, Administrator" maxLength={100} />
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-600 mb-1">Email</Label>
                      <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="your@email.com" maxLength={250} />
                    </div>
                    <div>
                      <Label className="block text-sm text-gray-600 mb-1">Phone</Label>
                      <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="(555) 123-4567" maxLength={20} />
                    </div>
                  </div>
                </div>

                {/* Confirmations */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={confirmAuthorized} onChange={(e) => setConfirmAuthorized(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#006699]" />
                    <span className="text-sm text-gray-700">I confirm I represent this parish or am authorized to request activation</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={confirmTerms} onChange={(e) => setConfirmTerms(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#006699]" />
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="https://shop.parishmart.com/terms-of-service" target="_blank" rel="noreferrer" className="text-[#006699] underline">Terms and Conditions</a>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={confirmPayout} onChange={(e) => setConfirmPayout(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#006699]" />
                    <span className="text-sm text-gray-700">I understand payout setup may be required later to receive funds</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                  <Button onClick={() => go("preview")} variant="outline" className="border-[#006699] text-[#006699]">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={handleActivate}
                    disabled={!canActivate || isSubmitting}
                    className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-8 py-3 h-auto text-base disabled:opacity-50"
                  >
                    {isSubmitting ? "Activating…" : "Activate My Parish Store"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Right: Plan card */}
              <div className="h-fit">
                <div className="bg-gradient-to-br from-[#006699] to-[#004d73] rounded-2xl p-6 text-white shadow-lg">
                  <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Launch Offer</p>
                  <p className="text-3xl font-bold mb-1">3 Months Free</p>
                  <p className="text-sm text-white/70 mb-5">No upfront payment today</p>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-300 flex-shrink-0" />
                      <span>No setup cost</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-300 flex-shrink-0" />
                      <span>Ready to use immediately</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-300 flex-shrink-0" />
                      <span>Cancel anytime during trial</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-300 flex-shrink-0" />
                      <span>Simple activation now, full setup later</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SUCCESS ──────────────────────────────────────────────────── */}
        {screen === "success" && selectedParish && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Your Parish Store is Live
            </h2>
            <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
              {selectedParish.name} can now begin sharing, inviting supporters, and preparing to receive donations and sales.
            </p>

            {/* 3 Action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                <div className="text-3xl mb-3">💳</div>
                <h4 className="font-semibold text-gray-900 mb-1">Set Up Payouts</h4>
                <p className="text-xs text-gray-500 mb-4">Connect Stripe to start receiving donations and sales.</p>
                <span className="text-sm font-medium text-[#006699]">
                  Set Up Payouts <ExternalLink className="inline h-3.5 w-3.5 ml-1" />
                </span>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                <div className="text-3xl mb-3">♡</div>
                <h4 className="font-semibold text-gray-900 mb-1">Review Giving</h4>
                <p className="text-xs text-gray-500 mb-4">Customize your giving campaigns and causes.</p>
                <span className="text-sm font-medium text-[#006699]">
                  Review Giving <ExternalLink className="inline h-3.5 w-3.5 ml-1" />
                </span>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                <div className="text-3xl mb-3">📣</div>
                <h4 className="font-semibold text-gray-900 mb-1">Invite Supporters</h4>
                <p className="text-xs text-gray-500 mb-4">Share your store with parishioners and local businesses.</p>
                <span className="text-sm font-medium text-[#006699]">
                  Invite Supporters <ExternalLink className="inline h-3.5 w-3.5 ml-1" />
                </span>
              </div>
            </div>

            <Button
              onClick={() => window.location.href = "/"}
              className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-10 py-3 h-auto text-base"
            >
              Finish & Go to My Store <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ParishActivation;
