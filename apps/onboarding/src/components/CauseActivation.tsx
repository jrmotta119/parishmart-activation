import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Upload, ArrowRight, ArrowLeft, Check, ExternalLink, Church, Globe, Store, Share2, Settings } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import ParishSelector, { type PreloadedParish } from "./ParishSelector";
import parishMartLogo from "../assets/logo1.png";

// ─── Types ──────────────────────────────────────────────────────────────────

type Screen = "wow" | "info" | "parish" | "visual" | "modules" | "preview" | "pricing" | "success";

const SCREEN_ORDER: Screen[] = ["wow", "info", "parish", "visual", "modules", "preview", "pricing", "success"];

const CAUSE_TYPES = [
  "Ministry",
  "Mission",
  "Retreat Group",
  "Nonprofit",
  "Parish Cause",
  "Community Cause",
  "Other",
];

interface ModuleState {
  donations: boolean;
  merch: boolean;
  religious: boolean;
  localBiz: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

const CauseActivation = () => {
  const [screen, setScreen] = useState<Screen>("wow");

  // Cause info
  const [causeName, setCauseName] = useState("");
  const [causeType, setCauseType] = useState("");
  const [missionStatement, setMissionStatement] = useState("");

  // Parish linking
  const [linkedParish, setLinkedParish] = useState<PreloadedParish | null>(null);
  const [parishChoice, setParishChoice] = useState<"yes" | "no" | null>(null);

  // Visual
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [aboutText, setAboutText] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderPhoto, setLeaderPhoto] = useState<File | null>(null);
  const [leaderPhotoPreview, setLeaderPhotoPreview] = useState("");
  const [leaderBio, setLeaderBio] = useState("");

  // Modules
  const [modules, setModules] = useState<ModuleState>({
    donations: true,
    merch: true,
    religious: true,
    localBiz: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Navigation ──

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const idx = SCREEN_ORDER.indexOf(screen);
  const next = () => idx < SCREEN_ORDER.length - 1 && go(SCREEN_ORDER[idx + 1]);
  const back = () => idx > 0 && go(SCREEN_ORDER[idx - 1]);

  // ── File handlers ──

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogo(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - photos.length);
      const updated = [...photos, ...files].slice(0, 5);
      setPhotos(updated);
      setPhotoPreviews(updated.map((f) => URL.createObjectURL(f)));
    }
  };

  const removePhoto = (i: number) => {
    const updated = photos.filter((_, idx) => idx !== i);
    setPhotos(updated);
    setPhotoPreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleLeaderPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLeaderPhoto(e.target.files[0]);
      setLeaderPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const toggleModule = (key: keyof ModuleState) => setModules((p) => ({ ...p, [key]: !p[key] }));

  // ── Submit ──

  const handleActivate = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    go("success");
  };

  // ── Helpers ──

  const initials = causeName
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "CS";

  const displayName = causeName || "Your Cause";
  const isImmersive = screen === "wow";
  const stepsTotal = SCREEN_ORDER.length - 2; // exclude wow + success
  const stepNum = Math.max(0, idx - 1);

