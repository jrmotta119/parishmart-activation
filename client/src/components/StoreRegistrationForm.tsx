import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Upload, Check, ArrowRight, Info } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";
import CountryStateSelector from "./CountryStateSelector";

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
  // primaryColor: string;
  // secondaryColor: string;
  subscriptionTier: "basic" | "premium" | "elite";
  needsConsultation: boolean;
  taxExemptionForm: File | null;
  collectsDonations: boolean | null;
  donationPlatform: string;
  otherDonationPlatform: string;
  otherOrganizationType?: string;
  referredBy: string;
  otherReferredBy?: string;
  referralAssociateName?: string;
  socialMediaPlatform?: string;
}

// Tooltip component
const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <span className="relative group cursor-pointer">
    {children}
    <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-200 shadow-lg">
      {text}
    </span>
  </span>
);

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
    subscriptionTier: "basic",
    needsConsultation: false,
    taxExemptionForm: null,
    collectsDonations: null,
    donationPlatform: "",
    otherDonationPlatform: "",
    referredBy: "",
    otherReferredBy: "",
    referralAssociateName: "",
    socialMediaPlatform: "",
  });
  // primaryColor: "#006699",
  // secondaryColor: "#ffffff",

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [bannerMode, setBannerMode] = useState<"full" | "collage">("full");
  const [bannerImages, setBannerImages] = useState<File[]>([]);
  const [bannerImagesPreviews, setBannerImagesPreviews] = useState<string[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptedSteps, setAttemptedSteps] = useState<number[]>([]);
  const [emailError, setEmailError] = useState<string>("");
  const [foundingYearError, setFoundingYearError] = useState<string>("");
  const [donationPlatformError, setDonationPlatformError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [zipCodeError, setZipCodeError] = useState<string>("");

  const [customPrimaryColor, setCustomPrimaryColor] = useState("#006699");
  const [customSecondaryColor, setCustomSecondaryColor] = useState("#e6f7ff");


  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const colorOptions = [
    { name: "Blue", primary: "#006699", secondary: "#e6f7ff" },
    { name: "Green", primary: "#2e7d32", secondary: "#e8f5e9" },
    { name: "Purple", primary: "#673ab7", secondary: "#ede7f6" },
    { name: "Red", primary: "#d32f2f", secondary: "#ffebee" },
    { name: "Orange", primary: "#ed6c02", secondary: "#fff3e0" },
    { name: "Teal", primary: "#00796b", secondary: "#e0f2f1" },
  ];

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

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5);
      setFormData({
        ...formData,
        photos: [...formData.photos, ...filesArray].slice(0, 5),
      });

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPhotosPreviews([...photosPreviews, ...newPreviews].slice(0, 5));
    }
  };

  // const handleColorChange = (primary: string, secondary: string) => {
  //   setFormData({
  //     ...formData,
  //     primaryColor: primary,
  //     secondaryColor: secondary,
  //   });
  // };

  const removePhoto = (index: number) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData({ ...formData, photos: updatedPhotos });

    const updatedPreviews = [...photosPreviews];
    updatedPreviews.splice(index, 1);
    setPhotosPreviews(updatedPreviews);
  };

  const orgTypeByTier: Record<string, string> = { basic: "cause", premium: "parish", elite: "diocese" };
  const handleSubscriptionChange = (tier: "basic" | "premium" | "elite") => {
    setFormData({ ...formData, subscriptionTier: tier, organizationType: orgTypeByTier[tier] });
  };

  const handleConsultationChange = (needsConsultation: boolean) => {
    setFormData({ ...formData, needsConsultation });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all steps as attempted for validation
    setAttemptedSteps([1, 2, 3, 4, 5]);

    // Validate all required fields
    if (
      !formData.adminFirstName ||
      !formData.adminLastName ||
      !formData.email ||
      !formData.streetAddress ||
      !formData.city ||
      !formData.location.country ||
      !formData.location.subdivision ||
      !formData.zipCode ||
      !formData.organizationName ||
      !formData.impact ||
      !formData.foundingYear
    ) {
      alert("Please fill in all required fields");
      return;
    }
    // Email format validation
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      alert("Please enter a valid email address");
      return;
    }
    // Founding year validation
    if (formData.foundingYear && !validateFoundingYear(formData.foundingYear)) {
      setFoundingYearError('Founding year must be exactly 4 digits');
      alert("Founding year must be exactly 4 digits");
      return;
    }
    // Donation platform validation
    if (!validateDonationPlatform()) {
      setDonationPlatformError('Please select a donation platform');
      alert("Please select a donation platform");
      return;
    }
    // Validate elite subscription requirements
    if (formData.subscriptionTier === "elite" && !formData.logo) {
      alert("Please upload your organization logo");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add registration type
      submitData.append('registrationType', 'store');
      
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
      
      // Add banner image(s)
      submitData.append('bannerMode', bannerMode);
      if (bannerMode === "full" && banner) {
        submitData.append('banner', banner);
      } else if (bannerMode === "collage") {
        bannerImages.forEach((img) => {
          submitData.append('bannerImages', img);
        });
      }
      
      // Send form data to API endpoint
      const response = await fetch('/api/registration', {
        method: 'POST',
        body: submitData, // Don't set Content-Type header for FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      console.log("Form submitted successfully:", data);
      alert("Registration successful! Your store is being set up. You will receive updates of your account status via email.");
      // Redirect to home or dashboard
      window.location.href = "/";
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error instanceof Error ? error.message : "There was an error submitting your registration. Please try again.");
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
    if (step === 1) {
      // Subscription step - no required fields to validate beyond selection
    } else if (step === 2) {
      if (!formData.adminFirstName || !formData.adminLastName || !formData.adminRole || !formData.email || !formData.phoneNumber ||
          !formData.streetAddress || !formData.city || !formData.location.country || !formData.location.subdivision || !formData.zipCode ||
          !formData.organizationName || !formData.description ||
          !formData.impact || !formData.foundingYear ||
          (formData.referredBy === "ministry_brands" && !formData.referralAssociateName) ||
          (formData.referredBy === "social_media" && !formData.socialMediaPlatform)) {
        return;
      }
      // Email format validation
      if (formData.email && !validateEmail(formData.email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
      // Phone number validation
      if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
        setPhoneError('Please enter a valid phone number');
        return;
      }
      // Zip code validation
      if (formData.zipCode && !validateZipCode(formData.zipCode)) {
        setZipCodeError('Please enter a valid zip code (e.g. 12345 or 12345-6789)');
        return;
      }
      // Founding year validation - must be exactly 4 digits
      if (formData.foundingYear && !validateFoundingYear(formData.foundingYear)) {
        setFoundingYearError('Founding year must be exactly 4 digits');
        return;
      }
      // Donation platform validation
      if (!validateDonationPlatform()) {
        setDonationPlatformError('Please select a donation platform');
        return;
      }
    } else if (step === 3) {
      const bannerValid = bannerMode === "full" ? !!banner : bannerImages.length >= 3;
      if (!formData.logo || !bannerValid) {
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
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${step === 1 ? 'max-w-7xl' : 'max-w-4xl'} transition-all`}>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#006699] mb-4">
              Register Your Store
            </h1>
            <p className="text-lg text-gray-600">
              Complete the form below to create your customized online store
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
                  Subscription
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
                  Org & Admin Info
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
                <span className="mt-2 text-sm font-medium">Store Customization</span>
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
            {/* Step 2: Admin & Organization Information (Merged) */}
            {step === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Organization & Administrator Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Organization Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Organization Information</h3>
                    <Label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</Label>
                    <Input id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleInputChange} required maxLength={250} className={`w-full ${!formData.organizationName && attemptedSteps.includes(2) ? "border-red-500" : ""}`} />
                    {!formData.organizationName && attemptedSteps.includes(2) && (<p className="mt-1 text-sm text-red-500">Organization name is required</p>)}
                    <Label htmlFor="organizationType" className="text-sm font-medium text-gray-700 mb-1 mt-4 flex items-center gap-2">
                      Organization Type
                      <Tooltip text="This is automatically set based on the subscription plan you selected in Step 1.">
                        <Info className="h-4 w-4 text-gray-400 hover:text-[#006699]" />
                      </Tooltip>
                    </Label>
                    <select id="organizationType" name="organizationType" value={formData.organizationType} disabled className="w-full rounded-md border border-gray-200 bg-gray-100 py-2 px-3 text-gray-500 cursor-not-allowed">
                      <option value="cause">Cause/Non-profit</option>
                      <option value="parish">Parish</option>
                      <option value="diocese">Diocese/Archdiocese</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-400">Based on your selected plan</p>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Organization Description *</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      required
                      maxLength={250}
                      className={`w-full h-32 ${!formData.description && attemptedSteps.includes(2) ? "border-red-500" : ""}`} 
                      placeholder="Tell us about your organization and mission..." 
                    />
                    {!formData.description && attemptedSteps.includes(2) && (
                      <p className="mt-1 text-sm text-red-500">Organization description is required</p>
                    )}
                    
                    <Label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Impact of the Organization *</Label>
                    <Input 
                      id="impact" 
                      name="impact" 
                      value={formData.impact} 
                      onChange={handleInputChange} 
                      maxLength={50}
                      required 
                      className={`w-full ${!formData.impact && attemptedSteps.includes(2) ? "border-red-500" : ""}`} 
                      placeholder="Brief description of your organization's impact..." 
                    />
                    <div className="flex justify-between items-center mt-1">
                      {!formData.impact && attemptedSteps.includes(2) && (
                        <p className="text-sm text-red-500">Impact description is required</p>
                      )}
                      <p className="text-sm text-gray-500 ml-auto">{formData.impact.length}/50 characters</p>
                    </div>
                    
                    <Label htmlFor="foundingYear" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Founding Year *</Label>
                    <Input 
                      id="foundingYear" 
                      name="foundingYear" 
                      type="text"
                      pattern="[0-9]{4}"
                      maxLength={4}
                      value={formData.foundingYear} 
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow digits and limit to 4 characters
                        if (/^\d{0,4}$/.test(value)) {
                          setFormData({ ...formData, foundingYear: value });
                          if (value && !validateFoundingYear(value)) {
                            setFoundingYearError('Founding year must be exactly 4 digits');
                          } else {
                            setFoundingYearError('');
                          }
                        }
                      }}
                      required 
                      className={`w-full ${(!formData.foundingYear && attemptedSteps.includes(2)) || foundingYearError ? "border-red-500" : ""}`} 
                      placeholder="YYYY" 
                    />
                    {!formData.foundingYear && attemptedSteps.includes(2) && (
                      <p className="mt-1 text-sm text-red-500">Founding year is required</p>
                    )}
                    {foundingYearError && (
                      <p className="mt-1 text-sm text-red-500">
                        {foundingYearError}
                      </p>
                    )}

                    <Label htmlFor="slogan" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Slogan</Label>
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
                      <p className="text-sm text-gray-500">{formData.slogan.length}/75 characters</p>
                    </div>
                    {/* Donation Collection Question */}
                    <Label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Do you currently collect online donations? *</Label>
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
                          required
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
                          required
                        />
                        <span>No</span>
                      </label>
                    </div>
                    {formData.collectsDonations === null && attemptedSteps.includes(2) && (
                      <p className="text-sm text-red-500 mb-2">This field is required</p>
                    )}

                    {/* Donation Platform Dropdown (conditional) */}
                    {formData.collectsDonations === true && (
                      <div className="mt-4">
                        <Label htmlFor="donationPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                          Which platform do you use to manage or collect donations? *
                        </Label>
                        <select
                          id="donationPlatform"
                          value={formData.donationPlatform}
                          onChange={(e) => {
                            setFormData({ ...formData, donationPlatform: e.target.value, otherDonationPlatform: e.target.value === "other" ? formData.otherDonationPlatform : "" });
                            setDonationPlatformError('');
                          }}
                          className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent ${donationPlatformError ? "border-red-500" : "border-gray-300"}`}
                          required
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
                            <Label htmlFor="otherDonationPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                              Please specify
                            </Label>
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
                              required
                            />
                          </div>
                        )}
                        {donationPlatformError && (
                          <p className="mt-1 text-sm text-red-500">
                            {donationPlatformError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Right: Administrator Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Administrator Information</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="adminFirstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</Label>
                        <Input id="adminFirstName" name="adminFirstName" value={formData.adminFirstName} onChange={handleInputChange} required maxLength={250} className={`w-full ${!formData.adminFirstName && attemptedSteps.includes(2) ? "border-red-500" : ""}`} />
                        {!formData.adminFirstName && attemptedSteps.includes(2) && (<p className="mt-1 text-sm text-red-500">First name is required</p>)}
                      </div>
                      <div>
                        <Label htmlFor="adminLastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</Label>
                        <Input id="adminLastName" name="adminLastName" value={formData.adminLastName} onChange={handleInputChange} required maxLength={250} className={`w-full ${!formData.adminLastName && attemptedSteps.includes(2) ? "border-red-500" : ""}`} />
                        {!formData.adminLastName && attemptedSteps.includes(2) && (<p className="mt-1 text-sm text-red-500">Last name is required</p>)}
                      </div>
                    </div>
                    <Label htmlFor="adminRole" className="block text-sm font-medium text-gray-700 mb-1">Role / Title *</Label>
                    <Input id="adminRole" name="adminRole" value={formData.adminRole} onChange={handleInputChange} required maxLength={250} placeholder="e.g. Parish Administrator, Bishop" className={`w-full ${!formData.adminRole && attemptedSteps.includes(2) ? "border-red-500" : ""}`} />
                    {!formData.adminRole && attemptedSteps.includes(2) && (<p className="mt-1 text-sm text-red-500">Role / Title is required</p>)}
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required maxLength={250} className={`w-full ${(!formData.email && attemptedSteps.includes(2)) || emailError ? "border-red-500" : ""}`} />
                    {!formData.email && attemptedSteps.includes(2) && (<p className="mt-1 text-sm text-red-500">Email is required</p>)}
                    {emailError && (
                      <p className="mt-1 text-sm text-red-500">
                        {emailError}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">We'll send your login credentials to this email</p>
                    <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Phone Number *</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required maxLength={20} placeholder="e.g. +1 (555) 123-4567" className={`w-full ${(!formData.phoneNumber && attemptedSteps.includes(2)) || phoneError ? "border-red-500" : ""}`} />
                    {!formData.phoneNumber && attemptedSteps.includes(2) && (<p className="mt-1 text-sm text-red-500">Phone number is required</p>)}
                    {phoneError && (<p className="mt-1 text-sm text-red-500">{phoneError}</p>)}

                    <Label className="block text-md font-medium text-gray-700 mb-1 mt-8">Address</Label>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</Label>
                        <Input id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} required maxLength={250} className={`w-full ${!formData.streetAddress && attemptedSteps.includes(2) ? "border-red-500" : ""}`} />
                        {!formData.streetAddress && attemptedSteps.includes(2) && (<p className="mt-1 text-sm text-red-500">Street address is required</p>)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</Label>
                          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required maxLength={250} className={`w-full ${!formData.city && attemptedSteps.includes(2) ? "border-red-500" : ""}`} />
                          {!formData.city && attemptedSteps.includes(2) && (<p className="mt-1 text-sm text-red-500">City is required</p>)}
                        </div>
                        <div>
                          <Label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</Label>
                          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required maxLength={10} className={`w-full ${(!formData.zipCode && attemptedSteps.includes(2)) || zipCodeError ? "border-red-500" : ""}`} />
                          {!formData.zipCode && attemptedSteps.includes(2) && (<p className="mt-1 text-sm text-red-500">Zip code is required</p>)}
                          {zipCodeError && (<p className="mt-1 text-sm text-red-500">{zipCodeError}</p>)}
                        </div>
                      </div>
                      <div className="mb-4">
                        <CountryStateSelector
                          value={formData.location}
                          onChange={(value) => setFormData({ ...formData, location: value })}
                          countryError={!formData.location.country && attemptedSteps.includes(2)}
                          stateError={!formData.location.subdivision && attemptedSteps.includes(2)}
                          showErrors={attemptedSteps.includes(2)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Referral */}
                <div className="mt-8 pt-6 border-t border-gray-200">
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
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent"
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
                          Associate's Name *
                        </Label>
                        <Input
                          id="referralAssociateName"
                          name="referralAssociateName"
                          value={formData.referralAssociateName || ""}
                          onChange={handleInputChange}
                          required
                          className={`w-full ${formData.referredBy === "ministry_brands" && !formData.referralAssociateName && attemptedSteps.includes(2) ? "border-red-500" : ""}`}
                          maxLength={250}
                          placeholder="Enter associate's name"
                        />
                        {!formData.referralAssociateName && attemptedSteps.includes(2) && (
                          <p className="mt-1 text-sm text-red-500">Associate's name is required</p>
                        )}
                      </div>
                    )}
                    {formData.referredBy === "social_media" && (
                      <div className="mt-2">
                        <Label htmlFor="socialMediaPlatform" className="block text-sm font-medium text-gray-700 mb-1">
                          Please specify *
                        </Label>
                        <select
                          id="socialMediaPlatform"
                          name="socialMediaPlatform"
                          value={formData.socialMediaPlatform || ""}
                          onChange={(e) => setFormData({ ...formData, socialMediaPlatform: e.target.value })}
                          required
                          className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent ${formData.referredBy === "social_media" && !formData.socialMediaPlatform && attemptedSteps.includes(2) ? "border-red-500" : "border-gray-300"}`}
                        >
                          <option value="">Select a platform</option>
                          <option value="instagram">Instagram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="facebook">Facebook</option>
                        </select>
                        {formData.referredBy === "social_media" && !formData.socialMediaPlatform && attemptedSteps.includes(2) && (
                          <p className="mt-1 text-sm text-red-500">Please select a social media platform</p>
                        )}
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

            {/* Step 1: Subscription Selection */}
            {step === 1 && (
              <div className="mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Grow Your Mission with ParishMart
                  </h2>
                  <p className="text-gray-600">
                    Choose the plan that helps your parish or cause expand its impact and connect.
                  </p>
                </div>

                {/* Monthly/Annual Toggle */}
                <div className="flex items-center justify-center gap-3 mb-10">
                  <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                  <button
                    type="button"
                    onClick={() => setIsAnnual(!isAnnual)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-[#006699]' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${isAnnual ? 'translate-x-7' : ''}`} />
                  </button>
                  <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Annual - Save 20%</span>
                </div>

                {/* Pricing Cards + What's Included sidebar */}
                <div className="flex flex-col xl:flex-row gap-6 mb-6">
                  {/* Pricing Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-w-0">
                    {/* Cause Plan (left) */}
                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all flex flex-col bg-white relative ${formData.subscriptionTier === "basic" ? "border-[#006699] shadow-lg" : "border-gray-200 hover:border-gray-300"}`}
                      onClick={() => handleSubscriptionChange("basic")}
                    >
                      {formData.subscriptionTier === "basic" && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#006699] rounded-full flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Cause Plan</h3>
                      <div className="mb-4">
                        {isAnnual ? (
                          <>
                            <p className="text-3xl font-bold text-gray-900">$279<span className="text-base font-normal text-gray-500"> / year</span></p>
                            <p className="text-sm text-green-600 font-medium">Save 20%</p>
                          </>
                        ) : (
                          <>
                            <p className="text-3xl font-bold text-gray-900">$29<span className="text-base font-normal text-gray-500"> / month</span></p>
                            <p className="text-sm text-gray-500">or <span className="text-green-600 font-medium">$279</span> / year</p>
                            <p className="text-sm text-green-600 font-medium">Save 20%</p>
                          </>
                        )}
                      </div>
                      <div className="border-t border-gray-100 pt-4 flex-grow">
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Campaign Storefront</li>
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Accept Donations</li>
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Up to 5 Products</li>
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Basic Dashboard</li>
                        </ul>
                      </div>
                    </div>

                    {/* Parish Growth Plan (middle) - MOST POPULAR */}
                    <div
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all relative flex flex-col bg-white ${formData.subscriptionTier === "premium" ? "border-[#006699] shadow-lg ring-2 ring-[#006699]/20" : "border-gray-200 hover:border-gray-300"}`}
                      onClick={() => handleSubscriptionChange("premium")}
                    >
                      <span className="absolute -top-3 left-6 bg-[#1a365d] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                      {formData.subscriptionTier === "premium" && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#006699] rounded-full flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">Parish Growth Plan</h3>
                      <div className="mb-4">
                        {isAnnual ? (
                          <>
                            <p className="text-3xl font-bold text-gray-900">$1,430<span className="text-base font-normal text-gray-500"> / year</span></p>
                            <p className="text-sm text-green-600 font-medium">Save 20%</p>
                          </>
                        ) : (
                          <>
                            <p className="text-3xl font-bold text-gray-900">$149<span className="text-base font-normal text-gray-500"> / month</span></p>
                            <p className="text-sm text-gray-500">or <span className="text-green-600 font-medium">$1,430</span> / year</p>
                            <p className="text-sm text-green-600 font-medium">Save 20%</p>
                          </>
                        )}
                      </div>
                      <div className="border-t border-gray-100 pt-4 flex-grow">
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Branded Parish Store</li>
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Unlimited Donations</li>
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Sell Products & Services</li>
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Featured Exposure in Marketplace</li>
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Impact Dashboard & Reporting</li>
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> ParishSoft Integration</li>
                          <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Secure Stripe Connect Setup</li>
                        </ul>
                      </div>
                    </div>

                    {/* Diocese Network Plan (right) */}
                    <div
                      className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col bg-white relative ${formData.subscriptionTier === "elite" ? "border-[#006699] shadow-lg" : "border-gray-200 hover:border-gray-300"}`}
                      onClick={() => handleSubscriptionChange("elite")}
                    >
                      {formData.subscriptionTier === "elite" && (
                        <div className="absolute top-3 right-3 z-10 w-6 h-6 bg-[#006699] rounded-full flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                      <div className="bg-[#1a365d] px-6 py-4">
                        <h3 className="text-xl font-bold text-white">Diocese Network Plan</h3>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="mb-4">
                          {isAnnual ? (
                            <>
                              <p className="text-3xl font-bold text-gray-900">$1,150<span className="text-base font-normal text-gray-500"> / year per parish</span></p>
                              <p className="text-sm text-gray-600">(20% savings vs individual)</p>
                              <p className="text-sm text-green-600 font-medium">Save 20% vs individual</p>
                            </>
                          ) : (
                            <>
                              <p className="text-3xl font-bold text-gray-900">$119<span className="text-base font-normal text-gray-500"> / month per parish</span></p>
                              <p className="text-sm text-gray-500">or <span className="text-green-600 font-medium">$1,150</span> / year per parish</p>
                              <p className="text-sm text-green-600 font-medium">Save 20% vs individual</p>
                            </>
                          )}
                        </div>
                        <div className="border-t border-gray-100 pt-4 flex-grow">
                          <ul className="space-y-3 text-sm">
                            <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Centralized Diocese Dashboard</li>
                            <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Consolidated Reporting Across Parishes</li>
                            <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Volume Discount Applied Automatically</li>
                            <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Stripe Visibility Per Parish</li>
                            <li className="flex items-start"><Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" /> Priority Support</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What's included sidebar */}
                  <div className="xl:w-56 flex-shrink-0">
                    <div className="bg-gray-50 rounded-xl p-5 h-full">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">What's included in every ParishMart plan:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600">Secure Stripe-compliant donation processing</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600">Dedicated store inside ParishMart marketplace</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600">Ongoing platform updates</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600">Access to ParishMart support team</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-500 mb-8">
                  All funds are processed securely through Stripe. ParishMart never holds or controls your donations.
                </p>

                <div className="flex justify-end">
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

            {/* Step 3: Finalize Steps */}
            {step === 3 && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Store Customization
                </h2>
                <p className="text-sm text-gray-500 mb-6">You can modify all of these settings later from your dashboard.</p>

                {/* Logo Upload */}
                <div className="mb-8">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Upload Store Logo *</span>
                  <div className="flex flex-col items-center w-44">
                    <div className={`w-44 h-44 border-2 border-dashed ${!formData.logo && attemptedSteps.includes(3) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-2`}>
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
                    {!formData.logo && attemptedSteps.includes(3) && (
                      <p className="mt-1 text-xs text-red-500">Logo is required</p>
                    )}
                  </div>
                </div>

                {/* Banner Upload Section */}
                <div className="mb-8">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Store Banner *</span>

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
                        <div className={`w-full max-w-[500px] h-44 border-2 border-dashed ${!banner && attemptedSteps.includes(3) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-2`}>
                          <input
                            type="file"
                            id="store-banner-image"
                            accept="image/*"
                            onChange={handleBannerChange}
                            className="hidden"
                          />
                          <label htmlFor="store-banner-image" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                            {bannerPreview ? (
                              <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <>
                                <Upload className="h-5 w-20 text-gray-400 mb-2 mx-auto" />
                                <span className="text-xs text-gray-500">Banner Image</span>
                                <span className="text-xs text-gray-400">PNG, JPG, GIF</span>
                              </>
                            )}
                          </label>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Ideal size: 1498x337 px</div>
                        {!banner && attemptedSteps.includes(3) && (
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
                              <div key={index} className={`w-full aspect-square border-2 border-dashed ${bannerImages.length < 3 && attemptedSteps.includes(3) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}>
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
                            <div key={index} className={`w-full aspect-square border-2 border-dashed ${bannerImages.length < 3 && attemptedSteps.includes(3) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center`}>
                              <span className="text-xs text-gray-400">{index + 1}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{bannerImages.length}/5 images uploaded (minimum 3)</div>
                      {bannerImages.length < 3 && attemptedSteps.includes(3) && (
                        <p className="mt-1 text-xs text-red-500">Please upload at least 3 images</p>
                      )}
                    </div>
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
                    disabled={
                      (formData.subscriptionTier === "elite" &&
                        (!formData.logo || !formData.organizationName))
                    }
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
                        {formData.subscriptionTier === "basic"
                          ? "Cause Plan"
                          : formData.subscriptionTier === "premium"
                            ? "Parish Growth Plan"
                            : "Diocese Network Plan"}
                        {formData.subscriptionTier !== "elite" && (
                          <span className="text-gray-500"> ({isAnnual ? "Annual" : "Monthly"})</span>
                        )}
                      </p>
                    </div>

                    <div>
                      <h4
                        className="font-medium text-gray-700 cursor-pointer hover:text-[#006699] transition-colors flex items-center"
                        onClick={() => setStep(2)}
                      >
                        Administrator & Organization Information (Edit)
                        <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
                      </h4>
                      <p className="text-gray-600">
                        Name: {formData.adminFirstName} {formData.adminLastName}
                      </p>
                      <p className="text-gray-600">Email: {formData.email}</p>
                      <p className="text-gray-600">Organization: {formData.organizationName}</p>
                      <p className="text-gray-600">Type: {formData.organizationType === "cause" ? "Cause/Non-profit" : formData.organizationType === "diocese" ? "Diocese/Archdiocese" : "Parish"}</p>
                      {formData.impact && (
                        <p className="text-gray-600">Impact: {formData.impact}</p>
                      )}
                      {formData.foundingYear && (
                        <p className="text-gray-600">Founded: {formData.foundingYear}</p>
                      )}
                      {formData.slogan && (
                        <p className="text-gray-600">Slogan: {formData.slogan}</p>
                      )}
                      {formData.collectsDonations !== null && (
                        <p className="text-gray-600">
                          Collects Donations: {formData.collectsDonations ? "Yes" : "No"}
                        </p>
                      )}
                      {formData.collectsDonations && formData.donationPlatform && (
                        <p className="text-gray-600">
                          Donation Platform: {formData.donationPlatform === "other" ? formData.otherDonationPlatform : formData.donationPlatform}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 
                        className="font-medium text-gray-700 cursor-pointer hover:text-[#006699] transition-colors flex items-center"
                        onClick={() => setStep(3)}
                      >
                        Store Customization (Edit)
                        <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
                      </h4>
                      <p className="text-gray-600">
                        Logo: {formData.logo ? "✓ Uploaded" : "✗ Not uploaded"}
                      </p>
                      <p className="text-gray-600">
                        Banner: {bannerMode === "full" ? (banner ? "✓ Uploaded" : "✗ Not uploaded") : `✓ ${bannerImages.length} image${bannerImages.length !== 1 ? "s" : ""} (collage)`}
                      </p>
                    </div>
                  </div>
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
                    className="bg-[#006699] hover:bg-[#005588] text-white"
                    disabled={isSubmitting}
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
              Our team is here to assist you with your store setup.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="text-[#006699] border-[#006699]"
                onClick={() => window.open("https://parishmart.com/pages/contact", "_blank")}
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
