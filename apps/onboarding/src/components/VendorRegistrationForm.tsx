import React, { useState, useEffect } from "react";
import { apiUrl } from '@/lib/api';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Upload,
  ArrowRight,
  Info,
  Check,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import ExternalLocationSelector, { type LocationValue } from "./ExternalLocationSelector";

interface ExternalStore {
  id: number;
  name: string;
  tipo: number;
}

interface MarketplacePlan {
  name: string;
  slug: string;
  description: string;
}

const VENDOR_PLAN_MAP: Record<string, string> = {
  tier1: 'basic',
  tier2: 'commerce',
  tier3: 'featured-partner',
};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  parishAffiliation: string;
  ownerDescription: string;
  communityEfforts: string;
  businessName: string;
  businessType: "product" | "service" | "both";
  businessDescription: string;
  businessPolicy: string;
  businessAddress: string;
  businessCity: string;
  businessLocation: {
    country: string;
    subdivision: string;
  };
  businessZipCode: string;
  logo: File | null;
  websiteLinks: string;
  subscriptionType: "free" | "tier1" | "tier2" | "tier3";
  contactEmail: string;
  contactPhone: string;
  participateInCampaigns: boolean;

  reach: "local" | "regional" | "national" | "global" | "";
  logoHasTransparentBg: boolean;
  billingCycle: "monthly" | "annual";
  subscriptionAmount: number;
}

const VendorRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    parishAffiliation: "",
    ownerDescription: "",
    communityEfforts: "",
    businessName: "",
    businessType: "product",
    businessDescription: "",
    businessPolicy: "",
    businessAddress: "",
    businessCity: "",
    businessLocation: {
      country: "",
      subdivision: "",
    },
    businessZipCode: "",
    logo: null,
    websiteLinks: "",
    subscriptionType: "tier1",
    contactEmail: "",
    contactPhone: "",
    participateInCampaigns: true,

    reach: "",
    logoHasTransparentBg: false,
    billingCycle: "monthly",
    subscriptionAmount: 39,
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [step, setStep] = useState(1);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [attemptedSteps, setAttemptedSteps] = useState<number[]>([]);
  const [parishSearch, setParishSearch] = useState("");
  const [customParish, setCustomParish] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [externalStores, setExternalStores] = useState<ExternalStore[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [storesError, setStoresError] = useState<string | null>(null);
  const [externalMissionStoreId, setExternalMissionStoreId] = useState<number | undefined>(undefined);
  const [externalLocation, setExternalLocation] = useState<LocationValue>({
    countryName: '', stateName: '', cityName: '',
    countryId: undefined, stateId: undefined, cityId: undefined,
  });
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [zipCodeError, setZipCodeError] = useState<string>("");
  const [vendorPlans, setVendorPlans] = useState<MarketplacePlan[]>([]);

  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [bannerMode, setBannerMode] = useState<"full" | "collage">("full");
  const [bannerImages, setBannerImages] = useState<File[]>([]);
  const [bannerImagesPreviews, setBannerImagesPreviews] = useState<string[]>([]);
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [cardImagePreview, setCardImagePreview] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowAnnouncement(true);
      } else {
        setShowAnnouncement(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch stores from external marketplace API (parishes + causes)
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setStoresLoading(true);
        setStoresError(null);
        const response = await fetch(apiUrl('/api/external-data/stores'));
        const data = await response.json();
        if (data.success) {
          setExternalStores(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch stores');
        }
      } catch (error) {
        console.error('❌ Error fetching stores:', error);
        setStoresError(error instanceof Error ? error.message : 'Failed to load stores');
      } finally {
        setStoresLoading(false);
      }
    };
    fetchStores();
  }, []);

  // Fetch vendor membership plans from external API
  useEffect(() => {
    fetch(apiUrl('/api/external-data/membership-plans?type=vendor'))
      .then(r => r.json())
      .then(data => { if (data.success) setVendorPlans(data.data || []); })
      .catch(err => console.error('Failed to load vendor plans:', err));
  }, []);

  const vendorPlanBySlug = (slug: string) => vendorPlans.find(p => p.slug === slug);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Phone validation function
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-().]/g, "");
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(cleaned);
  };

  // Zip code validation function
  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Email validation
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }

    // Phone validation
    if (name === 'phone') {
      if (value && !validatePhone(value)) {
        setPhoneError('Please enter a valid phone number');
      } else {
        setPhoneError('');
      }
    }

    // Zip code validation
    if (name === 'businessZipCode') {
      if (value && !validateZipCode(value)) {
        setZipCodeError('Please enter a valid ZIP code (e.g. 12345 or 12345-6789)');
      } else {
        setZipCodeError('');
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = bannerImages.length + files.length;
      if (totalImages > 5) {
        alert("You can upload a maximum of 5 images.");
        return;
      }
      const newImages = [...bannerImages, ...files];
      setBannerImages(newImages);
      setBannerImagesPreviews(newImages.map((f) => URL.createObjectURL(f)));
    }
  };

  const removeBannerImage = (index: number) => {
    const newImages = bannerImages.filter((_, i) => i !== index);
    setBannerImages(newImages);
    setBannerImagesPreviews(newImages.map((f) => URL.createObjectURL(f)));
  };

  const handleRadioChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle subscription type change
  const handleSubscriptionChange = (type: "free" | "tier1" | "tier2" | "tier3") => {
    setFormData({
      ...formData,
      subscriptionType: type,
    });
  };

  const VENDOR_PRICES: Record<string, { monthly: number; annual: number }> = {
    free:  { monthly: 0,  annual: 0   },
    tier1: { monthly: 39, annual: 390 },
    tier2: { monthly: 79, annual: 790 },
    tier3: { monthly: 99, annual: 989 },
  };

  useEffect(() => {
    const prices = VENDOR_PRICES[formData.subscriptionType];
    setFormData(prev => ({
      ...prev,
      billingCycle: isAnnual ? 'annual' : 'monthly',
      subscriptionAmount: isAnnual ? prices.annual : prices.monthly,
    }));
  }, [isAnnual, formData.subscriptionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all steps as attempted for validation
    setAttemptedSteps([1, 2, 3, 4]);

    // Validate all required fields before submission
    const bannerValid = bannerMode === "full" ? !!banner : bannerImages.length >= 3;
    // Card image required when full banner uploaded (can't auto-pick from collage images)
    const cardImageValid = bannerMode === "collage" || !!cardImage;
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.businessName ||
      !formData.businessDescription ||
      !formData.logo ||
      !bannerValid ||
      !cardImageValid ||
      !formData.reach ||
      !formData.businessAddress ||
      !externalLocation.countryId ||
      !externalLocation.stateId ||
      !externalLocation.cityId ||
      !formData.businessZipCode
    ) {
      setToastMessage("Please fill in all required fields before submitting");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add registration type
      submitData.append('registrationType', 'vendor');
      
      // Handle parish affiliation
      submitData.append('parishAffiliation', formData.parishAffiliation || "");

      // External location IDs
      if (externalLocation.countryId)      submitData.append('externalCountryId',      String(externalLocation.countryId));
      if (externalLocation.stateId)        submitData.append('externalStateId',        String(externalLocation.stateId));
      if (externalLocation.cityId)         submitData.append('externalCityId',         String(externalLocation.cityId));
      if (externalMissionStoreId)          submitData.append('externalMissionStoreId', String(externalMissionStoreId));
      
      // Add all form fields (except those handled separately below)
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'parishAffiliation' || key === 'contactEmail' || key === 'contactPhone') {
          // Skip - handled separately (parishAffiliation above, contactEmail/contactPhone below with fallback logic)
          return;
        } else if (key === 'logo' && value) {
          submitData.append('logo', value);
        } else if (key === 'businessLocation' && value && typeof value === 'object') {
          // Handle businessLocation object
          submitData.append('businessLocation', JSON.stringify(value));
        } else if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
          submitData.append(key, value.toString());
        }
      });
      
      // Add banner image(s)
      submitData.append('bannerMode', bannerMode);
      if (bannerMode === "full" && banner) {
        submitData.append('banner', banner);
      } else if (bannerMode === "collage") {
        bannerImages.forEach((img) => {
          submitData.append('bannerImages', img);
        });
      }

      // Card image: explicit upload if provided; collage mode will use first banner image server-side
      if (cardImage) {
        submitData.append('cardImage', cardImage);
      }

      // Add business contact info (use personal info if business contact not provided)
      submitData.append('contactEmail', formData.contactEmail || formData.email);
      submitData.append('contactPhone', formData.contactPhone || formData.phone);

      // Terms acceptance (stored separately from formData state)
      submitData.append('termsAccepted', acceptedTerms.toString());

      // Send form data to API endpoint
      const response = await fetch(apiUrl('/api/registration'), {
        method: 'POST',
        body: submitData, // Don't set Content-Type header for FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      console.log("Form submitted successfully:", data);
      alert("Registration successful! Your vendor account is being set up. You will receive updates of your account status via email.");
      // Redirect to home or dashboard
      window.location.href = "/";
    } catch (error) {
      console.error('Error submitting form:', error);
      setToastMessage(error instanceof Error ? error.message : "There was an error submitting your registration. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Mark this step as attempted
    if (!attemptedSteps.includes(step)) {
      setAttemptedSteps([...attemptedSteps, step]);
    }

    // Validate current step before proceeding
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setToastMessage("Please fill in all required fields");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
      // Email format validation
      if (formData.email && !validateEmail(formData.email)) {
        setEmailError('Please enter a valid email address');
        setToastMessage("Please enter a valid email address");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
      // Phone format validation
      if (formData.phone && !validatePhone(formData.phone)) {
        setPhoneError('Please enter a valid phone number');
        setToastMessage("Please enter a valid phone number");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    } else if (step === 3) {
      const bannerValid = bannerMode === "full" ? !!banner : bannerImages.length >= 3;
      const cardImageValid = bannerMode === "collage" || !!cardImage;
      if (
        !formData.businessName ||
        !formData.businessDescription ||
        !formData.logo ||
        !bannerValid ||
        !cardImageValid ||
        !formData.reach ||
        !formData.businessAddress ||
        !externalLocation.countryId ||
        !externalLocation.stateId ||
        !externalLocation.cityId ||
        !formData.businessZipCode
      ) {
        setToastMessage("Please fill in all required fields, upload a logo, and upload a banner");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
      // Zip code format validation
      if (formData.businessZipCode && !validateZipCode(formData.businessZipCode)) {
        setZipCodeError('Please enter a valid ZIP code (e.g. 12345 or 12345-6789)');
        setToastMessage("Please enter a valid ZIP code");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-white">
        {/* Announcement Strip (above header, only at top, slides up on scroll) */}
        <div
          className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${showAnnouncement ? "translate-y-0" : "-translate-y-full"}`}
          style={{ willChange: "transform 0.3s" }}
        >
          <AnnouncementStrip />
        </div>
        {/* Header (sticky/locked, below announcement strip when visible) */}
        <div
          className="sticky top-10 left-0 w-full z-40 bg-white transition-all duration-300 ease-in-out"
          style={{ top: showAnnouncement ? 40 : 0 }}
        >
          <Header />
        </div>
        <div className="pt-14 pb-16 relative z-10">
          <div className={`${step === 1 ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-[#006699]">
                Vendor Registration
              </h1>
              <p className="text-lg text-gray-600">
                Join our marketplace and start selling your products or services
                to our community
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex justify-between items-center">
                <div
                  className={`flex flex-col items-center ${step >= 1 ? "text-[#006699]" : "text-gray-400"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#006699] text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    1
                  </div>
                  <span className="mt-2 text-sm font-medium">
                    Subscriptions
                  </span>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${step >= 2 ? "bg-[#006699]" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`flex flex-col items-center ${step >= 2 ? "text-[#006699]" : "text-gray-400"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#006699] text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    2
                  </div>
                  <span className="mt-2 text-sm font-medium">
                    Personal Info
                  </span>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${step >= 3 ? "bg-[#006699]" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`flex flex-col items-center ${step >= 3 ? "text-[#006699]" : "text-gray-400"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-[#006699] text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    3
                  </div>
                  <span className="mt-2 text-sm font-medium">
                    Business Info
                  </span>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${step >= 4 ? "bg-[#006699]" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`flex flex-col items-center ${step >= 4 ? "text-[#006699]" : "text-gray-400"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? "bg-[#006699] text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    4
                  </div>
                  <span className="mt-2 text-sm font-medium">Submission</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 2: Personal Information */}
              {step === 2 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        maxLength={250}
                        className={`w-full ${!formData.firstName && attemptedSteps.includes(step) && "border-red-300"}`}
                      />
                      {!formData.firstName && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          First name is required
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        maxLength={250}
                        className={`w-full ${!formData.lastName && attemptedSteps.includes(step) && "border-red-300"}`}
                      />
                      {!formData.lastName && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          Last name is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        maxLength={250}
                        className={`w-full ${(!formData.email && attemptedSteps.includes(step)) || emailError ? "border-red-300" : ""}`}
                      />
                      {!formData.email && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          Email is required
                        </p>
                      )}
                      {emailError && (
                        <p className="mt-1 text-sm text-red-600">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        maxLength={20}
                        placeholder="e.g. +1 (555) 123-4567"
                        className={`w-full ${(!formData.phone && attemptedSteps.includes(step)) || phoneError ? "border-red-300" : ""}`}
                      />
                      {!formData.phone && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          Phone number is required
                        </p>
                      )}
                      {phoneError && (
                        <p className="mt-1 text-sm text-red-600">
                          {phoneError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-1">
                      
                    </div>
                    <Label
                      htmlFor="parishAffiliation"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select a Mission to Support
                    </Label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-left"
                        onClick={() => setDropdownOpen((open) => !open)}
                      >
                        {formData.parishAffiliation || "Select a parish or cause (optional)"}
                      </button>
                      {dropdownOpen && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                          <input
                            type="text"
                            className="w-full px-3 py-2 border-b border-gray-200"
                            placeholder="Type to filter..."
                            value={parishSearch}
                            onChange={e => setParishSearch(e.target.value)}
                            autoFocus
                          />
                          <div className="max-h-48 overflow-y-auto">
                            {storesLoading ? (
                              <div className="px-3 py-2 text-gray-500">Loading stores...</div>
                            ) : storesError ? (
                              <div className="px-3 py-2 text-red-500">Error loading stores</div>
                            ) : (
                              externalStores
                                .filter(store => store.name.toLowerCase().includes(parishSearch.toLowerCase()))
                                .map(store => (
                                  <div
                                    key={store.id}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                      setFormData({ ...formData, parishAffiliation: store.name });
                                      setExternalMissionStoreId(store.id);
                                      setDropdownOpen(false);
                                      setParishSearch("");
                                    }}
                                  >
                                    {store.name}
                                  </div>
                                ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      A percentage of your sales will be donated to your
                      selected mission (Parish, Church, or Cause)
                    </p>
                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="ownerDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      About you as a business owner
                    </Label>
                    <Textarea
                      id="ownerDescription"
                      name="ownerDescription"
                      value={formData.ownerDescription}
                      onChange={handleInputChange}
                      className="w-full mb-3"
                      maxLength={250}
                      placeholder="Tell us about yourself as a business owner..."
                    />
                  </div>

                  
                  <div className="mb-6">
                    <Label
                      htmlFor="communityEfforts"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Community efforts or causes you'd like to highlight
                    </Label>
                    <Textarea
                      id="communityEfforts"
                      name="communityEfforts"
                      value={formData.communityEfforts}
                      onChange={handleInputChange}
                      className="w-full"
                      maxLength={250}
                      placeholder="Share any community efforts or causes..."
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="border-[#006699] text-[#006699]"
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#006699] hover:bg-[#005588] text-white"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Business Information */}
              {step === 3 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Business Information
                  </h2>

                  {/* Business Name — full width */}
                  <div className="mb-6">
                    <Label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      maxLength={250}
                      className={`w-full ${!formData.businessName && attemptedSteps.includes(step) && "border-red-300"}`}
                    />
                    {!formData.businessName && attemptedSteps.includes(step) && (
                      <p className="mt-1 text-sm text-red-600">Business name is required</p>
                    )}
                  </div>

                  {/* Description + Policy | Business Type + Reach — 2 col */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {/* Left: Description + Policy */}
                    <div>
                      <div className="mb-4">
                        <Label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Business Description *
                        </Label>
                        <Textarea
                          id="businessDescription"
                          name="businessDescription"
                          value={formData.businessDescription}
                          onChange={handleInputChange}
                          required
                          maxLength={1000}
                          className={`w-full h-40 ${!formData.businessDescription && attemptedSteps.includes(step) && "border-red-300"}`}
                          placeholder="Describe your business in detail..."
                        />
                        <div className="flex justify-between items-center mt-1">
                          {!formData.businessDescription && attemptedSteps.includes(step) && (
                            <p className="text-sm text-red-600">Business description is required</p>
                          )}
                          <p className="text-xs text-gray-400 ml-auto">{formData.businessDescription.length}/1000</p>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="businessPolicy" className="block text-sm font-medium text-gray-700 mb-1">
                          Business Policy
                        </Label>
                        <Textarea
                          id="businessPolicy"
                          name="businessPolicy"
                          value={formData.businessPolicy}
                          onChange={handleInputChange}
                          maxLength={500}
                          className="w-full h-28"
                          placeholder="Describe your business policies regarding returns, shipping, etc..."
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{formData.businessPolicy.length}/500</p>
                      </div>
                    </div>

                    {/* Right: Business Type + Reach */}
                    <div>
                      <div className="mb-6">
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          What does your business offer? *
                        </Label>
                        <RadioGroup
                          value={formData.businessType}
                          onValueChange={(value) => handleRadioChange("businessType", value)}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="product" id="product" />
                            <Label htmlFor="product" className="cursor-pointer">
                              Product Seller – (Sells physical products)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="service" id="service" />
                            <Label htmlFor="service" className="cursor-pointer">
                              Service Provider – (Offers services from handymen, realtors, lawyers, etc.)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both" className="cursor-pointer">
                              Both – (Sells products and provides services)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Where do you offer your products or services? <span className="text-red-500">*</span>
                        </Label>
                        <p className="text-xs text-gray-600 mb-2 italic">
                          Select the option that best describes your current reach:
                        </p>
                        <RadioGroup
                          value={formData.reach}
                          onValueChange={(value) => setFormData({ ...formData, reach: value as FormData['reach'] })}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="local" id="reach-local" />
                            <Label htmlFor="reach-local" className="cursor-pointer font-semibold">Local</Label>
                            <span className="text-xs text-gray-600 ml-2">You serve a specific town or city.</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="regional" id="reach-regional" />
                            <Label htmlFor="reach-regional" className="cursor-pointer font-semibold">Regional</Label>
                            <span className="text-xs text-gray-600 ml-2">You operate across a broader area within your neighboring areas or state.</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="national" id="reach-national" />
                            <Label htmlFor="reach-national" className="cursor-pointer font-semibold">National</Label>
                            <span className="text-xs text-gray-600 ml-2">You serve customers across the United States.</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="global" id="reach-global" />
                            <Label htmlFor="reach-global" className="cursor-pointer font-semibold">Global</Label>
                            <span className="text-xs text-gray-600 ml-2">You offer your products or services internationally.</span>
                          </div>
                        </RadioGroup>
                        {!formData.reach && attemptedSteps.includes(step) && (
                          <p className="mt-1 text-sm text-red-600">Please select where you offer your products or services</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address + Location — 2 col */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 pt-6 border-t border-gray-100">
                    <div>
                      <Label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Address *
                      </Label>
                      <Input
                        id="businessAddress"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                        required
                        maxLength={250}
                        className={`w-full mb-4 ${!formData.businessAddress && attemptedSteps.includes(step) && "border-red-300"}`}
                        placeholder="Street address, P.O. box"
                      />
                      {!formData.businessAddress && attemptedSteps.includes(step) && (
                        <p className="mb-4 text-sm text-red-600">Business address is required</p>
                      )}
                      <Label htmlFor="businessZipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP/Postal Code *
                      </Label>
                      <Input
                        id="businessZipCode"
                        name="businessZipCode"
                        value={formData.businessZipCode}
                        onChange={handleInputChange}
                        required
                        maxLength={10}
                        className={`w-full ${(!formData.businessZipCode && attemptedSteps.includes(step)) || zipCodeError ? "border-red-300" : ""}`}
                        placeholder="e.g. 12345 or 12345-6789"
                        pattern="[0-9\-]*"
                        title="Please enter a valid ZIP code"
                      />
                      {!formData.businessZipCode && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">ZIP/Postal code is required</p>
                      )}
                      {zipCodeError && (
                        <p className="mt-1 text-sm text-red-600">{zipCodeError}</p>
                      )}
                    </div>
                    <div>
                      <ExternalLocationSelector
                        value={externalLocation}
                        onChange={(loc) => {
                          setExternalLocation(loc);
                          setFormData(prev => ({
                            ...prev,
                            businessCity: loc.cityName,
                            businessLocation: { country: loc.countryName, subdivision: loc.stateName },
                          }));
                        }}
                        countryError={!externalLocation.countryId && attemptedSteps.includes(step)}
                        stateError={!externalLocation.stateId && attemptedSteps.includes(step)}
                        cityError={!externalLocation.cityId && attemptedSteps.includes(step)}
                        showErrors={attemptedSteps.includes(step)}
                      />
                    </div>
                  </div>

                  {/* Logo + Banner side by side */}
                  <div className="flex flex-col md:flex-row gap-8 mb-8">

                    {/* Logo Upload */}
                    <div className="flex-shrink-0">
                      <span className="block text-sm font-medium text-gray-700 mb-2">Upload Logo *</span>
                      <div className="flex flex-col items-center w-44">
                        <div className={`w-44 h-44 border-2 border-dashed ${!formData.logo && attemptedSteps.includes(step) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-2`}>
                          <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                          <label htmlFor="logo" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                            ) : (
                              <>
                                <Upload className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
                                <span className="text-xs text-gray-500">Click to upload your logo</span>
                                <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                              </>
                            )}
                          </label>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Ideal size: 230x340 px</div>
                        {!formData.logo && attemptedSteps.includes(step) && (
                          <p className="mt-1 text-xs text-red-500">Logo is required</p>
                        )}
                      </div>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.logoHasTransparentBg}
                          onChange={(e) => setFormData(prev => ({ ...prev, logoHasTransparentBg: e.target.checked }))}
                          className="w-4 h-4 accent-[#006699]"
                        />
                        <span className="text-xs text-gray-600">Logo already has transparent background</span>
                      </label>
                    </div>

                    {/* Banner Upload */}
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-gray-700 mb-2">Upload Business Banner *</span>

                      {/* Toggle */}
                      <div className="flex items-center gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setBannerMode("full")}
                          className={`px-4 py-2 text-sm rounded-l-md border transition-colors ${bannerMode === "full" ? "bg-[#006699] text-white border-[#006699]" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                          Full Banner
                        </button>
                        <button
                          type="button"
                          onClick={() => setBannerMode("collage")}
                          className={`px-4 py-2 text-sm rounded-r-md border transition-colors ${bannerMode === "collage" ? "bg-[#006699] text-white border-[#006699]" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                        >
                          Image Collage
                        </button>
                      </div>

                      {bannerMode === "full" ? (
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Upload a single pre-made banner image for your storefront.</p>
                          <div className="flex flex-col items-start">
                            <div className={`w-full h-44 border-2 border-dashed ${!banner && attemptedSteps.includes(step) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-2`}>
                              <input
                                type="file"
                                id="vendor-banner-image"
                                accept="image/*"
                                onChange={handleBannerChange}
                                className="hidden"
                              />
                              <label htmlFor="vendor-banner-image" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                                {bannerPreview ? (
                                  <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <>
                                    <Upload className="h-5 w-8 text-gray-400 mb-2 mx-auto" />
                                    <span className="text-xs text-gray-500">Banner Image</span>
                                    <span className="text-xs text-gray-400">PNG, JPG, GIF</span>
                                  </>
                                )}
                              </label>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Ideal size: 1498x337 px</div>
                            {!banner && attemptedSteps.includes(step) && (
                              <p className="mt-1 text-xs text-red-500">Banner image is required</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Upload 3 to 5 images in the same order you would like them displayed and we'll create a collage banner for your storefront.</p>
                          <div className="grid grid-cols-5 gap-3">
                            {Array.from({ length: Math.max(3, bannerImages.length + (bannerImages.length < 5 ? 1 : 0)) }).map((_, index) => {
                              if (index < bannerImages.length) {
                                return (
                                  <div key={index} className="relative w-full aspect-square">
                                    <img src={bannerImagesPreviews[index]} alt={`Banner image ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                                    <button
                                      type="button"
                                      onClick={() => removeBannerImage(index)}
                                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                    >
                                      ×
                                    </button>
                                  </div>
                                );
                              }
                              if (index === bannerImages.length && bannerImages.length < 5) {
                                return (
                                  <div key={index} className={`w-full aspect-square border-2 border-dashed ${bannerImages.length < 3 && attemptedSteps.includes(step) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}>
                                    <input
                                      type="file"
                                      id="banner-collage-images"
                                      accept="image/*"
                                      multiple
                                      onChange={handleBannerImagesChange}
                                      className="hidden"
                                    />
                                    <label htmlFor="banner-collage-images" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                                      <span className="text-xs text-gray-500">Add</span>
                                    </label>
                                  </div>
                                );
                              }
                              return (
                                <div key={index} className={`w-full aspect-square border-2 border-dashed ${bannerImages.length < 3 && attemptedSteps.includes(step) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center`}>
                                  <span className="text-xs text-gray-400">{index + 1}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">{bannerImages.length}/5 images uploaded (minimum 3)</div>
                          {bannerImages.length < 3 && attemptedSteps.includes(step) && (
                            <p className="mt-1 text-xs text-red-500">Please upload at least 3 images</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Image Upload */}
                  <div className="mb-6">
                    <span className="block text-sm font-medium text-gray-700 mb-1">
                      Marketplace Card Image {bannerMode === "full" ? "*" : <span className="text-gray-400 font-normal">(optional)</span>}
                    </span>
                    <p className="text-xs text-gray-500 mb-3">
                      This image appears as the thumbnail on your vendor card in the ParishMart marketplace directory — the first thing shoppers see when browsing.
                      {bannerMode === "collage"
                        ? " If you don't upload one, the first image from your banner collage will be used automatically."
                        : " Required when uploading a full banner (since we can't automatically extract a thumbnail from it)."}
                    </p>
                    <div className={`w-44 h-44 border-2 border-dashed ${bannerMode === "full" && !cardImage && attemptedSteps.includes(step) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden`}>
                      <input
                        type="file"
                        id="card-image"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCardImage(file);
                            setCardImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <label htmlFor="card-image" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                        {cardImagePreview ? (
                          <img src={cardImagePreview} alt="Card image preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload className="h-6 w-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Click to upload</span>
                            <span className="text-xs text-gray-400 mt-1">800×800px, 1:1</span>
                          </>
                        )}
                      </label>
                    </div>
                    {cardImage && (
                      <button
                        type="button"
                        onClick={() => { setCardImage(null); setCardImagePreview(""); }}
                        className="mt-2 text-xs text-red-500 hover:text-red-700"
                      >
                        Remove card image
                      </button>
                    )}
                    {bannerMode === "full" && !cardImage && attemptedSteps.includes(step) && (
                      <p className="mt-1 text-xs text-red-500">Card image is required when uploading a full banner</p>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="border-[#006699] text-[#006699]"
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#006699] hover:bg-[#005588] text-white"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1: Subscription Selection */}
              {step === 1 && (
                <div className="mb-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Grow Your Business with ParishMart
                    </h2>
                    <p className="text-gray-600">Choose the plan that fits your business needs</p>

                    {/* Monthly/Annual Toggle */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                      <button
                        type="button"
                        onClick={() => setIsAnnual(!isAnnual)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAnnual ? 'bg-[#006699]' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Annual <span className="text-green-600 text-xs font-semibold">(Save ~17%)</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* Subscription Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                      {/* Free — Start Here */}
                      <div
                        className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all bg-white ${formData.subscriptionType === "free" ? "border-[#006699] shadow-lg" : "border-gray-200 hover:border-gray-300"}`}
                        onClick={() => handleSubscriptionChange("free")}
                      >
                        {formData.subscriptionType === "free" && (
                          <div className="absolute top-3 right-3 bg-[#006699] rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                          START HERE
                        </div>
                        <div className="mb-4">
                          <p className="text-3xl font-bold text-gray-900">
                            $0<span className="text-base font-normal text-gray-500">/month</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Free forever</p>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Your own vendor page on ParishMart</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Business description & your story</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Contact CTA so customers can reach you</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Listed in ParishMart Directory</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Community exposure as ParishMart grows</span>
                          </li>
                        </ul>
                        <p className="text-xs text-gray-400 mt-4">No credit card required</p>
                      </div>

                      {/* Local */}
                      <div
                        className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all bg-white ${formData.subscriptionType === "tier1" ? "border-[#006699] shadow-lg" : "border-gray-200 hover:border-gray-300"}`}
                        onClick={() => handleSubscriptionChange("tier1")}
                      >
                        {formData.subscriptionType === "tier1" && (
                          <div className="absolute top-3 right-3 bg-[#006699] rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                          GROWING EXPOSURE
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {vendorPlanBySlug(VENDOR_PLAN_MAP.tier1)?.name ?? "Local"}
                        </h3>
                        <div className="mb-1">
                          <p className="text-3xl font-bold text-gray-900">
                            {isAnnual ? "$390" : "$39"}
                            <span className="text-base font-normal text-gray-500">/{isAnnual ? "year" : "month"}</span>
                          </p>
                          {isAnnual ? (
                            <p className="text-xs text-green-600 mt-1">$32.50/mo — Save $78/year</p>
                          ) : (
                            <>
                              <p className="text-xs text-gray-500 mt-1">or <span className="text-green-600 font-medium">$390</span> / year</p>
                              <p className="text-xs text-green-600 font-medium">Save ~17%</p>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-3 mb-4 leading-snug">
                          {vendorPlanBySlug(VENDOR_PLAN_MAP.tier1)?.description ?? "Grow with ParishMart"}
                        </p>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start">
                            <span className="text-gray-400 font-bold mr-2 mt-0.5">↑</span>
                            <span className="text-gray-500">All features of the Free plan</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Early visibility advantage as new parishes join</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Social Media exposure through ParishMart channels</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Get a Quote CTA on your profile</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Visibility that grows as the platform expands</span>
                          </li>
                        </ul>
                      </div>

                      {/* Bookings & Services */}
                      <div
                        className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all bg-white ${formData.subscriptionType === "tier2" ? "border-[#006699] shadow-lg" : "border-gray-200 hover:border-gray-300"}`}
                        onClick={() => handleSubscriptionChange("tier2")}
                      >
                        {formData.subscriptionType === "tier2" && (
                          <div className="absolute top-3 right-3 bg-[#006699] rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="inline-block bg-[#1a365d] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                          BEST FOR SERVICES
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {vendorPlanBySlug(VENDOR_PLAN_MAP.tier2)?.name ?? "Bookings & Services"}
                        </h3>
                        <div className="mb-4">
                          <p className="text-3xl font-bold text-gray-900">
                            {isAnnual ? "$790" : "$79"}
                            <span className="text-base font-normal text-gray-500">/{isAnnual ? "year" : "month"}</span>
                          </p>
                          {isAnnual ? (
                            <p className="text-xs text-green-600 mt-1">$65.83/mo — Save $158/year</p>
                          ) : (
                            <>
                              <p className="text-xs text-gray-500 mt-1">or <span className="text-green-600 font-medium">$790</span> / year</p>
                              <p className="text-xs text-green-600 font-medium">Save ~17%</p>
                            </>
                          )}
                          <p className="text-xs text-gray-500 mt-2 italic">
                            {vendorPlanBySlug(VENDOR_PLAN_MAP.tier2)?.description ?? "Turn visibility into real customers"}
                          </p>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start">
                            <span className="text-gray-400 font-bold mr-2 mt-0.5">↑</span>
                            <span className="text-gray-500">All features of the Local plan</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Up to 50 Products or Services</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Book Now or Buy Now CTAs</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Integrated Payments & Booking</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Appointment scheduling</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Analytics & Engagement Tools</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Email notifications for bookings</span>
                          </li>
                        </ul>
                      </div>

                      {/* Sell Products */}
                      <div
                        className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all bg-white ${formData.subscriptionType === "tier3" ? "border-[#006699] shadow-lg" : "border-gray-200 hover:border-gray-300"}`}
                        onClick={() => handleSubscriptionChange("tier3")}
                      >
                        {formData.subscriptionType === "tier3" && (
                          <div className="absolute top-3 right-3 bg-[#006699] rounded-full p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                          SELL PRODUCTS
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {vendorPlanBySlug(VENDOR_PLAN_MAP.tier3)?.name ?? "Sell Products"}
                        </h3>
                        <div className="mb-4">
                          <p className="text-3xl font-bold text-gray-900">
                            {isAnnual ? "$989" : "$99"}
                            <span className="text-base font-normal text-gray-500">/{isAnnual ? "year" : "month"}</span>
                          </p>
                          {isAnnual ? (
                            <p className="text-xs text-green-600 mt-1">$82.42/mo — Save $199/year</p>
                          ) : (
                            <>
                              <p className="text-xs text-gray-500 mt-1">or <span className="text-green-600 font-medium">$989</span> / year</p>
                              <p className="text-xs text-green-600 font-medium">Save ~17%</p>
                            </>
                          )}
                        </div>
                        {/* Fee breakdown — shown before features */}
                        <div className="bg-amber-50 rounded-lg p-3 mb-4 text-sm">
                          <p className="font-semibold text-gray-800">10% supports a parish or cause</p>
                          <p className="text-gray-500 text-xs mt-0.5">10% platform fee</p>
                          <p className="text-gray-400 text-xs mt-1 border-t border-amber-100 pt-1">Total transaction fee: 20%</p>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Unlimited Products & Services</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Priority Featured Placement</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Highlighted Banner & Category Placement</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-[#006699] font-bold mr-2 mt-0.5">✓</span>
                            <span>Advanced Reporting Dashboard</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                  </div>

                  {/* What's included in every plan — horizontal strip */}
                  <div className="bg-gray-50 rounded-xl px-6 py-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center mb-4">Included in every plan</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">🏪</span>
                        <span className="text-xs text-gray-600">Business profile page</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">📋</span>
                        <span className="text-xs text-gray-600">Directory listing</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">🤝</span>
                        <span className="text-xs text-gray-600">Community exposure</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">🔒</span>
                        <span className="text-xs text-gray-600">Secure checkout via Stripe</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">💬</span>
                        <span className="text-xs text-gray-600">Dedicated support</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-4 text-center">All transactions are secured through Stripe. Transactional fees may apply.</p>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#006699] hover:bg-[#005588] text-white"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Nationwide Partnership */}
                  <div className="mt-10 relative overflow-hidden rounded-2xl bg-[#1a365d] p-8 md:p-10">
                    <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 bg-white opacity-5 rounded-full" />
                    <div className="pointer-events-none absolute -bottom-12 -left-8 w-64 h-64 bg-[#006699] opacity-20 rounded-full" />
                    <div className="relative">
                      <span className="inline-block text-xs font-semibold tracking-widest text-[#7ec8e3] uppercase mb-3">Nationwide Partnership</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                        Scale your brand across every parish in the country
                      </h3>
                      <p className="text-[#a8c8d8] text-sm mb-6 max-w-2xl">
                        A direct partnership with ParishMart — built for brands that want nationwide reach inside faith communities.
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 mb-6 max-w-2xl">
                        {[
                          "Nationwide exposure across all ParishMart parishes",
                          "Featured placement opportunities",
                          "API / catalog integration",
                          "Co-branded opportunities",
                          "Dedicated support",
                          "No subscription fee",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-white">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#006699] flex items-center justify-center text-xs font-bold">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-[#7ec8e3] italic mb-6">We don't charge partners. We grow together.</p>
                      <a
                        href="https://shop.parishmart.com/contact/partner"
                        className="inline-block bg-white text-[#1a365d] text-sm font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                      >
                        Become a Partner →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Final Submission */}
              {step === 4 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Final Submission
                  </h2>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
                    <p className="text-blue-700">
                      Thank you for joining ParishMart! Your participation helps
                      grow your business while supporting your parish and local
                      community. If you have any questions, please contact us at{" "}
                      <span className="font-semibold">
                        support@parishmart.com
                      </span>
                      .
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Registration Summary
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4
                          className="font-medium text-gray-700 cursor-pointer hover:text-[#006699] transition-colors flex items-center"
                          onClick={() => setStep(1)}
                        >
                          Subscription (Edit)
                          <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
                        </h4>
                        <p className="text-gray-600">
                          Subscription:{" "}
                          {formData.subscriptionType === "free"
                            ? "Free"
                            : formData.subscriptionType === "tier1"
                              ? (vendorPlanBySlug(VENDOR_PLAN_MAP.tier1)?.name ?? "Local")
                              : formData.subscriptionType === "tier2"
                                ? (vendorPlanBySlug(VENDOR_PLAN_MAP.tier2)?.name ?? "Bookings & Services")
                                : (vendorPlanBySlug(VENDOR_PLAN_MAP.tier3)?.name ?? "Sell Products")}
                          <span className="text-gray-500"> ({isAnnual ? "Annual" : "Monthly"})</span>
                        </p>
                        <p className="text-gray-600">
                          Estimated charge: <span className="font-semibold">${formData.subscriptionAmount.toLocaleString()}/{formData.billingCycle === 'annual' ? 'year' : 'month'}</span>
                        </p>
                      </div>

                      <div>
                        <h4
                          className="font-medium text-gray-700 cursor-pointer hover:text-[#006699] transition-colors flex items-center"
                          onClick={() => setStep(2)}
                        >
                          Personal Information (Edit)
                          <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
                        </h4>
                        <p className="text-gray-600">
                          Name: {formData.firstName} {formData.lastName}
                        </p>
                        <p className="text-gray-600">Email: {formData.email}</p>
                        <p className="text-gray-600">Phone: {formData.phone}</p>
                        {formData.parishAffiliation && (
                          <p className="text-gray-600">
                            Parish Affiliation: {formData.parishAffiliation === "Other" && customParish.trim()
                              ? customParish.trim()
                              : formData.parishAffiliation}
                          </p>
                        )}
                      </div>

                      <div>
                        <h4
                          className="font-medium text-gray-700 cursor-pointer hover:text-[#006699] transition-colors flex items-center"
                          onClick={() => setStep(3)}
                        >
                          Business Information (Edit)
                          <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
                        </h4>
                        <p className="text-gray-600">
                          Business Name: {formData.businessName}
                        </p>
                        <p className="text-gray-600">
                          Logo: {formData.logo ? "✓ Uploaded" : "✗ Not uploaded"}
                        </p>
                        <p className="text-gray-600">
                          Banner: {bannerMode === "full" ? (banner ? "✓ Uploaded" : "✗ Not uploaded") : `✓ ${bannerImages.length} image${bannerImages.length !== 1 ? "s" : ""} (collage)`}
                        </p>
                        <p className="text-gray-600">
                          Card Image: {cardImage ? "✓ Uploaded" : bannerMode === "collage" ? "Auto (first collage image)" : "✗ Not uploaded"}
                        </p>
                        <p className="text-gray-600">
                          Business Type:{" "}
                          {formData.businessType === "product"
                            ? "Product Seller"
                            : formData.businessType === "service"
                              ? "Service Provider"
                              : "Both"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="acceptedTerms"
                      checked={acceptedTerms}
                      onChange={e => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#006699] cursor-pointer flex-shrink-0"
                    />
                    <label htmlFor="acceptedTerms" className="text-sm text-gray-700 cursor-pointer">
                      I have read and agree to the{" "}
                      <a
                        href="https://shop.parishmart.com/terms-of-service"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#006699] underline hover:text-[#005588]"
                      >
                        Terms and Conditions
                      </a>
                      .
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="border-[#006699] text-[#006699]"
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#006699] hover:bg-[#005588] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting || !acceptedTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Processing...</span>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            {/* Help Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                Our team is here to assist you with your vendor registration.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="text-[#006699] border-[#006699]"
                  onClick={() => window.open("https://shop.parishmart.com/contact", "_blank")}
                >
                  Contact Support
                </Button>
                {/* <Button variant="link" className="text-[#006699]">
                  View FAQ
                </Button> */}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default VendorRegistrationForm;
