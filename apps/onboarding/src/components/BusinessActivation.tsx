import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Upload, ArrowRight, ArrowLeft, Check, Wrench, ShoppingBag, Package, Link, FileText, PenLine, MessageSquare, Calendar, Heart, Sparkles, Megaphone, Settings, CreditCard } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import ParishSelector, { type PreloadedParish } from "./ParishSelector";
import logo from "../assets/logo1.png";

// ─── Types ──────────────────────────────────────────────────────────────────

type Screen =
  | "wow"
  | "transition"
  | "type"
  | "profile"
  // Flow A — Services
  | "services"
  | "offer"
  | "contact"
  | "pricing-a"
  // Flow B — Products
  | "catalog"
  | "parish-b"
  | "pricing-b"
  | "activate-b";

type BusinessType = "services" | "products" | null;

interface FormData {
  businessType: BusinessType;
  businessName: string;
  businessDescription: string;
  logo: File | null;
  photos: File[];
  entrepreneurName: string;
  entrepreneurPhoto: File | null;
  entrepreneurBio: string;
  serviceCategories: string[];
  discountPercent: string;
  customDiscount: string;
  contactMethod: "info" | "book" | null;
  contactUrl: string;
  catalogMethod: string | null;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const SERVICE_TAGS = [
  "Consulting",
  "Professional Services",
  "Home & Repair",
  "Health & Wellness",
  "Education & Tutoring",
  "Legal Services",
  "Real Estate",
  "Fitness & Sports",
  "Beauty & Personal Care",
  "Financial Services",
  "Other",
];

const CATALOG_METHODS = [
  { id: "amazon", label: "Import from Amazon", Icon: Package },
  { id: "shopify", label: "Import from Shopify", Icon: ShoppingBag },
  { id: "other-marketplace", label: "Import from another marketplace", Icon: Link },
  { id: "csv", label: "Upload with Excel / CSV", Icon: FileText },
  { id: "manual", label: "Add manually", Icon: PenLine },
];

const DISCOUNT_OPTIONS = ["10", "15", "20"];

// ─── Helpers ────────────────────────────────────────────────────────────────

function screenOrder(type: BusinessType): Screen[] {
  const shared: Screen[] = ["wow", "transition", "type", "profile"];
  if (type === "services") return [...shared, "services", "offer", "contact", "pricing-a"];
  if (type === "products") return [...shared, "catalog", "parish-b", "pricing-b", "activate-b"];
  return shared;
}

// ─── Component ──────────────────────────────────────────────────────────────

const BusinessActivation = () => {
  const [screen, setScreen] = useState<Screen>("wow");
  const [formData, setFormData] = useState<FormData>({
    businessType: null,
    businessName: "",
    businessDescription: "",
    logo: null,
    photos: [],
    entrepreneurName: "",
    entrepreneurPhoto: null,
    entrepreneurBio: "",
    serviceCategories: [],
    discountPercent: "",
    customDiscount: "",
    contactMethod: null,
    contactUrl: "",
    catalogMethod: null,
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [entrepreneurPhotoPreview, setEntrepreneurPhotoPreview] = useState("");
  const [selectedParish, setSelectedParish] = useState<PreloadedParish | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Navigation ──

  const order = screenOrder(formData.businessType);
  const currentIdx = order.indexOf(screen);

  const next = () => {
    if (currentIdx < order.length - 1) {
      setScreen(order[currentIdx + 1]);
      window.scrollTo(0, 0);
    }
  };

  const back = () => {
    if (currentIdx > 0) {
      setScreen(order[currentIdx - 1]);
      window.scrollTo(0, 0);
    }
  };

  const goTo = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  // ── File handlers ──

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFormData((p) => ({ ...p, logo: f }));
      setLogoPreview(URL.createObjectURL(f));
    }
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - formData.photos.length);
      const updated = [...formData.photos, ...files].slice(0, 5);
      setFormData((p) => ({ ...p, photos: updated }));
      setPhotoPreviews(updated.map((f) => URL.createObjectURL(f)));
    }
  };

  const removePhoto = (idx: number) => {
    const updated = formData.photos.filter((_, i) => i !== idx);
    setFormData((p) => ({ ...p, photos: updated }));
    setPhotoPreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleEntrepreneurPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFormData((p) => ({ ...p, entrepreneurPhoto: f }));
      setEntrepreneurPhotoPreview(URL.createObjectURL(f));
    }
  };

  const toggleService = (tag: string) => {
    setFormData((p) => ({
      ...p,
      serviceCategories: p.serviceCategories.includes(tag)
        ? p.serviceCategories.filter((t) => t !== tag)
        : [...p.serviceCategories, tag],
    }));
  };

  // ── Submit ──

  const handleActivate = async () => {
    setIsSubmitting(true);
    // TODO: wire to backend
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    alert("Your business has been activated! Welcome to ParishMart.");
    window.location.href = "/";
  };

  // ── Shared UI pieces ──

  const showHeader = !["wow", "transition"].includes(screen);
  const isImmersive = ["wow", "transition", "type"].includes(screen);

  const ProgressDots = () => {
    const dots = order.slice(2); // skip wow + transition
    const active = Math.max(0, currentIdx - 2);
    return (
      <div className="flex gap-1.5 justify-center mb-8">
        {dots.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i <= active ? "w-6 bg-[#006699]" : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const NavButtons = ({
    nextLabel = "Continue",
    onNext,
    hideBack,
    disabled,
  }: {
    nextLabel?: string;
    onNext?: () => void;
    hideBack?: boolean;
    disabled?: boolean;
  }) => (
    <div className="flex justify-between mt-10">
      {!hideBack ? (
        <Button type="button" onClick={back} variant="outline" className="border-[#006699] text-[#006699]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      ) : (
        <div />
      )}
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

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showHeader && (
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
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a2341]/95 via-[#1a2341]/80 to-[#1a2341]/40" />
            </div>
            <div className="absolute top-6 left-6 z-20">
              <img src={logo} alt="ParishMart" className="h-8 w-auto" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Do you want your business to create{" "}
                <span className="text-[#4DB8E0]">real impact</span> in your community?
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Turn every sale or service into direct support for your parish or cause.
              </p>
              <Button
                onClick={() => goTo("transition")}
                className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-10 py-4 text-lg h-auto rounded-xl shadow-xl"
              >
                Yes, I want to support and grow
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── SCREEN 1: TRANSITION ──────────────────────────────────────── */}
        {screen === "transition" && (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-white px-6">
            <div className="max-w-lg text-center">
              <div className="w-16 h-16 rounded-full bg-[#006699]/10 flex items-center justify-center mx-auto mb-8">
                <Check className="h-8 w-8 text-[#006699]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                We'll guide you step by step.
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                In less than <span className="font-semibold text-[#006699]">3 minutes</span> your
                business can be supporting a parish.
              </p>
              <Button
                onClick={() => goTo("type")}
                className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-10 py-4 text-lg h-auto rounded-xl"
              >
                Continue <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ── SCREEN 2: BUSINESS TYPE ───────────────────────────────────── */}
        {screen === "type" && (
          <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <div className="max-w-3xl w-full text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                What do you offer?
              </h2>
              <p className="text-gray-500 mb-12">Select what best describes your business</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Services */}
                <button
                  onClick={() => {
                    setFormData((p) => ({ ...p, businessType: "services" }));
                    goTo("profile");
                  }}
                  className="group border-2 border-gray-200 hover:border-[#006699] rounded-2xl p-8 text-left transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#006699]/10 flex items-center justify-center mb-4 group-hover:bg-[#006699]/20 transition-colors">
                    <Wrench className="h-6 w-6 text-[#006699]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#006699]">
                    Services
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Attorney, realtor, landscaping, fitness, consulting…
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-[#006699]">
                    I offer services <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </button>

                {/* Products */}
                <button
                  onClick={() => {
                    setFormData((p) => ({ ...p, businessType: "products" }));
                    goTo("profile");
                  }}
                  className="group border-2 border-gray-200 hover:border-[#006699] rounded-2xl p-8 text-left transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#006699]/10 flex items-center justify-center mb-4 group-hover:bg-[#006699]/20 transition-colors">
                    <ShoppingBag className="h-6 w-6 text-[#006699]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#006699]">
                    Products
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Store, e-commerce, merch, retail, handmade goods…
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-[#006699]">
                    I sell products <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SCREEN 3: PROFILE (shared) ────────────────────────────────── */}
        {screen === "profile" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <ProgressDots />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Share what you do
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Build your profile — this is what the community will see.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Business info */}
              <div className="space-y-5 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 text-lg">Your Business</h3>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Logo</Label>
                  <label className="block w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-white overflow-hidden">
                    <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                    {logoPreview ? (
                      <img src={logoPreview} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <Upload className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Business name</Label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => setFormData((p) => ({ ...p, businessName: e.target.value }))}
                    placeholder="Your business name"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Short description</Label>
                  <Textarea
                    value={formData.businessDescription}
                    onChange={(e) => setFormData((p) => ({ ...p, businessDescription: e.target.value }))}
                    placeholder="What does your business do? (2 lines max)"
                    maxLength={160}
                    className="h-20"
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{formData.businessDescription.length}/160</p>
                </div>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Photos ({formData.photos.length}/5)</Label>
                  <div className="flex gap-2 flex-wrap">
                    {photoPreviews.map((src, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {formData.photos.length < 5 && (
                      <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white flex items-center justify-center">
                        <input type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
                        <Upload className="h-4 w-4 text-gray-400" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Entrepreneur */}
              <div className="space-y-5 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 text-lg">About the Entrepreneur</h3>

                <div className="flex items-center gap-4">
                  <label className="block w-20 h-20 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:bg-white overflow-hidden flex-shrink-0">
                    <input type="file" accept="image/*" onChange={handleEntrepreneurPhoto} className="hidden" />
                    {entrepreneurPhotoPreview ? (
                      <img src={entrepreneurPhotoPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </label>
                  <div className="flex-1">
                    <Label className="block text-sm text-gray-600 mb-1">Your name</Label>
                    <Input
                      value={formData.entrepreneurName}
                      onChange={(e) => setFormData((p) => ({ ...p, entrepreneurName: e.target.value }))}
                      placeholder="Full name"
                      maxLength={80}
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm text-gray-600 mb-1">Mini bio</Label>
                  <Textarea
                    value={formData.entrepreneurBio}
                    onChange={(e) => setFormData((p) => ({ ...p, entrepreneurBio: e.target.value }))}
                    placeholder="Years of experience, certifications, what drives you…"
                    maxLength={300}
                    className="h-28"
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{formData.entrepreneurBio.length}/300</p>
                </div>
              </div>
            </div>

            <NavButtons />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            FLOW A — SERVICES
        ══════════════════════════════════════════════════════════════════ */}

        {/* ── 4A: SERVICES + PARISH ─────────────────────────────────────── */}
        {screen === "services" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <ProgressDots />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Services & Purpose
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Select your services and choose who you want to support.
            </p>

            {/* Service tags */}
            <div className="mb-10">
              <Label className="block text-sm font-medium text-gray-700 mb-3">What services do you offer?</Label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleService(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                      formData.serviceCategories.includes(tag)
                        ? "bg-[#006699] text-white border-[#006699]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {formData.serviceCategories.includes(tag) && <Check className="inline h-3.5 w-3.5 mr-1" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Parish / Cause selector */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-1">Who do you want to support?</h3>
              <p className="text-sm text-gray-500 mb-4">
                A portion of your membership goes directly to the parish or cause you choose.
              </p>
              <ParishSelector
                onSelect={(p) => setSelectedParish(p)}
                onManualEntry={() => {}}
                selectedParish={selectedParish}
                onClear={() => setSelectedParish(null)}
              />
            </div>

            <NavButtons />
          </div>
        )}

        {/* ── 5A: OFFER ─────────────────────────────────────────────────── */}
        {screen === "offer" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressDots />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Share a special benefit
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Recommended: offer a special discount for your community members. This is optional.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {DISCOUNT_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, discountPercent: d, customDiscount: "" }))}
                  className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center font-bold text-lg transition-all ${
                    formData.discountPercent === d
                      ? "bg-[#006699] text-white border-[#006699] shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {d}%
                  <span className="text-xs font-normal mt-1">off</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, discountPercent: "custom" }))}
                className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center font-bold transition-all ${
                  formData.discountPercent === "custom"
                    ? "bg-[#006699] text-white border-[#006699] shadow-lg"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                Custom
              </button>
            </div>

            {formData.discountPercent === "custom" && (
              <div className="max-w-xs mx-auto mb-6">
                <Input
                  value={formData.customDiscount}
                  onChange={(e) => setFormData((p) => ({ ...p, customDiscount: e.target.value }))}
                  placeholder="Enter discount %"
                  maxLength={5}
                  className="text-center text-lg"
                />
              </div>
            )}

            <p className="text-center text-sm text-gray-400">
              You can skip this and set it later from your dashboard.
            </p>

            <NavButtons />
          </div>
        )}

        {/* ── 6A: CONTACT METHOD ────────────────────────────────────────── */}
        {screen === "contact" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressDots />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              How should people reach you?
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Choose the main call to action for your profile.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, contactMethod: "info" }))}
                className={`p-6 rounded-2xl border-2 text-center transition-all ${
                  formData.contactMethod === "info"
                    ? "border-[#006699] bg-[#006699]/5 shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  formData.contactMethod === "info" ? "bg-[#006699]/15" : "bg-gray-100"
                }`}>
                  <MessageSquare className={`h-6 w-6 ${formData.contactMethod === "info" ? "text-[#006699]" : "text-gray-400"}`} />
                </div>
                <h4 className="font-semibold text-gray-900">More Information</h4>
                <p className="text-xs text-gray-500 mt-1">People can request details</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, contactMethod: "book" }))}
                className={`p-6 rounded-2xl border-2 text-center transition-all ${
                  formData.contactMethod === "book"
                    ? "border-[#006699] bg-[#006699]/5 shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  formData.contactMethod === "book" ? "bg-[#006699]/15" : "bg-gray-100"
                }`}>
                  <Calendar className={`h-6 w-6 ${formData.contactMethod === "book" ? "text-[#006699]" : "text-gray-400"}`} />
                </div>
                <h4 className="font-semibold text-gray-900">Book Now</h4>
                <p className="text-xs text-gray-500 mt-1">Direct booking or scheduling</p>
              </button>
            </div>

            {formData.contactMethod && (
              <div className="max-w-lg mx-auto">
                <Label className="block text-sm text-gray-600 mb-1">
                  {formData.contactMethod === "book" ? "Booking URL (Calendly, website, etc.)" : "Contact URL or link"}
                </Label>
                <Input
                  value={formData.contactUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, contactUrl: e.target.value }))}
                  placeholder="https://..."
                  maxLength={500}
                />
              </div>
            )}

            <NavButtons />
          </div>
        )}

        {/* ── 7A: PRICING + ACTIVATE ────────────────────────────────────── */}
        {screen === "pricing-a" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressDots />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Activate your business
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Join as a Supporter Member and start generating impact today.
            </p>

            <div className="bg-gradient-to-br from-[#006699] to-[#004d73] rounded-3xl p-8 text-white text-center mb-8 shadow-xl">
              <p className="text-sm uppercase tracking-wider text-white/70 mb-2">Supporter Member</p>
              <p className="text-5xl font-bold mb-1">$150</p>
              <p className="text-white/70 mb-6">per month</p>

              <div className="bg-white/10 rounded-2xl p-5 mb-6 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-4 w-4 text-[#45b1e1]" />
                  </div>
                  <p className="text-sm"><span className="font-semibold">$75</span> goes directly to your chosen parish or cause</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-[#45b1e1]" />
                  </div>
                  <p className="text-sm">No commissions on your services</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="h-4 w-4 text-[#45b1e1]" />
                  </div>
                  <p className="text-sm">Featured in the parish community marketplace</p>
                </div>
              </div>

              {selectedParish && (
                <p className="text-sm text-white/80">
                  Supporting: <span className="font-semibold text-white">{selectedParish.name}</span>
                </p>
              )}
            </div>

            <Button
              onClick={handleActivate}
              disabled={isSubmitting}
              className="w-full bg-[#006699] hover:bg-[#005588] text-white font-semibold py-4 text-lg h-auto rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? "Activating…" : "Activate my business"}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>

            <div className="mt-6">
              <NavButtons nextLabel="" hideBack={false} onNext={() => {}} disabled />
              <button type="button" onClick={back} className="text-sm text-gray-500 hover:text-gray-700 mt-2 block mx-auto">
                ← Go back
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            FLOW B — PRODUCTS
        ══════════════════════════════════════════════════════════════════ */}

        {/* ── 4B: CATALOG METHOD ────────────────────────────────────────── */}
        {screen === "catalog" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <ProgressDots />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              How would you like to share your products?
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Choose the easiest way to get your catalog on ParishMart.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATALOG_METHODS.map((m) => {
                const Icon = m.Icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, catalogMethod: m.id }))}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${
                      formData.catalogMethod === m.id
                        ? "border-[#006699] bg-[#006699]/5 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      formData.catalogMethod === m.id ? "bg-[#006699]/15" : "bg-gray-100"
                    }`}>
                      <Icon className={`h-5 w-5 ${formData.catalogMethod === m.id ? "text-[#006699]" : "text-gray-500"}`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{m.label}</h4>
                  </button>
                );
              })}
            </div>

            <NavButtons />
          </div>
        )}

        {/* ── 5B: PARISH SELECTION ──────────────────────────────────────── */}
        {screen === "parish-b" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <ProgressDots />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Who do you want to support?
            </h2>
            <p className="text-gray-500 text-center mb-10">
              A portion of every sale goes directly to the parish or cause you choose.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <ParishSelector
                onSelect={(p) => setSelectedParish(p)}
                onManualEntry={() => {}}
                selectedParish={selectedParish}
                onClear={() => setSelectedParish(null)}
              />
            </div>

            <NavButtons />
          </div>
        )}

        {/* ── 6B: PRICING MODEL ─────────────────────────────────────────── */}
        {screen === "pricing-b" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressDots />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              Transparent model
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Simple pricing — no hidden fees.
            </p>

            <div className="bg-gradient-to-br from-[#006699] to-[#004d73] rounded-3xl p-8 text-white text-center mb-8 shadow-xl">
              <p className="text-sm uppercase tracking-wider text-white/70 mb-2">Seller Supporter</p>
              <p className="text-5xl font-bold mb-1">$50</p>
              <p className="text-white/70 mb-6">per month</p>

              <div className="bg-white/10 rounded-2xl p-5 text-left space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-3">20% per transaction</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Heart className="h-3.5 w-3.5 text-[#45b1e1] flex-shrink-0" />
                      <span>10% → Your chosen parish or cause</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Settings className="h-3.5 w-3.5 text-[#45b1e1] flex-shrink-0" />
                      <span>10% → Platform operations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <CreditCard className="h-3.5 w-3.5 text-[#45b1e1] flex-shrink-0" />
                      <span>~5% → Stripe / payment fees</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedParish && (
                <p className="text-sm text-white/80 mt-5">
                  Supporting: <span className="font-semibold text-white">{selectedParish.name}</span>
                </p>
              )}
            </div>

            <NavButtons nextLabel="Continue to activation" />
          </div>
        )}

        {/* ── 7B: ACTIVATE ──────────────────────────────────────────────── */}
        {screen === "activate-b" && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <ProgressDots />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
              You're ready!
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Publish your store and start selling with purpose.
            </p>

            {/* Summary */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 space-y-3">
              <div className="flex items-center gap-3">
                {logoPreview ? (
                  <img src={logoPreview} alt="" className="w-12 h-12 rounded-lg object-contain border border-gray-200" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">Logo</div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{formData.businessName || "Your Business"}</p>
                  <p className="text-sm text-gray-500">{formData.businessDescription || "Product store"}</p>
                </div>
              </div>
              {selectedParish && (
                <p className="text-sm text-gray-600">
                  Supporting: <span className="font-semibold">{selectedParish.name}</span>
                </p>
              )}
              <p className="text-sm text-gray-600">
                Catalog: <span className="font-semibold">{CATALOG_METHODS.find((m) => m.id === formData.catalogMethod)?.label || "Not selected"}</span>
              </p>
              <p className="text-sm text-gray-600">
                Plan: <span className="font-semibold">$50/mo + 20% per transaction</span>
              </p>
            </div>

            <Button
              onClick={handleActivate}
              disabled={isSubmitting}
              className="w-full bg-[#006699] hover:bg-[#005588] text-white font-semibold py-4 text-lg h-auto rounded-xl disabled:opacity-50"
            >
              {isSubmitting ? "Publishing…" : "Publish my store and start selling"}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>

            <button type="button" onClick={back} className="text-sm text-gray-500 hover:text-gray-700 mt-4 block mx-auto">
              ← Go back
            </button>
          </div>
        )}
      </div>

      {!isImmersive && <Footer />}
    </div>
  );
};

export default BusinessActivation;
