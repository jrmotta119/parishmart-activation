import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Upload, ArrowRight, ArrowLeft, Check, ExternalLink } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import parishes from "@/data/preloadedParishes.json";

// ─── Types ──────────────────────────────────────────────────────────────────

type Screen =
  | "landing"
  | "type"
  | "support"
  | "presence"
  | "profile"
  | "benefit"
  | "preview"
  | "payment"
  | "success";

const SCREEN_ORDER: Screen[] = [
  "landing", "type", "support", "presence", "profile", "benefit", "preview", "payment", "success",
];

type SponsorTier = "local" | "diocesan" | "national" | null;
type PresenceLevel = "footer" | "featured" | "banner" | null;
type SupportTarget = { kind: "parish" | "diocese" | "cause"; name: string; detail: string } | null;

const SPONSOR_CATEGORIES = [
  "Banking & Finance",
  "Insurance",
  "Healthcare",
  "Legal Services",
  "Real Estate",
  "Automotive",
  "Education",
  "Professional Services",
  "Retail & Consumer",
  "Other",
];

const PRESENCE_TIERS: { id: PresenceLevel; title: string; price: string; features: string[] }[] = [
  {
    id: "footer",
    title: "Footer Presence",
    price: "$500/mo",
    features: ["Logo in parish footer", "Link to sponsor page", "Basic institutional presence"],
  },
  {
    id: "featured",
    title: "Featured Sponsor",
    price: "$1,000/mo",
    features: ["Footer presence", "Dedicated sponsor page", "Community offer / coupon", "Enhanced visibility"],
  },
  {
    id: "banner",
    title: "Banner Sponsor",
    price: "$2,500/mo",
    features: ["All Featured benefits", "Main banner placement", "Priority positioning", "Maximum visibility"],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

const SponsorActivation = () => {
  const [screen, setScreen] = useState<Screen>("landing");

  // Type
  const [sponsorTier, setSponsorTier] = useState<SponsorTier>(null);

  // Support target
  const [supportTarget, setSupportTarget] = useState<SupportTarget>(null);
  const [targetQuery, setTargetQuery] = useState("");

  // Presence
  const [presenceLevel, setPresenceLevel] = useState<PresenceLevel>(null);

  // Profile
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [whySupport, setWhySupport] = useState("");

  // Benefit
  const [benefitType, setBenefitType] = useState("");
  const [benefitTitle, setBenefitTitle] = useState("");
  const [benefitDescription, setBenefitDescription] = useState("");

  // Contact
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const go = (s: Screen) => { setScreen(s); window.scrollTo(0, 0); };
  const idx = SCREEN_ORDER.indexOf(screen);
  const back = () => idx > 0 && go(SCREEN_ORDER[idx - 1]);

  // ── File handlers ──

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { setLogo(e.target.files[0]); setLogoPreview(URL.createObjectURL(e.target.files[0])); }
  };
  const handleBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { setBanner(e.target.files[0]); setBannerPreview(URL.createObjectURL(e.target.files[0])); }
  };

  // ── Search ──

  const filteredTargets = useMemo(() => {
    if (!targetQuery.trim()) return [];
    const q = targetQuery.toLowerCase();
    return (parishes as any[])
      .filter((p) => p.name?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q) || p.zipCode?.includes(q))
      .slice(0, 10)
      .map((p) => ({ kind: "parish" as const, name: p.name, detail: `${p.city}, ${p.state}` }));
  }, [targetQuery]);

  const handleActivate = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    go("success");
  };

  const initials = companyName.split(/\s+/).filter((w) => w.length > 1).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "SP";
  const displayName = companyName || "Your Company";
  const isImmersive = screen === "landing";
  const stepsTotal = SCREEN_ORDER.length - 2;
  const stepNum = Math.max(0, idx - 1);

  const ProgressBar = () => (
    <div className="flex gap-1.5 justify-center mb-8">
      {Array.from({ length: stepsTotal }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${i <= stepNum ? "w-6 bg-[#006699]" : "w-1.5 bg-gray-300"}`} />
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isImmersive && (
        <div className="sticky top-0 left-0 w-full z-40 bg-white border-b border-gray-100"><Header /></div>
      )}

      <div className="flex-1">
        {/* ── LANDING ───────────────────────────────────────────────────── */}
        {screen === "landing" && (
          <div className="relative min-h-screen flex items-center">
            <div className="absolute inset-0 z-0">
              <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f1729]/95 via-[#0f1729]/85 to-[#0f1729]/50" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
              <p className="text-[#4DB8E0] text-sm uppercase tracking-widest mb-4">ParishMart Sponsors</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Support communities.{" "}
                <span className="text-[#4DB8E0]">Strengthen your brand.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/75 mb-12 max-w-2xl mx-auto">
                Join ParishMart as a Sponsor and connect your organization with parishes, causes, and
                families through meaningful visibility, trusted presence, and exclusive community offers.
              </p>
              <Button
                onClick={() => go("type")}
                className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-10 py-4 text-lg h-auto rounded-xl shadow-xl"
              >
                Become a Sponsor <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── TYPE ──────────────────────────────────────────────────────── */}
        {screen === "type" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              What level of sponsorship fits your organization?
            </h2>
            <p className="text-gray-500 text-center mb-10">Choose the scope that matches your goals.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {([
                { id: "local" as const, icon: "📍", title: "Local Sponsor", desc: "Support one parish or local cause. Visible within a single community." },
                { id: "diocesan" as const, icon: "⛪", title: "Diocesan Sponsor", desc: "Reach multiple parishes within one diocese. Regional brand presence." },
                { id: "national" as const, icon: "🌐", title: "Regional / National", desc: "Scale your visibility across multiple communities and dioceses." },
              ]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSponsorTier(t.id); go("support"); }}
                  className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg group ${
                    sponsorTier === t.id ? "border-[#006699] bg-[#006699]/5" : "border-gray-200 hover:border-[#006699]"
                  }`}
                >
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#006699]">{t.title}</h3>
                  <p className="text-sm text-gray-500">{t.desc}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-[#006699] mt-4">
                    Select <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>

            <button onClick={back} className="block mx-auto mt-8 text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        )}

        {/* ── SUPPORT TARGET ────────────────────────────────────────────── */}
        {screen === "support" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Who do you want to support?
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Your sponsorship will be visible within the community you choose.
            </p>

            {supportTarget ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 max-w-lg mx-auto mb-6">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{supportTarget.name}</p>
                  <p className="text-sm text-gray-500">{supportTarget.detail}</p>
                </div>
                <button onClick={() => setSupportTarget(null)} className="text-sm text-red-500 hover:underline">Change</button>
              </div>
            ) : (
              <div className="max-w-xl mx-auto mb-6">
                <Input
                  value={targetQuery}
                  onChange={(e) => setTargetQuery(e.target.value)}
                  placeholder="Search parish, diocese, or cause by name or city…"
                  className="text-center mb-4"
                  autoFocus
                />
                {targetQuery.trim() && (
                  <div className="space-y-2">
                    {filteredTargets.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-4">No results for "{targetQuery}"</p>
                    ) : (
                      filteredTargets.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => { setSupportTarget(t); setTargetQuery(""); }}
                          className="w-full flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3 hover:border-[#006699] hover:shadow-sm transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#006699]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[#006699] font-bold text-xs">{t.name[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{t.name}</p>
                            <p className="text-xs text-gray-500">{t.detail}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
                <button
                  onClick={() => setSupportTarget({ kind: "cause", name: "ParishMart General Fund", detail: "Support the broader ParishMart community" })}
                  className="block mx-auto mt-4 text-sm text-[#006699] hover:underline"
                >
                  I need help choosing — support the general community
                </button>
              </div>
            )}

            <div className="flex justify-between max-w-lg mx-auto mt-8">
              <Button onClick={back} variant="outline" className="border-[#006699] text-[#006699]"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button onClick={() => go("presence")} className="bg-[#006699] hover:bg-[#005588] text-white" disabled={!supportTarget}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── PRESENCE LEVEL ────────────────────────────────────────────── */}
        {screen === "presence" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Choose your level of presence
            </h2>
            <p className="text-gray-500 text-center mb-10">Select the visibility package that fits your goals.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PRESENCE_TIERS.map((tier, i) => (
                <button
                  key={tier.id}
                  onClick={() => { setPresenceLevel(tier.id); go("profile"); }}
                  className={`relative p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg flex flex-col ${
                    presenceLevel === tier.id ? "border-[#006699] bg-[#006699]/5" : "border-gray-200 hover:border-[#006699]"
                  }`}
                >
                  {i === 1 && (
                    <span className="absolute -top-3 left-6 bg-[#006699] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  )}
                  <p className="text-2xl font-bold text-gray-900 mb-1">{tier.price}</p>
                  <h3 className="font-semibold text-gray-800 mb-4">{tier.title}</h3>
                  <ul className="space-y-2 flex-grow">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center text-sm font-semibold text-[#006699] mt-5">
                    Select <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>

            <button onClick={back} className="block mx-auto mt-8 text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        )}

        {/* ── PROFILE ───────────────────────────────────────────────────── */}
        {screen === "profile" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Build your sponsor profile
            </h2>
            <p className="text-gray-500 text-center mb-10">This is your institutional page within ParishMart.</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-5 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800">Brand Identity</h3>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Company name</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your company" maxLength={120} />
                </div>

                <div className="flex gap-4">
                  <div>
                    <Label className="block text-sm text-gray-600 mb-1">Logo</Label>
                    <label className="block w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-white overflow-hidden">
                      <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                      {logoPreview ? <img src={logoPreview} alt="" className="w-full h-full object-contain" />
                        : <div className="w-full h-full flex items-center justify-center"><Upload className="h-5 w-5 text-gray-400" /></div>}
                    </label>
                  </div>
                  <div className="flex-1">
                    <Label className="block text-sm text-gray-600 mb-1">Cover image</Label>
                    <label className="block w-full h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-white overflow-hidden">
                      <input type="file" accept="image/*" onChange={handleBanner} className="hidden" />
                      {bannerPreview ? <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Upload className="h-4 w-4 text-gray-400" /></div>}
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Category</Label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006699]">
                    <option value="">Select…</option>
                    {SPONSOR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Website</Label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" maxLength={300} />
                </div>
              </div>

              <div className="space-y-5 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800">About & Contact</h3>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">About your company</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Who you are and what you do…" maxLength={500} className="h-20" />
                </div>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Why do you support this community?</Label>
                  <Textarea value={whySupport} onChange={(e) => setWhySupport(e.target.value)} placeholder="What motivates your sponsorship…" maxLength={300} className="h-20" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="block text-sm text-gray-600 mb-1">Email</Label>
                    <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contact@…" maxLength={250} />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-600 mb-1">Phone</Label>
                    <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="(555)…" maxLength={20} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-10">
              <Button onClick={back} variant="outline" className="border-[#006699] text-[#006699]"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button onClick={() => go("benefit")} className="bg-[#006699] hover:bg-[#005588] text-white">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {/* ── BENEFIT ───────────────────────────────────────────────────── */}
        {screen === "benefit" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Offer a benefit to the community
            </h2>
            <p className="text-gray-500 text-center mb-10">Optional — give community members a reason to engage with your brand.</p>

            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {["Discount", "Free consultation", "Special rate", "Exclusive offer", "Institutional support only"].map((b) => (
                <button
                  key={b}
                  onClick={() => setBenefitType(b)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    benefitType === b ? "bg-[#006699] text-white border-[#006699]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {benefitType === b && <Check className="inline h-3.5 w-3.5 mr-1" />}{b}
                </button>
              ))}
            </div>

            {benefitType && benefitType !== "Institutional support only" && (
              <div className="space-y-4 max-w-lg mx-auto">
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Benefit title</Label>
                  <Input value={benefitTitle} onChange={(e) => setBenefitTitle(e.target.value)} placeholder="e.g. Free financial consultation" maxLength={100} />
                </div>
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Details</Label>
                  <Textarea value={benefitDescription} onChange={(e) => setBenefitDescription(e.target.value)} placeholder="Describe the offer or benefit…" maxLength={300} className="h-20" />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-10">
              <Button onClick={back} variant="outline" className="border-[#006699] text-[#006699]"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
              <Button onClick={() => go("preview")} className="bg-[#006699] hover:bg-[#005588] text-white">Preview <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {/* ── PREVIEW ───────────────────────────────────────────────────── */}
        {screen === "preview" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Preview your sponsor page
            </h2>
            <p className="text-gray-500 text-center mb-10">This is how your presence will look within ParishMart.</p>

            <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-lg bg-white mb-10">
              {/* Hero */}
              <div className="relative h-44 md:h-56 w-full overflow-hidden">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#006699] to-[#1a2341] flex items-center justify-center">
                    <span className="text-white/40 text-sm italic">Your cover image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-5 flex items-end gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden border border-gray-200">
                    {logoPreview ? <img src={logoPreview} alt="" className="w-full h-full object-contain" />
                      : <span className="text-[#006699] font-bold">{initials}</span>}
                  </div>
                  <div>
                    <span className="inline-block bg-[#006699]/80 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                      Community Sponsor
                    </span>
                    <h2 className="text-xl font-bold text-white">{displayName}</h2>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {supportTarget && (
                  <div className="flex items-center gap-2 text-sm text-[#006699] bg-[#006699]/5 rounded-lg px-3 py-2">
                    <span>💒</span>
                    <span>Proudly supporting <strong>{supportTarget.name}</strong></span>
                  </div>
                )}

                {description && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">About</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
                  </div>
                )}

                {benefitTitle && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{benefitTitle}</h3>
                    <p className="text-sm text-gray-600">{benefitDescription}</p>
                    <Button className="mt-3 bg-[#006699] hover:bg-[#005588] text-white text-sm h-auto py-2">
                      Claim Offer <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}

                {whySupport && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Why We Support</h3>
                    <p className="text-sm text-gray-700 italic">"{whySupport}"</p>
                  </div>
                )}
              </div>

              {/* Footer sample */}
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Community Sponsors</p>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                    {logoPreview ? <img src={logoPreview} alt="" className="w-full h-full object-contain" />
                      : <span className="text-[#006699] text-xs font-bold">{initials}</span>}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200" />
                  <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={back} variant="outline" className="border-[#006699] text-[#006699]">
                <ArrowLeft className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button onClick={() => go("payment")} className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-8 py-3 h-auto text-base">
                Continue to activation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── PAYMENT ───────────────────────────────────────────────────── */}
        {screen === "payment" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Activate your sponsorship
            </h2>
            <p className="text-gray-500 text-center mb-10">Launch your sponsor presence and start supporting this community today.</p>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Package</span><span className="font-semibold text-gray-900">{PRESENCE_TIERS.find((t) => t.id === presenceLevel)?.title}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Monthly fee</span><span className="font-semibold text-gray-900">{PRESENCE_TIERS.find((t) => t.id === presenceLevel)?.price}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Supporting</span><span className="font-semibold text-gray-900">{supportTarget?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Visibility</span><span className="font-semibold text-gray-900">{PRESENCE_TIERS.find((t) => t.id === presenceLevel)?.features.length} features</span></div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-gray-700 font-semibold">Community impact</span>
                <span className="text-[#006699] font-semibold">A portion supports {supportTarget?.name}</span>
              </div>
            </div>

            <div className="bg-[#006699]/5 border border-[#006699]/20 rounded-xl p-4 mb-8 text-sm text-[#006699] text-center">
              Your sponsorship helps support the community you choose. Payment setup will be completed during final onboarding.
            </div>

            <Button
              onClick={handleActivate}
              disabled={isSubmitting}
              className="w-full bg-[#006699] hover:bg-[#005588] text-white font-semibold py-4 text-lg h-auto rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? "Activating…" : "Activate Sponsorship"}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
            <button onClick={back} className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        )}

        {/* ── SUCCESS ───────────────────────────────────────────────────── */}
        {screen === "success" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Your sponsor profile is active
            </h2>
            <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
              {displayName} is now a proud sponsor of {supportTarget?.name || "the ParishMart community"}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {[
                { icon: "🏪", title: "View your page", desc: "See your live sponsor page." },
                { icon: "✏️", title: "Edit profile", desc: "Update logo, offer, or details." },
                { icon: "📣", title: "Share page", desc: "Share your sponsor presence." },
              ].map((a) => (
                <div key={a.title} className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                  <div className="text-3xl mb-3">{a.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{a.title}</h4>
                  <p className="text-xs text-gray-500 mb-4">{a.desc}</p>
                  <span className="text-sm font-medium text-[#006699]">Open <ExternalLink className="inline h-3.5 w-3.5 ml-1" /></span>
                </div>
              ))}
            </div>

            <Button onClick={() => (window.location.href = "/")} className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-10 py-3 h-auto text-base">
              Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SponsorActivation;