  const ProgressBar = () => (
    <div className="flex gap-1.5 justify-center mb-8">
      {Array.from({ length: stepsTotal }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${i <= stepNum ? "w-6 bg-[#006699]" : "w-1.5 bg-gray-300"}`}
        />
      ))}
    </div>
  );

  const NavButtons = ({
    nextLabel = "Continue",
    onNext,
    disabled,
    hideBack,
  }: {
    nextLabel?: string;
    onNext?: () => void;
    disabled?: boolean;
    hideBack?: boolean;
  }) => (
    <div className="flex justify-between mt-10">
      {!hideBack ? (
        <Button type="button" onClick={back} variant="outline" className="border-[#006699] text-[#006699]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      ) : <div />}
      <Button
        type="button"
        onClick={onNext || next}
        className="bg-[#006699] hover:bg-[#005588] text-white disabled:opacity-50"
        disabled={disabled}
      >
        {nextLabel} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const MODULE_CARDS: { key: keyof ModuleState; title: string; desc: string; symbol: string; from: string; to: string }[] = [
    { key: "donations", title: "Donations", desc: "Receive direct support for your mission", symbol: "♡", from: "#0C2E1B", to: "#185A36" },
    { key: "merch", title: "Merch Store", desc: "Custom apparel that builds identity and raises support", symbol: "◈", from: "#3A1010", to: "#6B2626" },
    { key: "religious", title: "Religious Gifts", desc: "Meaningful faith-based products, no inventory required", symbol: "✛", from: "#0D2540", to: "#1B4472" },
    { key: "localBiz", title: "Local Business Supporters", desc: "Invite businesses to support your cause", symbol: "◉", from: "#191929", to: "#2D2D50" },
  ];

  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isImmersive && (
        <div className="sticky top-0 left-0 w-full z-40 bg-white border-b border-gray-100">
          <Header />
        </div>
      )}

      <div className="flex-1">
        {/* ── SCREEN 0: WOW ─────────────────────────────────────────────── */}
        {screen === "wow" && (
          <div className="relative min-h-screen flex items-center">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a2341]/95 via-[#1a2341]/80 to-[#1a2341]/40" />
            </div>
            <div className="absolute top-6 left-6 z-20">
              <img src={parishMartLogo} alt="ParishMart" className="h-8 w-auto" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Start supporting your mission{" "}
                <span className="text-[#4DB8E0]">in minutes</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Create a simple, beautiful space to receive support through donations, merch,
                faith-based products, and local business participation.
              </p>
              <Button
                onClick={next}
                className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-10 py-4 text-lg h-auto rounded-xl shadow-xl"
              >
                Yes, let's start <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <p className="text-white/50 text-sm mt-6">
                3 months free. Then $49.99/month or transactional model.
              </p>
            </div>
          </div>
        )}

        {/* ── SCREEN 1: CAUSE INFO ──────────────────────────────────────── */}
        {screen === "info" && (
          <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Tell us about your cause
            </h2>
            <p className="text-gray-500 text-center mb-10">You can edit everything later.</p>

            <div className="space-y-5">
              <div>
                <Label className="block text-sm text-gray-600 mb-1">Cause / Mission Name</Label>
                <Input
                  value={causeName}
                  onChange={(e) => setCauseName(e.target.value)}
                  placeholder="e.g. Emmaus Women Weston"
                  maxLength={120}
                />
              </div>

              <div>
                <Label className="block text-sm text-gray-600 mb-1">Type of cause</Label>
                <select
                  value={causeType}
                  onChange={(e) => setCauseType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006699]"
                >
                  <option value="">Select…</option>
                  {CAUSE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="block text-sm text-gray-600 mb-1">Short mission statement</Label>
                <Textarea
                  value={missionStatement}
                  onChange={(e) => setMissionStatement(e.target.value)}
                  placeholder="Helping people grow in faith, build community, and serve others through meaningful experiences."
                  maxLength={300}
                  className="h-24"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{missionStatement.length}/300</p>
              </div>
            </div>

            <NavButtons hideBack />
          </div>
        )}

        {/* ── SCREEN 2: PARISH LINKING ──────────────────────────────────── */}
        {screen === "parish" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Is your cause connected to a parish?
            </h2>
            <p className="text-gray-500 text-center mb-10">
              If yes, your cause can appear inside the parish store for more visibility.
            </p>

            {!parishChoice && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => setParishChoice("yes")}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-[#006699] hover:shadow-md transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#006699]/20 transition-colors">
                    <Church className="h-6 w-6 text-[#006699]" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Yes, link to a parish</h4>
                </button>
                <button
                  onClick={() => { setParishChoice("no"); next(); }}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-[#006699] hover:shadow-md transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#006699]/20 transition-colors">
                    <Globe className="h-6 w-6 text-[#006699]" />
                  </div>
                  <h4 className="font-semibold text-gray-900">No, continue independent</h4>
                </button>
              </div>
            )}

            {parishChoice === "yes" && (
              <div className="mt-6">
                {linkedParish ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-4">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{linkedParish.name}</p>
                      <p className="text-sm text-gray-500">{linkedParish.city}, {linkedParish.state}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLinkedParish(null)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3">Find and link your parish</h3>
                    <ParishSelector
                      onSelect={(p) => setLinkedParish(p)}
                      onManualEntry={() => {}}
                      selectedParish={linkedParish}
                      onClear={() => setLinkedParish(null)}
                    />
                  </div>
                )}

                <NavButtons disabled={!linkedParish} />
              </div>
            )}

            {parishChoice === "yes" && !linkedParish && (
              <button
                type="button"
                onClick={() => { setParishChoice("no"); next(); }}
                className="block mx-auto mt-6 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Skip — continue without linking
              </button>
            )}

            {!parishChoice && (
              <div className="mt-8">
                <NavButtons hideBack={false} />
              </div>
            )}
          </div>
        )}

        {/* ── SCREEN 3: VISUAL SETUP ────────────────────────────────────── */}
        {screen === "visual" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Make your cause page look beautiful
            </h2>
            <p className="text-gray-500 text-center mb-10">You can update everything later.</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div>
                  <Label className="block text-sm text-gray-600 mb-2">Logo</Label>
                  <div className="flex gap-3 items-start">
                    <label className="block w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-white overflow-hidden flex-shrink-0">
                      <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                      {logoPreview ? (
                        <img src={logoPreview} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <Upload className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </label>
                    {!logoPreview && (
                      <div className="flex-1 pt-1">
                        <p className="text-xs text-gray-500">Or use name as logo:</p>
                        <div className="mt-1 w-12 h-12 rounded-full bg-[#006699] flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{initials}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="block text-sm text-gray-600 mb-2">Photos ({photos.length}/5)</Label>
                  <p className="text-xs text-gray-400 mb-2">Photos that represent your mission, community, or impact.</p>
                  <div className="flex gap-2 flex-wrap">
                    {photoPreviews.map((src, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                        <button type="button" onClick={() => removePhoto(i)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">×</button>
                      </div>
                    ))}
                    {photos.length < 5 && (
                      <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white flex items-center justify-center">
                        <input type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
                        <Upload className="h-4 w-4 text-gray-400" />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">About the cause</Label>
                  <Textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="Share what your cause does and why it matters…"
                    maxLength={500}
                    className="h-24"
                  />
                </div>
              </div>

              {/* Right column — Leader (optional) */}
              <div className="space-y-5 bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Leader / Coordinator</h3>
                  <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Optional</span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="block w-16 h-16 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:bg-white overflow-hidden flex-shrink-0">
                    <input type="file" accept="image/*" onChange={handleLeaderPhoto} className="hidden" />
                    {leaderPhotoPreview ? (
                      <img src={leaderPhotoPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Upload className="h-4 w-4 text-gray-400" /></div>
                    )}
                  </label>
                  <div className="flex-1">
                    <Input
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="Full name"
                      maxLength={80}
                    />
                  </div>
                </div>

                <Textarea
                  value={leaderBio}
                  onChange={(e) => setLeaderBio(e.target.value)}
                  placeholder="Short bio or description…"
                  maxLength={200}
                  className="h-20"
                />
              </div>
            </div>

            <NavButtons nextLabel="Preview my store" />
          </div>
        )}

        {/* ── SCREEN 4: SUPPORT MODULES ─────────────────────────────────── */}
        {screen === "modules" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Choose how people can support your cause
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Activate now. Customize anytime.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MODULE_CARDS.map((card) => {
                const active = modules[card.key];
                return (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => toggleModule(card.key)}
                    className={`relative flex flex-col justify-between rounded-2xl p-5 text-left min-h-[160px] overflow-hidden transition-all ${
                      active ? "ring-2 ring-[#006699] shadow-lg" : "opacity-60"
                    }`}
                    style={{ background: `linear-gradient(140deg, ${card.from} 0%, ${card.to} 100%)` }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl leading-none" style={{ color: "#4DB8E0", fontFamily: "Georgia, serif" }}>
                        {card.symbol}
                      </span>
                      <span
                        className={`text-[10px] font-semibold tracking-wider uppercase rounded-full px-2.5 py-0.5 ${
                          active ? "bg-green-500/20 text-green-300 border border-green-400/40" : "bg-white/10 text-white/50 border border-white/20"
                        }`}
                      >
                        {active ? "Active" : "Off"}
                      </span>
                    </div>
                    <div>
                      <div className="mb-2 h-px opacity-25 bg-[#4DB8E0]" />
                      <h3 className="text-lg italic leading-tight text-white" style={{ fontFamily: "Georgia, serif" }}>
                        {card.title}
                      </h3>
                      <p className="text-[11px] mt-1 text-white/60">{card.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <NavButtons />
          </div>
        )}

        {/* ── SCREEN 5: PREVIEW ─────────────────────────────────────────── */}
        {screen === "preview" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Your cause store preview
            </h2>
            <p className="text-gray-500 text-center mb-10">This is what supporters will see.</p>

            <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-lg bg-[#faf6ee] mb-10">
              {/* Hero */}
              <div className="relative h-48 md:h-56 w-full overflow-hidden">
                {photoPreviews[0] ? (
                  <img src={photoPreviews[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#006699] to-[#1a2341] flex items-center justify-center">
                    <span className="text-white/40 text-sm italic">Your cover photo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 px-5 pb-5">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-white/80 shadow flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[#006699] font-bold text-base">{initials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-0.5">
                    <h2 className="text-xl md:text-2xl italic text-white leading-tight truncate" style={{ fontFamily: "Georgia, serif" }}>
                      {displayName}
                    </h2>
                    {linkedParish && (
                      <p className="text-[11px] text-white/70 mt-0.5">
                        In partnership with {linkedParish.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="px-5 pt-5 pb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#006699] mb-2">About</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {aboutText || missionStatement || `${displayName} — supporting faith, community, and purpose.`}
                </p>
              </div>

              <div className="h-px mx-5 mb-4 bg-[#d4a853]/30" />

              {/* Module cards */}
              <div className="grid grid-cols-2 gap-3 px-4 pb-6">
                {MODULE_CARDS.filter((c) => modules[c.key]).map((card) => (
                  <div
                    key={card.key}
                    className="relative flex flex-col justify-between rounded-2xl p-4 text-left min-h-[130px] overflow-hidden"
                    style={{ background: `linear-gradient(140deg, ${card.from} 0%, ${card.to} 100%)` }}
                  >
                    <span className="text-xl leading-none" style={{ color: "#4DB8E0", fontFamily: "Georgia, serif" }}>{card.symbol}</span>
                    <div>
                      <div className="mb-2 h-px opacity-25 bg-[#4DB8E0]" />
                      <h3 className="text-base italic leading-tight text-white" style={{ fontFamily: "Georgia, serif" }}>{card.title}</h3>
                      <p className="text-[10px] mt-1 text-white/50">Explore →</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={back} variant="outline" className="border-[#006699] text-[#006699]">
                <ArrowLeft className="mr-2 h-4 w-4" /> Edit details
              </Button>
              <Button onClick={next} className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-8 py-3 h-auto text-base">
                Activate my cause store <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── SCREEN 6: PRICING ─────────────────────────────────────────── */}
        {screen === "pricing" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressBar />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Start with 3 months free
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Launch your cause store today and start receiving support.
            </p>

            {/* Plan card */}
            <div className="bg-gradient-to-br from-[#006699] to-[#004d73] rounded-3xl p-8 text-white text-center mb-8 shadow-xl">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Cause Store Plan</p>
              <p className="text-4xl font-bold mb-1">3 Months Free</p>
              <p className="text-sm text-white/70 mb-6">Then $49.99/month · or transactional model</p>

              <div className="bg-white/10 rounded-2xl p-5 text-left space-y-2.5">
                {[
                  "No setup cost",
                  "Ready to receive support immediately",
                  "Cancel anytime during trial",
                  "Full customization available after activation",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-300 flex-shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-8 space-y-2 text-sm">
              <p className="text-gray-700"><span className="font-semibold">Cause:</span> {displayName}</p>
              <p className="text-gray-700">
                <span className="font-semibold">Parish:</span> {linkedParish ? linkedParish.name : "Independent"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Active modules:</span>{" "}
                {MODULE_CARDS.filter((c) => modules[c.key]).map((c) => c.title).join(", ")}
              </p>
            </div>

            <Button
              onClick={handleActivate}
              disabled={isSubmitting}
              className="w-full bg-[#006699] hover:bg-[#005588] text-white font-semibold py-4 text-lg h-auto rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? "Activating…" : "Start Free Trial"}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>

            <button type="button" onClick={back} className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700">
              ← Go back
            </button>
          </div>
        )}

        {/* ── SCREEN 7: SUCCESS ─────────────────────────────────────────── */}
        {screen === "success" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#e8f4f9] border-2 border-[#45b1e1]/40 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-[#006699]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Your cause store is ready
            </h2>
            <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
              You can now start receiving support, inviting your community, and growing your mission.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-3">
                  <Store className="h-5 w-5 text-[#006699]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Go to my store</h4>
                <p className="text-xs text-gray-500 mb-4">See your live cause page.</p>
                <span className="text-sm font-medium text-[#006699]">View Store <ExternalLink className="inline h-3.5 w-3.5 ml-1" /></span>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-5 w-5 text-[#006699]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Invite supporters</h4>
                <p className="text-xs text-gray-500 mb-4">Share with your community.</p>
                <span className="text-sm font-medium text-[#006699]">Invite <ExternalLink className="inline h-3.5 w-3.5 ml-1" /></span>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-[#006699] hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-3">
                  <Settings className="h-5 w-5 text-[#006699]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Customize later</h4>
                <p className="text-xs text-gray-500 mb-4">Edit from your dashboard anytime.</p>
                <span className="text-sm font-medium text-[#006699]">Dashboard <ExternalLink className="inline h-3.5 w-3.5 ml-1" /></span>
              </div>
            </div>

            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-[#006699] hover:bg-[#1e3960] text-white font-semibold px-10 py-3 h-auto text-base"
            >
              Finish <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CauseActivation;
