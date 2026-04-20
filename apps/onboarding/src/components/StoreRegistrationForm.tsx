import React, { useState, useEffect } from "react";
import { apiUrl } from '@/lib/api';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Upload, Check, ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";
import ExternalLocationSelector, { type LocationValue } from "./ExternalLocationSelector";
import ParishSelector, { type PreloadedParish } from "./ParishSelector";

interface FormData {
  adminFirstName: string;
  adminLastName: string;
  email: string;
  adminRole: string;
  streetAddress: string;
  city: string;
  location: {
    country: string;
    subdivision: string;
  };
  zipCode: string;
  phoneNumber: string;
  organizationName: string;
  organizationType: string;
  description: string;
  impact: string;
  foundingYear: string;
  slogan: string;
  logo: File | null;
  photos: File[];
  primaryColor: string;
  accentColor: string;
  showReligiousProducts: boolean;
  taxExemptionForm: File | null;
  collectsDonations: boolean | null;
  donationPlatform: string;
  otherDonationPlatform: string;
  otherOrganizationType?: string;
  referredBy: string;
  otherReferredBy?: string;
  referralAssociateName?: string;
  socialMediaPlatform?: string;
  logoHasTransparentBg: boolean;
}

interface CategoryCardPreview {
  title: string;
  symbol: string;
  from: string;
  to: string;
}

const CATEGORY_CARDS: CategoryCardPreview[] = [
  { title: "Religious Articles", symbol: "✛", from: "#0D2540", to: "#1B4472" },
  { title: "Parish Merch",       symbol: "◈", from: "#3A1010", to: "#6B2626" },
  { title: "Donate",             symbol: "♡", from: "#0C2E1B", to: "#185A36" },
  { title: "Local Business",     symbol: "◉", from: "#191929", to: "#2D2D50" },
];

const StoreRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    adminFirstName: "",
    adminLastName: "",
    email: "",
    adminRole: "",
    streetAddress: "",
    city: "",
    location: {
      country: "",
      subdivision: "",
    },
    zipCode: "",
    phoneNumber: "",
    organizationName: "",
    organizationType: "cause",
    description: "",
    impact: "",
    foundingYear: "",
    slogan: "",
    logo: null,
    photos: [],
    primaryColor: "#006699",
    accentColor: "#4DB8E0",
    showReligiousProducts: true,
    taxExemptionForm: null,
    collectsDonations: null,
    donationPlatform: "",
    otherDonationPlatform: "",
    referredBy: "",
    otherReferredBy: "",
    referralAssociateName: "",
    socialMediaPlatform: "",
    logoHasTransparentBg: false,
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const [foundingYearError, setFoundingYearError] = useState<string>("");
  const [donationPlatformError, setDonationPlatformError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [zipCodeError, setZipCodeError] = useState<string>("");

  const [selectedParish, setSelectedParish] = useState<PreloadedParish | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [externalLocation, setExternalLocation] = useState<LocationValue>({
    countryName: '', stateName: '', cityName: '',
    countryId: undefined, stateId: undefined, cityId: undefined,
  });

  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-().]/g, "");
    const phoneRegex = /^\+?\d{7,15}$/;
    return phoneRegex.test(cleaned);
  };

  // Founding year validation function
  const validateFoundingYear = (year: string): boolean => {
    return year.length === 4 && /^\d{4}$/.test(year);
  };

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  // Donation platform validation function
  const validateDonationPlatform = (): boolean => {
    if (formData.collectsDonations === true) {
      return formData.donationPlatform !== "" &&
             (formData.donationPlatform !== "other" || formData.otherDonationPlatform.trim() !== "");
    }
    return true;
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

    // Founding year validation
    if (name === 'foundingYear') {
      if (value && !validateFoundingYear(value)) {
        setFoundingYearError('Founding year must be exactly 4 digits');
      } else {
        setFoundingYearError('');
      }
    }

    // Phone number validation
    if (name === 'phoneNumber') {
      if (value && !validatePhone(value)) {
        setPhoneError('Please enter a valid phone number');
      } else {
        setPhoneError('');
      }
    }

    // Zip code validation
    if (name === 'zipCode') {
      if (value && !validateZipCode(value)) {
        setZipCodeError('Please enter a valid zip code (e.g. 12345 or 12345-6789)');
      } else {
        setZipCodeError('');
      }
    }

    // Donation platform validation
    if (name === 'donationPlatform' || name === 'otherDonationPlatform') {
      // Clear error when user starts typing/selecting
      setDonationPlatformError('');
    }
  };

  const handleParishSelect = (parish: PreloadedParish) => {
    setSelectedParish(parish);
    setIsManualEntry(false);
    setFormData((prev) => ({
      ...prev,
      organizationName: parish.name,
      description: parish.description ? parish.description.substring(0, 1000) : "",
      foundingYear: parish.founded || "",
      streetAddress: parish.streetAddress || "",
      city: parish.city || "",
      zipCode: parish.zipCode || "",
      phoneNumber: parish.phone || "",
      email: parish.email || "",
      location: {
        country: "US",
        subdivision: parish.state ? `US-${parish.state}` : "",
      },
    }));
    setEmailError("");
    setPhoneError("");
    setZipCodeError("");
    setFoundingYearError("");

    // Resolve external IDs: US country is always id=1; look up state by abbreviation, then city by name
    if (parish.state) {
      fetch(apiUrl('/api/external-data/states?country_id=1'))
        .then(r => r.json())
        .then(async data => {
          if (!data.success) return;
          const stateMatch = (data.data as { id: number; name: string; abbreviation: string }[])
            .find(s => s.abbreviation === parish.state);

          // Set country + state immediately so the city dropdown loads
          setExternalLocation({
            countryName: 'United States of America',
            stateName: stateMatch ? stateMatch.name : parish.state,
            cityName: '',
            countryId: 1,
            stateId: stateMatch?.id,
            cityId: undefined,
          });

          // Then resolve city by name match
          if (stateMatch && parish.city) {
            const cityRes = await fetch(apiUrl(`/api/external-data/cities?state_id=${stateMatch.id}`));
            const cityData = await cityRes.json();
            if (cityData.success) {
              const cityName = parish.city.trim().toLowerCase();
              const cityMatch = (cityData.data as { id: number; name: string }[])
                .find(c => c.name.trim().toLowerCase() === cityName);
              if (cityMatch) {
                setExternalLocation({
                  countryName: 'United States of America',
                  stateName: stateMatch.name,
                  cityName: cityMatch.name,
                  countryId: 1,
                  stateId: stateMatch.id,
                  cityId: cityMatch.id,
                });
              }
            }
          }
        })
        .catch(err => console.error('Failed to resolve location for parish autofill:', err));
    } else {
      setExternalLocation({
        countryName: 'United States of America',
        stateName: '',
        cityName: '',
        countryId: 1,
        stateId: undefined,
        cityId: undefined,
      });
    }
  };

  const handleParishClear = () => {
    setSelectedParish(null);
    setIsManualEntry(false);
    setFormData((prev) => ({
      ...prev,
      organizationName: "",
      description: "",
      foundingYear: "",
      streetAddress: "",
      city: "",
      zipCode: "",
      phoneNumber: "",
      email: "",
      location: { country: "", subdivision: "" },
    }));
    setExternalLocation({ countryName: '', stateName: '', cityName: '', countryId: undefined, stateId: undefined, cityId: undefined });
  };

  const handleManualEntry = () => {
    setSelectedParish(null);
    setIsManualEntry(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only format validators — all fields are optional but must be valid if provided
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      alert("Please enter a valid email address");
      return;
    }
    if (formData.foundingYear && !validateFoundingYear(formData.foundingYear)) {
      setFoundingYearError('Founding year must be exactly 4 digits');
      alert("Founding year must be exactly 4 digits");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add registration type
      submitData.append('registrationType', 'store');

      // Add preloaded parish ID if selected
      if (selectedParish) {
        submitData.append('preloadedParishId', selectedParish.id);
      }
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'logo' && value) {
          submitData.append('logo', value);
        } else if (key === 'taxExemptionForm' && value) {
          submitData.append('taxExemptionForm', value);
        } else if (key === 'photos' && value && Array.isArray(value)) {
          // Handle multiple photos
          value.forEach((photo: File) => {
            submitData.append('photos', photo);
          });
        } else if (key === 'location' && value && typeof value === 'object') {
          // Handle location object
          submitData.append('location', JSON.stringify(value));
        } else if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
          submitData.append(key, value.toString());
        }
      });
      
      // Add banner image (single full banner)
      submitData.append('bannerMode', 'full');
      if (banner) {
        submitData.append('banner', banner);
      }

      // Terms acceptance (stored separately from formData state)
      // External location IDs
      if (externalLocation.countryId) submitData.append('externalCountryId', String(externalLocation.countryId));
      if (externalLocation.stateId)   submitData.append('externalStateId',   String(externalLocation.stateId));
      if (externalLocation.cityId)    submitData.append('externalCityId',    String(externalLocation.cityId));

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
      const organizationId = data?.data?.organizationId;
      const marketplaceBase = (import.meta as any).env?.VITE_MARKETPLACE_URL || 'http://localhost:3000';
      const storeUrl = organizationId
        ? `${marketplaceBase}/store/${organizationId}`
        : marketplaceBase;
      alert("Registration successful! Taking you to your store.");
      window.location.href = storeUrl;
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error instanceof Error ? error.message : "There was an error submitting your registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (formData.email && !validateEmail(formData.email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
      if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
        setPhoneError('Please enter a valid phone number');
        return;
      }
      if (formData.zipCode && !validateZipCode(formData.zipCode)) {
        setZipCodeError('Please enter a valid zip code (e.g. 12345 or 12345-6789)');
        return;
      }
      if (formData.foundingYear && !validateFoundingYear(formData.foundingYear)) {
        setFoundingYearError('Founding year must be exactly 4 digits');
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

  return (
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
      <div className="pt-36 pb-16 relative z-10">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${step === 2 ? 'max-w-7xl' : 'max-w-4xl'} transition-all`}>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#006699] mb-4">
              Register Your Store
            </h1>
            <p className="text-lg text-gray-600">
              Complete the form below to create your customized online store
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10 max-w-md mx-auto">
            <div className="flex justify-between items-center">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-[#006699]" : "text-gray-400"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#006699] text-white" : "bg-gray-200 text-gray-500"}`}>
                  1
                </div>
                <span className="mt-2 text-sm font-medium">Your Info</span>
              </div>
              <div className={`flex-1 h-1 mx-4 ${step >= 2 ? "bg-[#006699]" : "bg-gray-200"}`}></div>
              <div className={`flex flex-col items-center ${step >= 2 ? "text-[#006699]" : "text-gray-400"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#006699] text-white" : "bg-gray-200 text-gray-500"}`}>
                  2
                </div>
                <span className="mt-2 text-sm font-medium">Your Store</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Admin & Organization Information (Merged) */}
            {step === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Organization & Administrator Information
                </h2>

                {/* Pre-load Parish Selector */}
                <div className="mb-8">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Find your parish to pre-fill information
                  </Label>
                  <ParishSelector
                    onSelect={handleParishSelect}
                    onManualEntry={handleManualEntry}
                    selectedParish={selectedParish}
                    onClear={handleParishClear}
                  />
                  {isManualEntry && !selectedParish && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-sm text-gray-500">Entering information manually.</p>
                      <button
                        type="button"
                        onClick={() => setIsManualEntry(false)}
                        className="text-sm text-[#006699] hover:underline"
                      >
                        Search again
                      </button>
                    </div>
                  )}
                </div>

                {/* Row 1: Org core info | Admin core info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  {/* Left: Organization core */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Organization Information</h3>
                    <div className="mb-4">
                      <Label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</Label>
                      <Input id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleInputChange} maxLength={250} className={`w-full`} />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Type
                      </Label>
                      <select
                        id="organizationType"
                        name="organizationType"
                        value={formData.organizationType}
                        onChange={handleInputChange}
                        className="w-full rounded-md border py-2 px-3 border-gray-300 text-gray-900"
                      >
                        <option value="cause">Cause/Non-profit</option>
                        <option value="parish">Parish</option>
                        <option value="diocese">Diocese/Archdiocese</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="foundingYear" className="block text-sm font-medium text-gray-700 mb-1">Founding Year</Label>
                      <Input
                        id="foundingYear"
                        name="foundingYear"
                        type="text"
                        pattern="[0-9]{4}"
                        maxLength={4}
                        value={formData.foundingYear}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,4}$/.test(value)) {
                            setFormData({ ...formData, foundingYear: value });
                            if (value && !validateFoundingYear(value)) {
                              setFoundingYearError('Founding year must be exactly 4 digits');
                            } else {
                              setFoundingYearError('');
                            }
                          }
                        }}
                        className={`w-full ${foundingYearError ? "border-red-500" : ""}`}
                        placeholder="YYYY"
                      />
                      {foundingYearError && (
                        <p className="mt-1 text-sm text-red-500">{foundingYearError}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">Impact of the Organization</Label>
                      <Input
                        id="impact"
                        name="impact"
                        value={formData.impact}
                        onChange={handleInputChange}
                        maxLength={50}
                        className={`w-full`}
                        placeholder="Brief description of your organization's impact..."
                      />
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-500 ml-auto">{formData.impact.length}/50</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Administrator core */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Administrator Information</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="adminFirstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</Label>
                        <Input id="adminFirstName" name="adminFirstName" value={formData.adminFirstName} onChange={handleInputChange} maxLength={250} className={`w-full`} />
                      </div>
                      <div>
                        <Label htmlFor="adminLastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</Label>
                        <Input id="adminLastName" name="adminLastName" value={formData.adminLastName} onChange={handleInputChange} maxLength={250} className={`w-full`} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="adminRole" className="block text-sm font-medium text-gray-700 mb-1">Role / Title</Label>
                      <Input id="adminRole" name="adminRole" value={formData.adminRole} onChange={handleInputChange} maxLength={250} placeholder="e.g. Parish Administrator, Bishop" className={`w-full`} />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} maxLength={250} className={`w-full ${emailError ? "border-red-500" : ""}`} />
                      {emailError && (<p className="mt-1 text-sm text-red-500">{emailError}</p>)}
                      <p className="mt-1 text-sm text-gray-500">We'll send your login credentials to this email</p>
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</Label>
                      <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} maxLength={20} placeholder="e.g. +1 (555) 123-4567" className={`w-full ${phoneError ? "border-red-500" : ""}`} />
                      {phoneError && (<p className="mt-1 text-sm text-red-500">{phoneError}</p>)}
                    </div>
                  </div>
                </div>

                {/* Row 2: Description — full width */}
                <div className="mb-6 pt-6 border-t border-gray-100">
                  <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Organization Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    maxLength={1000}
                    className={`w-full h-36`}
                    placeholder="Tell us about your organization and mission..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400 ml-auto">{formData.description.length}/1000</p>
                  </div>
                </div>

                {/* Row 3: Slogan — full width */}
                <div className="mb-6">
                  <Label htmlFor="slogan" className="block text-sm font-medium text-gray-700 mb-1">Slogan</Label>
                  <Textarea
                    id="slogan"
                    name="slogan"
                    value={formData.slogan}
                    onChange={handleInputChange}
                    maxLength={75}
                    className="w-full h-20"
                    placeholder="Your organization's slogan or tagline..."
                  />
                  <div className="flex justify-end mt-1">
                    <p className="text-sm text-gray-500">{formData.slogan.length}/75</p>
                  </div>
                </div>

                {/* Row 4: Donations | Religious Products — side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 pt-6 border-t border-gray-100">
                  {/* Donations */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Do you currently collect online donations?</Label>
                    <div className="flex items-center gap-6 mb-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="collectsDonations"
                          value="yes"
                          checked={formData.collectsDonations === true}
                          onChange={() => {
                            setFormData({ ...formData, collectsDonations: true });
                            setDonationPlatformError('');
                          }}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="collectsDonations"
                          value="no"
                          checked={formData.collectsDonations === false}
                          onChange={() => {
                            setFormData({ ...formData, collectsDonations: false, donationPlatform: "", otherDonationPlatform: "" });
                            setDonationPlatformError('');
                          }}
                        />
                        <span>No</span>
                      </label>
                    </div>
                    {formData.collectsDonations === true && (
                      <div className="mt-4">
                        <Label htmlFor="donationPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                          Which platform do you use?
                        </Label>
                        <select
                          id="donationPlatform"
                          value={formData.donationPlatform}
                          onChange={(e) => {
                            setFormData({ ...formData, donationPlatform: e.target.value, otherDonationPlatform: e.target.value === "other" ? formData.otherDonationPlatform : "" });
                            setDonationPlatformError('');
                          }}
                          className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent ${donationPlatformError ? "border-red-500" : "border-gray-300"}`}
                        >
                          <option value="">Select a platform</option>
                          <option value="ParishSoft">ParishSoft</option>
                          <option value="Pushpay">Pushpay</option>
                          <option value="Tithe.ly">Tithe.ly</option>
                          <option value="Faith Direct">Faith Direct</option>
                          <option value="GiveCentral">GiveCentral</option>
                          <option value="other">Other</option>
                        </select>
                        {formData.donationPlatform === "other" && (
                          <div className="mt-2">
                            <Label htmlFor="otherDonationPlatform" className="block text-sm font-medium text-gray-700 mb-1">Please specify</Label>
                            <Input
                              id="otherDonationPlatform"
                              value={formData.otherDonationPlatform}
                              onChange={(e) => {
                                setFormData({ ...formData, otherDonationPlatform: e.target.value });
                                setDonationPlatformError('');
                              }}
                              className={`w-full ${donationPlatformError && formData.donationPlatform === "other" ? "border-red-500" : ""}`}
                              maxLength={250}
                              placeholder="Enter the name of your donation platform"
                            />
                          </div>
                        )}
                        {donationPlatformError && (
                          <p className="mt-1 text-sm text-red-500">{donationPlatformError}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Religious Products */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg self-start">
                    <Label className="block text-sm font-medium text-gray-800 mb-1">
                      Would you like to show religious products on your store?
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">
                      ParishMart offers a curated selection of religious products. When your supporters purchase through your store,
                      you receive a percentage of each sale as a donation — at no cost to you.
                    </p>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="showReligiousProducts"
                          value="yes"
                          checked={formData.showReligiousProducts === true}
                          onChange={() => setFormData({ ...formData, showReligiousProducts: true })}
                        />
                        <span className="text-sm">Yes, show them</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="showReligiousProducts"
                          value="no"
                          checked={formData.showReligiousProducts === false}
                          onChange={() => setFormData({ ...formData, showReligiousProducts: false })}
                        />
                        <span className="text-sm">No thanks</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Row 5: Address — full width */}
                <div className="pt-6 border-t border-gray-100 mb-6">
                  <h3 className="text-lg font-medium mb-4">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">Street Address</Label>
                      <Input id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} maxLength={250} className={`w-full mb-4`} />
                      <Label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</Label>
                      <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} maxLength={10} className={`w-full ${zipCodeError ? "border-red-500" : ""}`} />
                      {zipCodeError && (<p className="mt-1 text-sm text-red-500">{zipCodeError}</p>)}
                    </div>
                    <div>
                      <ExternalLocationSelector
                        value={externalLocation}
                        onChange={(loc) => {
                          setExternalLocation(loc);
                          setFormData(prev => ({
                            ...prev,
                            city: loc.cityName,
                            location: { country: loc.countryName, subdivision: loc.stateName },
                          }));
                        }}
                        countryError={false}
                        stateError={false}
                        cityError={false}
                        showErrors={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Referral */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Referral</h3>
                  <div className="max-w-md">
                    <Label htmlFor="referredBy" className="block text-sm font-medium text-gray-700 mb-1">How did you hear from us?</Label>
                    <select
                      id="referredBy"
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          referredBy: val,
                          otherReferredBy: val === "other" ? formData.otherReferredBy : "",
                          referralAssociateName: val === "ministry_brands" ? formData.referralAssociateName : "",
                          socialMediaPlatform: val === "social_media" ? formData.socialMediaPlatform : "",
                        });
                      }}
                      className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent border-gray-300`}
                    >
                      <option value="">Select an option</option>
                      <option value="ministry_brands">Ministry Brands</option>
                      <option value="social_media">Social Media</option>
                      <option value="self_discovered">Self-discovered</option>
                      <option value="other">Other</option>
                    </select>
                    {formData.referredBy === "ministry_brands" && (
                      <div className="mt-2">
                        <Label htmlFor="referralAssociateName" className="block text-sm font-medium text-gray-700 mb-1">
                          Associate's Name
                        </Label>
                        <Input
                          id="referralAssociateName"
                          name="referralAssociateName"
                          value={formData.referralAssociateName || ""}
                          onChange={handleInputChange}
                          className={`w-full`}
                          maxLength={250}
                          placeholder="Enter associate's name"
                        />
                      </div>
                    )}
                    {formData.referredBy === "social_media" && (
                      <div className="mt-2">
                        <Label htmlFor="socialMediaPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                          Please specify
                        </Label>
                        <select
                          id="socialMediaPlatform"
                          name="socialMediaPlatform"
                          value={formData.socialMediaPlatform || ""}
                          onChange={(e) => setFormData({ ...formData, socialMediaPlatform: e.target.value })}
                          className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent border-gray-300`}
                        >
                          <option value="">Select a platform</option>
                          <option value="instagram">Instagram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="facebook">Facebook</option>
                        </select>
                      </div>
                    )}
                    {formData.referredBy === "other" && (
                      <div className="mt-2">
                        <Label htmlFor="otherReferredBy" className="block text-sm font-medium text-gray-700 mb-1">
                          Please specify
                        </Label>
                        <Input
                          id="otherReferredBy"
                          name="otherReferredBy"
                          value={formData.otherReferredBy || ""}
                          onChange={handleInputChange}
                          className="w-full"
                          maxLength={250}
                          placeholder="Enter who referred you"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    onClick={prevStep}
                    variant="outline"
                    className="border-[#006699] text-[#006699]"
                  >
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep} className="bg-[#006699] hover:bg-[#005588] text-white">
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Your Store — live editor */}
            {step === 2 && (
              <div className="mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your Store</h2>
                  <p className="text-gray-600">
                    This is how your store will look to supporters. Customize the visuals here —
                    products and more options can be edited from your dashboard after registration.
                  </p>
                </div>

                <div className="grid lg:grid-cols-[320px_1fr] gap-8">
                  {/* ── Left: Controls ───────────────────────── */}
                  <div className="space-y-6 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit lg:sticky lg:top-24">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Store name</Label>
                      <Input
                        value={formData.organizationName}
                        onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                        placeholder="Your Parish Name"
                        maxLength={100}
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Tagline / slogan</Label>
                      <Textarea
                        value={formData.slogan}
                        onChange={(e) => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
                        placeholder="A welcoming line for your supporters…"
                        maxLength={120}
                        className="h-20"
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">{formData.slogan.length}/120</p>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Logo</Label>
                      <label className="block w-full aspect-square max-w-[140px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 overflow-hidden relative">
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <Upload className="h-6 w-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Upload logo</span>
                          </div>
                        )}
                      </label>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.logoHasTransparentBg}
                          onChange={(e) => setFormData(prev => ({ ...prev, logoHasTransparentBg: e.target.checked }))}
                          className="w-4 h-4 accent-[#006699]"
                        />
                        <span className="text-xs text-gray-600">Transparent background</span>
                      </label>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Banner image</Label>
                      <label className="block w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 overflow-hidden relative">
                        <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                        {bannerPreview ? (
                          <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <Upload className="h-5 w-5 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Upload banner</span>
                          </div>
                        )}
                      </label>
                      <p className="text-xs text-gray-400 mt-1">Ideal: 1498 × 337 px</p>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Primary color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.primaryColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white"
                        />
                        <Input
                          value={formData.primaryColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1 font-mono text-xs uppercase"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Accent color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.accentColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white"
                        />
                        <Input
                          value={formData.accentColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="flex-1 font-mono text-xs uppercase"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Tell supporters about your organization…"
                        maxLength={1000}
                        className="h-24"
                      />
                    </div>
                  </div>

                  {/* ── Right: Preview (marketplace look-alike) ─── */}
                  <div>
                    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-[#faf6ee]">
                      {/* Hero */}
                      <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                        {bannerPreview ? (
                          <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: `linear-gradient(140deg, ${formData.primaryColor} 0%, #1a2341 100%)` }}
                          >
                            <span className="text-white/60 text-sm italic">Banner preview</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 px-4 pb-4">
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/80 shadow bg-white">
                            {logoPreview ? (
                              <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">Logo</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pb-0.5">
                            <h2 className="text-[22px] italic text-white leading-tight truncate" style={{ fontFamily: 'Georgia, serif' }}>
                              {formData.organizationName || "Your Store Name"}
                            </h2>
                            <p className="text-[11px] text-white/65 mt-0.5 tracking-wide">
                              {externalLocation.cityName || formData.city || "City"}
                              {(externalLocation.stateName || formData.location?.subdivision) && `, ${externalLocation.stateName || formData.location.subdivision}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Welcome */}
                      <div className="px-5 pt-5 pb-4">
                        <div
                          className="text-[11px] font-medium tracking-widest uppercase mb-2"
                          style={{ color: formData.accentColor }}
                        >
                          ✦ Welcome ✦
                        </div>
                        <p className="text-xl italic leading-snug text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                          {formData.slogan || "A welcoming tagline for your supporters"}
                        </p>
                        <p className="text-sm mt-2 leading-relaxed text-gray-600">
                          {formData.description || `Browse sacred goods, community merch, charitable giving, and local vendors who support ${formData.organizationName || "your parish"}.`}
                        </p>
                      </div>

                      <div className="h-px mx-5 mb-4" style={{ background: formData.accentColor, opacity: 0.4 }} />

                      {/* Category cards 2×2 */}
                      <div className="grid grid-cols-2 gap-3 px-4 pb-6">
                        {CATEGORY_CARDS.map((card) => (
                          <div
                            key={card.title}
                            className="relative flex flex-col justify-between rounded-2xl p-4 text-left min-h-[140px] overflow-hidden"
                            style={{ background: `linear-gradient(140deg, ${card.from} 0%, ${card.to} 100%)` }}
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-2xl leading-none" style={{ color: formData.accentColor, fontFamily: 'Georgia, serif' }}>
                                {card.symbol}
                              </span>
                              <span
                                className="text-[10px] font-medium tracking-widest uppercase rounded-full px-2 py-0.5"
                                style={{ backgroundColor: `${formData.accentColor}26`, color: formData.accentColor, border: `1px solid ${formData.accentColor}40` }}
                              >
                                Coming soon
                              </span>
                            </div>
                            <div>
                              <div className="mb-2 h-px opacity-25" style={{ background: formData.accentColor }} />
                              <h3 className="text-[20px] italic leading-tight text-white" style={{ fontFamily: 'Georgia, serif' }}>
                                {card.title}
                              </h3>
                              <p className="text-[11px] mt-1 tracking-wide uppercase opacity-50 text-white">Explore →</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="px-5 py-3 bg-white/50 text-xs text-gray-500 text-center border-t border-gray-100">
                        Products will appear here. Add them from your dashboard after registration.
                      </div>
                    </div>
                  </div>
                </div>

                {/* T&C + navigation */}
                <div className="mt-8 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-start gap-3 mb-5">
                    <input
                      type="checkbox"
                      id="acceptedTerms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#006699] cursor-pointer flex-shrink-0"
                    />
                    <label htmlFor="acceptedTerms" className="text-sm text-gray-700 cursor-pointer">
                      I have read and agree to the{" "}
                      <a href="https://shop.parishmart.com/terms-of-service" target="_blank" rel="noreferrer" className="text-[#006699] underline hover:text-[#005588]">
                        Terms and Conditions
                      </a>.
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" onClick={prevStep} variant="outline" className="border-[#006699] text-[#006699]">
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#006699] hover:bg-[#005588] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting || !acceptedTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Creating…</span>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        "Create my store"
                      )}
                    </Button>
                  </div>
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
              Our team is here to assist you with your store setup.
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
  );
};

export default StoreRegistrationForm;
