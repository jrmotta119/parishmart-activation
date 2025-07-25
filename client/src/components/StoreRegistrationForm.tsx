import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Upload, Check, Eye, ArrowRight, Crown, Globe, Info } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";

interface FormData {
  adminFirstName: string;
  adminLastName: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
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
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phoneNumber: "",
    organizationName: "",
    organizationType: "parish",
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
  });
  // primaryColor: "#006699",
  // secondaryColor: "#ffffff",

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptedSteps, setAttemptedSteps] = useState<number[]>([]);

  const [customPrimaryColor, setCustomPrimaryColor] = useState("#006699");
  const [customSecondaryColor, setCustomSecondaryColor] = useState("#e6f7ff");

  const [hasTaxExemptStatus, setHasTaxExemptStatus] = useState<string>("");

  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const colorOptions = [
    { name: "Blue", primary: "#006699", secondary: "#e6f7ff" },
    { name: "Green", primary: "#2e7d32", secondary: "#e8f5e9" },
    { name: "Purple", primary: "#673ab7", secondary: "#ede7f6" },
    { name: "Red", primary: "#d32f2f", secondary: "#ffebee" },
    { name: "Orange", primary: "#ed6c02", secondary: "#fff3e0" },
    { name: "Teal", primary: "#00796b", secondary: "#e0f2f1" },
  ];

  const [products, setProducts] = useState([
    // { name: '', category: '', description: '', images: [], videos: [], promotionalHook: '', pricingInfo: '' }
  ]);
  const [productImagePreviews, setProductImagePreviews] = useState({});
  const [productVideoPreviews, setProductVideoPreviews] = useState({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubscriptionChange = (tier: "basic" | "premium" | "elite") => {
    setFormData({ ...formData, subscriptionTier: tier });
  };

  const handleConsultationChange = (needsConsultation: boolean) => {
    setFormData({ ...formData, needsConsultation });
  };

  const handleTaxExemptionFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setFormData({ ...formData, taxExemptionForm: file });
      } else {
        alert('Please upload a PDF file');
        e.target.value = ''; // Reset the input
      }
    }
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
      !formData.state ||
      !formData.country ||
      !formData.zipCode ||
      !formData.organizationName ||
      !formData.impact ||
      !formData.foundingYear ||
      hasTaxExemptStatus === ""
    ) {
      alert("Please fill in all required fields");
      return;
    }
    if (hasTaxExemptStatus === "yes" && !formData.taxExemptionForm) {
      alert("Please upload your tax exemption form");
      return;
    }

    // Validate elite subscription requirements
    if (formData.subscriptionTier === "elite" && !formData.logo) {
      alert("Please upload your organization logo");
      return;
    }

    const invalidProducts = products.filter(
      (product) => !product.name || !product.category || (product.category === 'Other' && !product.otherCategory) || !product.description || !product.pricingInfo
    );

    if (invalidProducts.length > 0) {
      alert("Please fill in all required fields for each product");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add registration type
      submitData.append('registrationType', 'store');
      
      // Add tax exemption status
      submitData.append('hasTaxExemptStatus', hasTaxExemptStatus);
      
      // Add products
      submitData.append('products', JSON.stringify(products));
      
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
        } else if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
          submitData.append(key, value.toString());
        }
      });
      
      // Add banner image
      if (banner) {
        submitData.append('banner', banner);
      }
      
      // Handle product files for elite subscription
      if (formData.subscriptionTier === 'elite' && products.length > 0) {
        products.forEach((product, productIndex) => {
          if (product.images && product.images.length > 0) {
            product.images.forEach((image: File) => {
              submitData.append(`productImages_${productIndex}`, image);
            });
          }
          if (product.videos && product.videos.length > 0) {
            product.videos.forEach((video: File) => {
              submitData.append(`productVideos_${productIndex}`, video);
            });
          }
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
      if (!formData.adminFirstName || !formData.adminLastName || !formData.email || 
          !formData.streetAddress || !formData.city || !formData.state || !formData.country || !formData.zipCode ||
          !formData.organizationName || !formData.description || 
          !formData.impact || !formData.foundingYear ||
          (formData.organizationType === "other" && !formData.otherOrganizationType)) {
        return;
      }
    } else if (step === 2) {
      if (!formData.organizationName) {
        return;
      }
    } else if (step === 3) {
      if (!formData.logo || !banner) {
        return;
      }
    } else if (step === 4) {
      // Validate products if elite subscription
      if (formData.subscriptionTier === "elite" && products.length > 0) {
        const invalidProducts = products.filter(
          (product) => !product.name || !product.category || (product.category === 'Other' && !product.otherCategory) || !product.description || !product.pricingInfo
        );
        if (invalidProducts.length > 0) {
          return;
        }
      }
    }

    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const addProduct = () => {
    if (products.length >= 10) return;
    setProducts([
      ...products,
      { name: '', category: '', description: '', images: [], videos: [], promotionalHook: '', pricingInfo: '' },
    ]);
  };
  const removeProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
    setProductImagePreviews((prev) => {
      const updatedPreviews = { ...prev };
      delete updatedPreviews[index];
      return updatedPreviews;
    });
  };
  const updateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };
  const handleProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>, productIndex: number) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5);
      const updated = [...products];
      updated[productIndex].images = [
        ...(updated[productIndex].images || []),
        ...filesArray,
      ].slice(0, 5);
      setProducts(updated);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setProductImagePreviews((prev) => {
        const currentPreviews = prev[productIndex] || [];
        return {
          ...prev,
          [productIndex]: [...currentPreviews, ...newPreviews].slice(0, 5),
        };
      });
    }
  };
  const handleProductVideoChange = (e: React.ChangeEvent<HTMLInputElement>, productIndex: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file size must be less than 50MB');
        e.target.value = '';
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('Please upload a valid video file');
        e.target.value = '';
        return;
      }

      const updated = [...products];
      updated[productIndex].videos = [file]; // Only allow one video
      setProducts(updated);
      
      const videoPreview = URL.createObjectURL(file);
      setProductVideoPreviews((prev) => ({
        ...prev,
        [productIndex]: videoPreview,
      }));
    }
  };
  const removeProductImage = (productIndex, imageIndex) => {
    const updated = [...products];
    updated[productIndex].images.splice(imageIndex, 1);
    setProducts(updated);
    setProductImagePreviews((prev) => {
      const updatedPreviews = { ...prev };
      if (updatedPreviews[productIndex]) {
        const previewsArray = [...updatedPreviews[productIndex]];
        previewsArray.splice(imageIndex, 1);
        updatedPreviews[productIndex] = previewsArray;
      }
      return updatedPreviews;
    });
  };
  const removeProductVideo = (productIndex) => {
    const updated = [...products];
    updated[productIndex].videos = [];
    setProducts(updated);
    setProductVideoPreviews((prev) => {
      const updatedPreviews = { ...prev };
      delete updatedPreviews[productIndex];
      return updatedPreviews;
    });
  };
  const handleBulkUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      // CSV parsing logic placeholder
      alert(`CSV file received: ${e.target.files[0].name}`);
    }
  };
  const productCategories = [
    "Clothing & Apparel",
    "Food & Beverages",
    "Educational Resources",
    "Home & Living",
    "Religious Items",
    "Services",
    "Technology & Electronics",
    "Beauty & Personal Care",
    "Sports, Fun & Travel",
    "Health & Wellness",
    "Pet Supplies",
    "Gifts & Seasonal Items",
    "Custom Merchandise",
    "Other",
  ];

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  Admin & Org Info
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
                  Subscription
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
            {/* Step 1: Admin & Organization Information (Merged) */}
            {step === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Administrator & Organization Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Organization Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Organization Information</h3>
                    <Label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</Label>
                    <Input id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleInputChange} required className={`w-full ${!formData.organizationName && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                    {!formData.organizationName && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">Organization name is required</p>)}
                    <Label htmlFor="organizationType" className="text-sm font-medium text-gray-700 mb-1 mt-4 flex items-center gap-2">
                      Organization Type *
                      <Tooltip text={
                        `
Parish: A local Catholic community.

Church: A local Christian community.

Cause: A non-profit or charitable organization focused on a specific mission or community service.`
                      }>
                        <Info className="h-4 w-4 text-gray-400 hover:text-[#006699]" />
                      </Tooltip>
                    </Label>
                    <select id="organizationType" name="organizationType" value={formData.organizationType} onChange={handleInputChange} required className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent">
                      <option value="parish">Parish</option>
                      <option value="church">Church</option>
                      <option value="cause">Cause</option>
                      <option value="other">Other</option>
                    </select>
                    {formData.organizationType === "other" && (
                      <div className="mt-2">
                        <Label htmlFor="otherOrganizationType" className="block text-sm font-medium text-gray-700 mb-1">
                          Please specify
                        </Label>
                        <Input
                          id="otherOrganizationType"
                          name="otherOrganizationType"
                          value={formData.otherOrganizationType || ""}
                          onChange={handleInputChange}
                          className={`w-full ${!formData.otherOrganizationType && attemptedSteps.includes(1) ? "border-red-500" : ""}`}
                          placeholder="Enter your organization type"
                          required
                        />
                        {!formData.otherOrganizationType && attemptedSteps.includes(1) && (
                          <p className="mt-1 text-sm text-red-500">Please specify your organization type</p>
                        )}
                      </div>
                    )}
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Organization Description *</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      required 
                      className={`w-full h-32 ${!formData.description && attemptedSteps.includes(1) ? "border-red-500" : ""}`} 
                      placeholder="Tell us about your organization and mission..." 
                    />
                    {!formData.description && attemptedSteps.includes(1) && (
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
                      className={`w-full ${!formData.impact && attemptedSteps.includes(1) ? "border-red-500" : ""}`} 
                      placeholder="Brief description of your organization's impact..." 
                    />
                    <div className="flex justify-between items-center mt-1">
                      {!formData.impact && attemptedSteps.includes(1) && (
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
                        }
                      }}
                      required 
                      className={`w-full ${!formData.foundingYear && attemptedSteps.includes(1) ? "border-red-500" : ""}`} 
                      placeholder="YYYY" 
                    />
                    {!formData.foundingYear && attemptedSteps.includes(1) && (
                      <p className="mt-1 text-sm text-red-500">Founding year is required</p>
                    )}
                    {formData.foundingYear && formData.foundingYear.length === 4 && (
                      <p className="mt-1 text-sm text-gray-500">✓ Valid 4-digit year</p>
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
                    {/* Tax Exemption Status Question */}
                    <Label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Does your organization qualify for tax-exempt status as defined by the IRS? *</Label>
                    <div className="flex items-center gap-6 mb-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hasTaxExemptStatus"
                          value="yes"
                          checked={hasTaxExemptStatus === "yes"}
                          onChange={() => setHasTaxExemptStatus("yes")}
                          required
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hasTaxExemptStatus"
                          value="no"
                          checked={hasTaxExemptStatus === "no"}
                          onChange={() => setHasTaxExemptStatus("no")}
                          required
                        />
                        <span>No</span>
                      </label>
                    </div>
                    {hasTaxExemptStatus === "" && attemptedSteps.includes(1) && (
                      <p className="text-sm text-red-500 mb-2">This field is required</p>
                    )}
                    {/* Tax Exemption Form Section (conditional) */}
                    {hasTaxExemptStatus === "yes" && (
                      <>
                        <Label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Tax Exemption Status</Label>
                        <p className="text-sm text-gray-500 mb-2">If your organization has a 501(c)(3) tax exemption status, please upload your documentation here. This is optional and can be added later.</p>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input type="file" id="taxExemptionForm" accept=".pdf" onChange={handleTaxExemptionFormChange} className="hidden" />
                          <label htmlFor="taxExemptionForm" className="cursor-pointer flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Click to upload your tax exemption form</span>
                            <span className="text-xs text-gray-400 mt-1">PDF only, max 5MB</span>
                          </label>
                        </div>
                        {formData.taxExemptionForm && (<p className="mt-2 text-sm text-green-600">✓ Tax exemption form uploaded</p>)}
                      </>
                    )}

                    {/* Donation Collection Question */}
                    <Label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Do you currently collect online donations? *</Label>
                    <div className="flex items-center gap-6 mb-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="collectsDonations"
                          value="yes"
                          checked={formData.collectsDonations === true}
                          onChange={() => setFormData({ ...formData, collectsDonations: true })}
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
                          onChange={() => setFormData({ ...formData, collectsDonations: false, donationPlatform: "", otherDonationPlatform: "" })}
                          required
                        />
                        <span>No</span>
                      </label>
                    </div>
                    {formData.collectsDonations === null && attemptedSteps.includes(1) && (
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
                          onChange={(e) => setFormData({ ...formData, donationPlatform: e.target.value, otherDonationPlatform: e.target.value === "other" ? formData.otherDonationPlatform : "" })}
                          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent"
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
                              onChange={(e) => setFormData({ ...formData, otherDonationPlatform: e.target.value })}
                              className="w-full"
                              placeholder="Enter the name of your donation platform"
                              required
                            />
                          </div>
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
                        <Input id="adminFirstName" name="adminFirstName" value={formData.adminFirstName} onChange={handleInputChange} required className={`w-full ${!formData.adminFirstName && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                        {!formData.adminFirstName && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">First name is required</p>)}
                      </div>
                      <div>
                        <Label htmlFor="adminLastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</Label>
                        <Input id="adminLastName" name="adminLastName" value={formData.adminLastName} onChange={handleInputChange} required className={`w-full ${!formData.adminLastName && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                        {!formData.adminLastName && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">Last name is required</p>)}
                      </div>
                    </div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className={`w-full ${!formData.email && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                    {!formData.email && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">Email is required</p>)}
                    <p className="mt-1 text-sm text-gray-500">We'll send your login credentials to this email</p>
                    
                    <Label className="block text-md font-medium text-gray-700 mb-1 mt-4">Billing Address *</Label>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</Label>
                        <Input id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} required className={`w-full ${!formData.streetAddress && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                        {!formData.streetAddress && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">Street address is required</p>)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</Label>
                          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required className={`w-full ${!formData.city && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                          {!formData.city && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">City is required</p>)}
                        </div>
                        <div>
                          <Label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</Label>
                          <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required className={`w-full ${!formData.state && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                          {!formData.state && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">State is required</p>)}
                        </div>
                        <div>
                          <Label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</Label>
                          <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required className={`w-full ${!formData.country && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                          {!formData.country && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">Country is required</p>)}
                        </div>
                        <div>
                          <Label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</Label>
                          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required className={`w-full ${!formData.zipCode && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                          {!formData.zipCode && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">Zip code is required</p>)}
                        </div>
                      </div>
                    </div>
                    <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full" />
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <Button type="button" onClick={nextStep} className="bg-[#006699] hover:bg-[#005588] text-white">
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Subscription Selection */}
            {step === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Choose Your Subscription
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Basic Tier */}
                  <div
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${formData.subscriptionTier === "basic" ? "border-[#006699] shadow-md" : "border-gray-200"}`}
                    onClick={() => handleSubscriptionChange("basic")}
                  >
                    <h3 className="text-lg font-semibold">Basic</h3>
                    <p className="text-2xl font-bold mb-2">$19.99<span className="text-sm font-normal">/month</span></p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Access to ParishMart marketplace community
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Branded storefront
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Engagement tracking dashboard
                      </li>
                      <li className="flex items-center text-gray-400">
                        <span className="mr-2">✗</span> Donations as a product
                      </li>
                      <li className="flex items-center text-gray-400">
                        <span className="mr-2">✗</span> Customizable products with your branding
                      </li>
                      <li className="flex items-center text-gray-400">
                        <span className="mr-2">✗</span> Upload your exclusive products
                      </li>
                    </ul>
                  </div>
                  {/* Premium Tier */}
                  <div
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${formData.subscriptionTier === "premium" ? "border-[#006699] shadow-md" : "border-gray-200"}`}
                    onClick={() => handleSubscriptionChange("premium")}
                  >
                    <h3 className="text-lg font-semibold">Premium</h3>
                    <p className="text-2xl font-bold mb-2">$59.99<span className="text-sm font-normal">/month</span></p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Access to ParishMart marketplace community
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Branded storefront
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Engagement tracking dashboard
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Donations as a product
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Customizable products with your branding
                      </li>
                      <li className="flex items-center text-gray-400">
                        <span className="mr-2">✗</span> Upload your exclusive products
                      </li>
                    </ul>
                  </div>
                  {/* Elite Tier */}
                  <div
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${formData.subscriptionTier === "elite" ? "border-[#006699] shadow-md" : "border-gray-200"}`}
                    onClick={() => handleSubscriptionChange("elite")}
                  >
                    <h3 className="text-lg font-semibold">Elite</h3>
                    <p className="text-2xl font-bold mb-2">$79.99<span className="text-sm font-normal">/month</span></p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Access to ParishMart marketplace community
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Branded storefront
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Engagement tracking dashboard
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Donations as a product
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Customizable products with your branding
                      </li>
                      <li className="flex items-center">
                        <span className="text-[#006699] font-bold mr-2">✓</span> Upload your exclusive products
                      </li>
                    </ul>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Store Customization
                </h2>

                {/* Logo and Banner Upload Section (side by side) */}
                <div className="mb-8">
                  {/* Titles Row */}
                  <div className="flex flex-row gap-8 justify-center items-end mb-2">
                    <div className="w-44 flex justify-center">
                      <span className="block text-sm font-medium text-gray-700 text-center">Upload Store Logo *</span>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <span className="block text-sm font-medium text-gray-700 text-center">Upload Store Image (for banner creation) *</span>
                    </div>
                  </div>
                  {/* Upload Boxes Row */}
                  <div className="flex flex-row gap-8 justify-center items-end">
                    {/* Logo Upload (Square) */}
                    <div className="flex flex-col items-center w-44">
                      <div className={`w-44 h-44 border-2 border-dashed ${!formData.logo && attemptedSteps.includes(4) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-2`}>
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
                      {!formData.logo && attemptedSteps.includes(4) && (
                        <p className="mt-1 text-xs text-red-500">Logo is required</p>
                      )}
                    </div>
                    {/* Store Images Upload (Banner) */}
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-[500px] h-44 border-2 border-dashed ${!banner && attemptedSteps.includes(4) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-2`}>
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
                      <div className="text-xs text-gray-500 mt-1">Ideal size: 900x225 px</div>
                      {!banner && attemptedSteps.includes(4) && (
                        <p className="mt-1 text-xs text-red-500">At least one store image is required</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Elite tier: Upload Products Section */}
                {formData.subscriptionTier === "elite" && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Upload Products</h3>
                    <div className="flex space-x-2 mb-4">
                      <label className="relative cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-[#006699] text-[#006699] flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Upload in bulk (CSV file)
                        </Button>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleBulkUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </label>
                      <Button
                        type="button"
                        onClick={addProduct}
                        size="sm"
                        className="bg-[#006699] hover:bg-[#005588] text-white"
                        disabled={products.length >= 10}
                      >
                        Add Product
                      </Button>
                    </div>
                    {products.length === 0 ? (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
                        <p className="text-gray-500">
                          No products added yet. Click "Add Product" to get started.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {products.map((product, productIndex) => (
                          <div key={productIndex} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Listing {productIndex + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProduct(productIndex)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                            <div className="mb-4">
                              <Label htmlFor={`product-name-${productIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Product/Service Name *
                              </Label>
                              <Input
                                id={`product-name-${productIndex}`}
                                value={product.name}
                                onChange={(e) => updateProduct(productIndex, "name", e.target.value)}
                                required
                                className="w-full"
                              />
                            </div>
                            <div className="mb-4">
                              <Label htmlFor={`product-category-${productIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Category of Your Product/Service *
                              </Label>
                              <select
                                id={`product-category-${productIndex}`}
                                value={product.category}
                                onChange={(e) => updateProduct(productIndex, "category", e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent"
                              >
                                <option value="">Select a category</option>
                                {productCategories.map((category) => (
                                  <option key={category} value={category}>{category}</option>
                                ))}
                              </select>
                              {product.category === "Other" && (
                                <div className="mt-2">
                                  <Label htmlFor={`other-category-${productIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                    Please specify the category
                                  </Label>
                                  <Input
                                    id={`other-category-${productIndex}`}
                                    value={product.otherCategory || ""}
                                    onChange={e => updateProduct(productIndex, "otherCategory", e.target.value)}
                                    className={`w-full${!product.otherCategory && attemptedSteps.includes(4) ? " border-red-300" : ""}`}
                                    placeholder="Enter the category"
                                    required
                                  />
                                  {!product.otherCategory && attemptedSteps.includes(4) && (
                                    <p className="mt-1 text-sm text-red-500">Category is required</p>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="mb-4">
                              <Label htmlFor={`product-description-${productIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Description of Product/Service *
                              </Label>
                              <Textarea
                                id={`product-description-${productIndex}`}
                                value={product.description}
                                onChange={(e) => updateProduct(productIndex, "description", e.target.value)}
                                required
                                className="w-full h-32"
                                placeholder="Describe your product or service in detail..."
                              />
                            </div>
                            {/* Product Media Upload */}
                            <div className="mb-4">
                              <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Product/Service Media *
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Video Upload - Left Side */}
                                <div>
                                  <Label className="block text-sm font-medium text-gray-600 mb-2">
                                    Video (Optional)
                                  </Label>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4">
                                    <input
                                      type="file"
                                      id={`product-video-${productIndex}`}
                                      accept="video/*"
                                      onChange={(e) => handleProductVideoChange(e, productIndex)}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`product-video-${productIndex}`}
                                      className="cursor-pointer flex flex-col items-center"
                                    >
                                      <svg
                                        className="h-8 w-8 text-gray-400 mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                      </svg>
                                      <span className="text-sm text-gray-500">
                                        Click to upload video
                                      </span>
                                      <span className="text-xs text-gray-400 mt-1">
                                        MP4, MOV, AVI up to 50MB (1 video only)
                                      </span>
                                    </label>
                                  </div>
                                  {productVideoPreviews[productIndex] && (
                                    <div className="relative group">
                                      <div className="w-full h-24 border rounded-lg overflow-hidden">
                                        <video
                                          src={productVideoPreviews[productIndex]}
                                          className="w-full h-full object-cover"
                                          controls
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeProductVideo(productIndex)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Image Upload - Right Side */}
                                <div>
                                  <Label className="block text-sm font-medium text-gray-600 mb-2">
                                    Images (Required)
                                  </Label>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4">
                                    <input
                                      type="file"
                                      id={`product-images-${productIndex}`}
                                      accept="image/*"
                                      multiple
                                      onChange={(e) => handleProductImagesChange(e, productIndex)}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`product-images-${productIndex}`}
                                      className="cursor-pointer flex flex-col items-center"
                                    >
                                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                      <span className="text-sm text-gray-500">
                                        Click to upload images
                                      </span>
                                      <span className="text-xs text-gray-400 mt-1">
                                        PNG, JPG, GIF up to 5MB each (max 5 images)
                                      </span>
                                    </label>
                                  </div>
                                  {productImagePreviews[productIndex] && productImagePreviews[productIndex].length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                      {productImagePreviews[productIndex].map((preview, imageIndex) => (
                                        <div key={imageIndex} className="relative group">
                                          <div className="w-full h-20 border rounded-lg overflow-hidden">
                                            <img
                                              src={preview}
                                              alt={`Listing ${productIndex + 1} Image ${imageIndex + 1}`}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => removeProductImage(productIndex, imageIndex)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-3 w-3"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="mb-4">
                              <Label htmlFor={`promotional-hook-${productIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Promotional Hook Offer
                              </Label>
                              <Input
                                id={`promotional-hook-${productIndex}`}
                                value={product.promotionalHook}
                                onChange={(e) => updateProduct(productIndex, "promotionalHook", e.target.value)}
                                className="w-full"
                                placeholder="e.g., 10% off first purchase, Free shipping on orders over $50"
                              />
                              <p className="mt-1 text-sm text-gray-500">
                                Optional: Add a special offer to attract customers
                              </p>
                            </div>
                            <div className="mb-4">
                              <Label htmlFor={`pricing-info-${productIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Pricing Information *
                              </Label>
                              <Input
                                id={`pricing-info-${productIndex}`}
                                value={product.pricingInfo}
                                onChange={(e) => updateProduct(productIndex, "pricingInfo", e.target.value)}
                                className={`w-full${!product.pricingInfo && attemptedSteps.includes(4) ? " border-red-300" : ""}`}
                                placeholder="e.g., $19.99 per item, $50-100 per service, Starting at $29.99"
                                required
                              />
                              {!product.pricingInfo && attemptedSteps.includes(4) && (
                                <p className="mt-1 text-sm text-red-500">Pricing information is required</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {products.length >= 10 && (
                      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                        <p className="text-amber-700">
                          You have reached the maximum of 10 products allowed. Use bulk upload for more.
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                        Administrator & Organization Information (Edit)
                        <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
                      </h4>
                      <p className="text-gray-600">
                        Name: {formData.adminFirstName} {formData.adminLastName}
                      </p>
                      <p className="text-gray-600">Email: {formData.email}</p>
                      <p className="text-gray-600">Organization: {formData.organizationName}</p>
                      <p className="text-gray-600">Type: {formData.organizationType === "other" ? formData.otherOrganizationType : formData.organizationType}</p>
                      {formData.impact && (
                        <p className="text-gray-600">Impact: {formData.impact}</p>
                      )}
                      {formData.foundingYear && (
                        <p className="text-gray-600">Founded: {formData.foundingYear}</p>
                      )}
                      {formData.slogan && (
                        <p className="text-gray-600">Slogan: {formData.slogan}</p>
                      )}
                      {hasTaxExemptStatus && (
                        <p className="text-gray-600">Tax Exempt Status: {hasTaxExemptStatus === "yes" ? "Yes" : "No"}</p>
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
                        onClick={() => setStep(2)}
                      >
                        Subscription (Edit)
                        <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
                      </h4>
                      <p className="text-gray-600">
                        Subscription:{" "}
                        {formData.subscriptionTier === "basic"
                          ? "Basic"
                          : formData.subscriptionTier === "premium"
                            ? "Premium"
                            : "Elite"}
                      </p>
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
                        Banner: {banner ? "✓ Uploaded" : "✗ Not uploaded"}
                      </p>
                      {formData.subscriptionTier === "elite" && (
                        <div>
                          <p className="text-gray-600">
                            Products: {products.length} product{products.length !== 1 ? 's' : ''} added
                          </p>
                          {products.map((product, index) => (
                            <div key={index} className="mt-2 ml-4">
                              <p className="text-gray-600 font-medium">
                                Product {index + 1}: {product.name}
                              </p>
                              {product.category && (
                                <p className="text-gray-600 text-sm">
                                  Category: {product.category === "Other" ? product.otherCategory : product.category}
                                </p>
                              )}
                              {product.pricingInfo && (
                                <p className="text-gray-600 text-sm">
                                  Pricing: {product.pricingInfo}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
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
