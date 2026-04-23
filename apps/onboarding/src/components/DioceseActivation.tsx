import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowRight, ArrowLeft, Check, ExternalLink, Church, GraduationCap, Globe, ShoppingBag, Users, Mail, BarChart3, Megaphone } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import parishes from "@/data/preloadedParishes.json";
import logo from "../assets/logo1.png";

// ─── Types ──────────────────────────────────────────────────────────────────

type Screen = "wow" | "select" | "ecosystem" | "structure" | "loading" | "dashboard" | "trial" | "success";

const SCREEN_ORDER: Screen[] = ["wow", "select", "ecosystem", "structure", "loading", "dashboard", "trial", "success"];

interface Diocese {
  name: string;
  city: string;
  state: string;
  parishCount: number;
}

const PARISH_RANGES = ["1–25", "25–50", "50–100", "100+"] as const;

const MOCK_DIOCESES: Diocese[] = [
  { name: "Archdiocese of Miami", city: "Miami", state: "FL", parishCount: 109 },
  { name: "Diocese of Orlando", city: "Orlando", state: "FL", parishCount: 79 },
  { name: "Diocese of Palm Beach", city: "Palm Beach Gardens", state: "FL", parishCount: 51 },
  { name: "Diocese of St. Petersburg", city: "St. Petersburg", state: "FL", parishCount: 74 },
  { name: "Diocese of Venice", city: "Venice", state: "FL", parishCount: 62 },
  { name: "Archdiocese of Los Angeles", city: "Los Angeles", state: "CA", parishCount: 287 },
  { name: "Archdiocese of Chicago", city: "Chicago", state: "IL", parishCount: 216 },
  { name: "Archdiocese of New York", city: "New York", state: "NY", parishCount: 296 },
  { name: "Diocese of Brooklyn", city: "Brooklyn", state: "NY", parishCount: 186 },
  { name: "Archdiocese of San Antonio", city: "San Antonio", state: "TX", parishCount: 139 },
  { name: "Diocese of San Diego", city: "San Diego", state: "CA", parishCount: 98 },
  { name: "Archdiocese of Boston", city: "Boston", state: "MA", parishCount: 289 },
];

function estimateImpact(count: number): string {
  const perParish = 18000;
  const total = count * perParish;
  if (total >= 1_000_000) return `$${(total / 1_000_000).toFixed(1)}M`;
  return `$${(total / 1_000).toFixed(0)}K`;
}

// ─── Component ──────────────────────────────────────────────────────────────

const DioceseActivation = () => {
  const [screen, setScreen] = useState<Screen>("wow");

  // Step 0
  const [parishRange, setParishRange] = useState("");
  const [customCount, setCustomCount] = useState("");

  // Step 1
  const [dioceseQuery, setDioceseQuery] = useState("");
  const [selectedDiocese, setSelectedDiocese] = useState<Diocese | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualState, setManualState] = useState("");

  // Step 3
  const [toggles, setToggles] = useState({
    giving: true,
    religious: true,
    merch: true,
    localBiz: true,
    sponsors: true,
    campaigns: true,
  });

  // Loading
  const [loadingDone, setLoadingDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const go = (s: Screen) => { setScreen(s); window.scrollTo(0, 0); };
  const idx = SCREEN_ORDER.indexOf(screen);
  const back = () => idx > 0 && go(SCREEN_ORDER[idx - 1]);

  // ── Derived ──

  const parishCount = (() => {
    if (selectedDiocese) return selectedDiocese.parishCount;
    if (customCount) return parseInt(customCount) || 50;
    const map: Record<string, number> = { "1–25": 15, "25–50": 37, "50–100": 75, "100+": 150 };
    return map[parishRange] || 50;
  })();

  const dioceseName = selectedDiocese?.name || manualName || "Your Diocese";
  const schoolCount = Math.max(2, Math.round(parishCount * 0.14));
  const missionCount = Math.max(1, Math.round(parishCount * 0.07));

  const filteredDioceses = useMemo(() => {
    if (!dioceseQuery.trim()) return MOCK_DIOCESES;
    const q = dioceseQuery.toLowerCase();
    return MOCK_DIOCESES.filter(
      (d) => d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.state.toLowerCase().includes(q)
    );
  }, [dioceseQuery]);

  const matchedParishes = useMemo(() => {
    if (!selectedDiocese) return [];
    const name = selectedDiocese.name.toLowerCase();
    return (parishes as any[]).filter((p: any) => p.diocese?.toLowerCase() === name);
  }, [selectedDiocese]);

  // ── Loading simulation ──

  const startLoading = () => {
    go("loading");
    setLoadingDone(false);
    setTimeout(() => setLoadingDone(true), 2500);
  };

  const handleActivate = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    go("success");
  };

  // ── Shared UI ──

  const isImmersive = screen === "wow";

  const ProgressBar = () => {
    const total = SCREEN_ORDER.length - 2;
    const current = Math.max(0, idx - 1);
    return (
      <div className="flex gap-1.5 justify-center mb-8">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i <= current ? "w-6 bg-[#006699]" : "w-1.5 bg-gray-300"}`} />
        ))}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isImmersive && (
        <div className="sticky top-0 left-0 w-full z-40 bg-white border-b border-gray-100">
          <Header />
        </div>
      )}

      <div className="flex-1">
        {/* ── STEP 0: WOW ───────────────────────────────────────────────── */}
        {screen === "wow" && (
          <div className="relative min-h-screen flex items-center">
            <div className="absolute inset-0 z-0">
              <img src="https://images.pexels.com/photos/2310641/pexels-photo-2310641.jpeg" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f1729]/95 via-[#0f1729]/85 to-[#0f1729]/50" />
            </div>
            {/* Logo always visible on immersive screen */}
            <div className="absolute top-6 left-6 z-20">
              <img src={logo} alt="ParishMart" className="h-8 w-auto" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Activate your Diocese{" "}
                <span className="text-[#4DB8E0]">in minutes</span>
              </h1>
              <p className="text-lg md:text-xl text-white/75 mb-12 max-w-2xl mx-auto">
                Turn everyday transactions into sustainable support for your parishes, schools, and missions.
              </p>

              <div className="max-w-md mx-auto mb-8">
                <p className="text-white/60 text-sm mb-3">How many parishes does your Diocese have?</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {PARISH_RANGES.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setParishRange(r); setCustomCount(""); }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        parishRange === r
                          ? "bg-white text-[#006699] border-white"
                          : "bg-white/10 text-white border-white/20 hover:border-white/50"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <Input
                  value={customCount}
                  onChange={(e) => { setCustomCount(e.target.value.replace(/\D/g, "")); setParishRange(""); }}
                  placeholder="Or enter exact number…"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-center"
                  maxLength={5}
                />
              </div>

              {(parishRange || customCount) && (
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 max-w-sm mx-auto mb-8 border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Estimated annual impact</p>
                  <p className="text-4xl font-bold text-white">{estimateImpact(parishCount)}</p>
                  <p className="text-white/50 text-xs mt-1">Illustrative estimate</p>
                </div>
              )}

              <Button
                onClick={() => go("select")}
                className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-10 py-4 text-lg h-auto rounded-xl shadow-xl"
              >
                Activate my Diocese <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 1: SELECT DIOCESE ─────────────────────────────────────── */}
        {screen === "select" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Find your Diocese
            </h2>
            <p className="text-gray-500 text-center mb-8">Select from the list or create a new one.</p>

            {!manualMode ? (
              <>
                <div className="max-w-xl mx-auto mb-6">
                  <Input
                    value={dioceseQuery}
                    onChange={(e) => setDioceseQuery(e.target.value)}
                    placeholder="Search by name, city, or state…"
                    className="text-center"
                    autoFocus
                  />
                </div>

                <div className="space-y-3 mb-6">
                  {filteredDioceses.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => { setSelectedDiocese(d); go("ecosystem"); }}
                      className={`w-full flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-[#006699] hover:shadow-md transition-all text-left group ${
                        selectedDiocese?.name === d.name ? "border-[#006699] shadow-md" : ""
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#006699]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#006699] font-bold text-sm">{d.name.split(" ").pop()?.[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-[#006699] truncate">{d.name}</p>
                        <p className="text-sm text-gray-500">{d.city}, {d.state} · {d.parishCount} parishes</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#006699]" />
                    </button>
                  ))}
                </div>

                <button onClick={() => setManualMode(true)} className="block mx-auto text-sm text-[#006699] hover:underline">
                  My diocese isn't listed — create new
                </button>
              </>
            ) : (
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Diocese name</Label>
                  <Input value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="e.g. Diocese of…" maxLength={150} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm text-gray-600 mb-1">City</Label>
                    <Input value={manualCity} onChange={(e) => setManualCity(e.target.value)} maxLength={100} />
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-600 mb-1">State</Label>
                    <Input value={manualState} onChange={(e) => setManualState(e.target.value)} maxLength={2} placeholder="FL" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setManualMode(false)} className="border-[#006699] text-[#006699]">Cancel</Button>
                  <Button
                    onClick={() => {
                      setSelectedDiocese({ name: manualName, city: manualCity, state: manualState, parishCount });
                      go("ecosystem");
                    }}
                    className="bg-[#006699] hover:bg-[#005588] text-white flex-1"
                    disabled={!manualName}
                  >
                    Save and continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-8"><button onClick={back} className="block mx-auto text-sm text-gray-500 hover:text-gray-700">← Back</button></div>
          </div>
        )}

        {/* ── STEP 2: ECOSYSTEM VIEW ────────────────────────────────────── */}
        {screen === "ecosystem" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Your diocesan ecosystem
            </h2>
            <p className="text-gray-500 text-center mb-10">
              {dioceseName} becomes a connected economic ecosystem, not individual stores.
            </p>

            {/* 4 Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Parishes", value: parishCount, Icon: Church, desc: "ready to activate" },
                { label: "Schools", value: schoolCount, Icon: GraduationCap, desc: "can integrate" },
                { label: "Missions", value: missionCount, Icon: Globe, desc: "connected" },
                { label: "Local Business", value: "∞", Icon: ShoppingBag, desc: "unlimited support" },
              ].map((s) => (
                <div key={s.label} className="bg-gradient-to-br from-[#006699] to-[#004d73] rounded-2xl p-5 text-white text-center">
                  <div className="flex justify-center">
                    <s.Icon className="h-6 w-6 text-[#45b1e1]" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{s.value}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wider mt-1">{s.label}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Sample parishes from preloaded data */}
            {matchedParishes.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Parishes in {selectedDiocese?.name} ({matchedParishes.length} pre-loaded)</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {matchedParishes.slice(0, 8).map((p: any) => (
                    <div key={p.id} className="flex-shrink-0 w-48 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="font-medium text-gray-900 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.city}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button onClick={() => go("structure")} className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-8 py-3 h-auto text-base">
                Continue setup <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <button onClick={back} className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        )}

        {/* ── STEP 3: ACTIVATE STRUCTURE ─────────────────────────────────── */}
        {screen === "structure" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Activate your system
            </h2>
            <p className="text-gray-500 text-center mb-10">
              All parishes will be pre-loaded with these features. Everything is ON by default.
            </p>

            <div className="space-y-3 mb-8">
              {([
                { key: "giving" as const, label: "Online Giving (Donations)", symbol: "♡" },
                { key: "religious" as const, label: "Religious Products", symbol: "✛" },
                { key: "merch" as const, label: "Parish Merch", symbol: "◈" },
                { key: "localBiz" as const, label: "Local Business Supporters", symbol: "◉" },
                { key: "sponsors" as const, label: "Diocese-level Sponsors", Icon: Users },
                { key: "campaigns" as const, label: "Centralized Campaigns", Icon: Megaphone },
              ] as Array<{ key: keyof typeof toggles; label: string; symbol?: string; Icon?: React.ElementType }>).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setToggles((p) => ({ ...p, [item.key]: !p[item.key] }))}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    toggles[item.key]
                      ? "border-[#006699] bg-[#006699]/5"
                      : "border-gray-200 bg-white opacity-60"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {item.symbol ? (
                      <span className="text-lg leading-none" style={{ color: "#006699", fontFamily: "Georgia, serif" }}>{item.symbol}</span>
                    ) : item.Icon ? (
                      <item.Icon className="h-5 w-5 text-[#006699]" />
                    ) : null}
                  </div>
                  <span className="flex-1 font-medium text-gray-900">{item.label}</span>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${toggles[item.key] ? "bg-[#006699]" : "bg-gray-300"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${toggles[item.key] ? "left-[18px]" : "left-0.5"}`} />
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button onClick={back} variant="outline" className="border-[#006699] text-[#006699]">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={startLoading} className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-8 py-3 h-auto">
                Activate system <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 4: LOADING ───────────────────────────────────────────── */}
        {screen === "loading" && (
          <div className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Activating your Diocese…</h2>

              {!loadingDone ? (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
                    <div className="bg-[#006699] h-2 rounded-full animate-pulse" style={{ width: "70%", transition: "width 2s" }} />
                  </div>
                  <p className="text-gray-500 text-sm">Pre-loading parishes, categories, and products…</p>
                </>
              ) : (
                <>
                  <div className="space-y-2 mb-8">
                    {[
                      `${parishCount} parishes ready`,
                      `${schoolCount} schools ready`,
                      `${missionCount} missions ready`,
                    ].map((t) => (
                      <div key={t} className="flex items-center gap-2 justify-center text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">{t}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => go("dashboard")} className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-8 py-3 h-auto">
                    Review and launch <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 5: DASHBOARD PREVIEW ─────────────────────────────────── */}
        {screen === "dashboard" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              {dioceseName}
            </h2>
            <p className="text-gray-500 text-center mb-10">Executive dashboard preview</p>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Parishes Activated", value: parishCount },
                { label: "Est. Annual Donations", value: estimateImpact(parishCount) },
                { label: "Active Businesses", value: "0" },
                { label: "Products Available", value: "500+" },
              ].map((k) => (
                <div key={k.label} className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-gray-900">{k.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{k.label}</p>
                </div>
              ))}
            </div>

            {/* Parish grid sample */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Parish stores</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {matchedParishes.slice(0, 12).map((p: any, i: number) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-2">
                      <span className="text-[#006699] font-bold text-xs">{p.name?.[0]}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.city}</p>
                  </div>
                ))}
                {matchedParishes.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400 text-sm">
                    Parish data will be pre-loaded during activation.
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <div className="flex items-center gap-2 bg-[#006699]/5 border border-[#006699]/20 rounded-xl px-4 py-3 text-sm text-[#006699] font-medium">
                <Church className="h-4 w-4" /> Activate all parishes
              </div>
              <div className="flex items-center gap-2 bg-[#006699]/5 border border-[#006699]/20 rounded-xl px-4 py-3 text-sm text-[#006699] font-medium">
                <Mail className="h-4 w-4" /> Invite parishes
              </div>
              <div className="flex items-center gap-2 bg-[#006699]/5 border border-[#006699]/20 rounded-xl px-4 py-3 text-sm text-[#006699] font-medium">
                <ShoppingBag className="h-4 w-4" /> Invite businesses
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={() => go("trial")} className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-10 py-3 h-auto text-base">
                Start free trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <button onClick={back} className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        )}

        {/* ── STEP 6: FREE TRIAL ────────────────────────────────────────── */}
        {screen === "trial" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Start your free trial
            </h2>
            <p className="text-gray-500 text-center mb-10">No cost. No risk. Start generating impact today.</p>

            <div className="bg-gradient-to-br from-[#006699] to-[#004d73] rounded-3xl p-8 text-white text-center mb-8 shadow-xl">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Diocese Plan</p>
              <p className="text-4xl font-bold mb-1">90 Days Free</p>
              <p className="text-sm text-white/70 mb-6">All parishes pre-loaded and activated</p>

              <div className="bg-white/10 rounded-2xl p-5 text-left space-y-2.5">
                {[
                  `${parishCount} parishes pre-loaded`,
                  "Donations active across all parishes",
                  "Merch enabled with parish branding",
                  "Local business support enabled",
                  "Centralized dashboard and reporting",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-300 flex-shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleActivate}
              disabled={isSubmitting}
              className="w-full bg-[#006699] hover:bg-[#005588] text-white font-semibold py-4 text-lg h-auto rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? "Activating…" : "Start Free Trial"}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
            <button onClick={back} className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700">← Back</button>
          </div>
        )}

        {/* ── STEP 7: SUCCESS ───────────────────────────────────────────── */}
        {screen === "success" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#e8f4f9] border-2 border-[#45b1e1]/40 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-[#006699]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Your Diocese is now active
            </h2>
            <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
              {dioceseName} — {parishCount} parishes activated and ready to generate impact.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-5 w-5 text-[#006699]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Invite parishes</h4>
                <p className="text-xs text-gray-500 mb-4">Notify parish administrators.</p>
                <span className="text-sm font-medium text-[#006699]">Invite <ExternalLink className="inline h-3.5 w-3.5 ml-1" /></span>
              </div>
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-5 w-5 text-[#006699]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Launch campaign</h4>
                <p className="text-xs text-gray-500 mb-4">Centralized giving campaign.</p>
                <span className="text-sm font-medium text-[#006699]">Create <ExternalLink className="inline h-3.5 w-3.5 ml-1" /></span>
              </div>
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-5 w-5 text-[#006699]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Invite businesses</h4>
                <p className="text-xs text-gray-500 mb-4">Local business supporters.</p>
                <span className="text-sm font-medium text-[#006699]">Invite <ExternalLink className="inline h-3.5 w-3.5 ml-1" /></span>
              </div>
            </div>

            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-[#006699] hover:bg-[#1e3960] text-white font-semibold px-10 py-3 h-auto text-base"
            >
              Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DioceseActivation;
