import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Upload, Check, Eye, ArrowRight, Crown, Globe, Info } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

interface FormData {
  adminFullName: string;
  email: string;
  billingAddress: string;
  phoneNumber: string;
  organizationName: string;
  organizationType: string;
  description: string;
  logo: File | null;
  photos: File[];
  primaryColor: string;
  secondaryColor: string;
  subscriptionTier: "basic" | "premium" | "elite";
  needsConsultation: boolean;
  taxExemptionForm: File | null;
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
    adminFullName: "",
    email: "",
    billingAddress: "",
    phoneNumber: "",
    organizationName: "",
    organizationType: "parish",
    description: "",
    logo: null,
    photos: [],
    primaryColor: "#006699",
    secondaryColor: "#ffffff",
    subscriptionTier: "basic",
    needsConsultation: false,
    taxExemptionForm: null,
  });

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

  const colorOptions = [
    { name: "Blue", primary: "#006699", secondary: "#e6f7ff" },
    { name: "Green", primary: "#2e7d32", secondary: "#e8f5e9" },
    { name: "Purple", primary: "#673ab7", secondary: "#ede7f6" },
    { name: "Red", primary: "#d32f2f", secondary: "#ffebee" },
    { name: "Orange", primary: "#ed6c02", secondary: "#fff3e0" },
    { name: "Teal", primary: "#00796b", secondary: "#e0f2f1" },
  ];

  const [products, setProducts] = useState([
    // { name: '', category: '', description: '', images: [], promotionalHook: '', pricingInfo: '' }
  ]);
  const [productImagePreviews, setProductImagePreviews] = useState({});

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

  const handleColorChange = (primary: string, secondary: string) => {
    setFormData({
      ...formData,
      primaryColor: primary,
      secondaryColor: secondary,
    });
  };

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
    setAttemptedSteps([1, 2, 3, 4]);

    // Validate all required fields
    if (
      !formData.adminFullName ||
      !formData.email ||
      !formData.billingAddress ||
      !formData.organizationName ||
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

    setIsSubmitting(true);

    try {
      // Send form data to API endpoint
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationType: 'store',
          ...formData,
          hasTaxExemptStatus,
          products,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      console.log("Form submitted:", formData);
      alert("Registration successful! Your store is being set up.");
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
      if (!formData.adminFullName || !formData.email) {
        return;
      }
    } else if (step === 2) {
      if (!formData.organizationName) {
        return;
      }
    } else if (step === 4 && formData.subscriptionTier === "elite") {
      if (!formData.logo) {
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

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const addProduct = () => {
    if (products.length >= 10) return;
    setProducts([
      ...products,
      { name: '', category: '', description: '', images: [], promotionalHook: '', pricingInfo: '' },
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
    "Other (Please specify)",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
                <span className="mt-2 text-sm font-medium">Final Steps</span>
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
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Organization Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="w-full h-32" placeholder="Tell us about your organization and mission..." />
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
                  </div>
                  {/* Right: Administrator Info */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Administrator Information</h3>
                    <Label htmlFor="adminFullName" className="block text-sm font-medium text-gray-700 mb-1">Administrator Full Name *</Label>
                    <Input id="adminFullName" name="adminFullName" value={formData.adminFullName} onChange={handleInputChange} required className={`w-full ${!formData.adminFullName && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                    {!formData.adminFullName && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">Full name is required</p>)}
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className={`w-full ${!formData.email && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                    {!formData.email && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">Email is required</p>)}
                    <p className="mt-1 text-sm text-gray-500">We'll send your login credentials to this email</p>
                    <Label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Billing Address *</Label>
                    <Input id="billingAddress" name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} required className={`w-full ${!formData.billingAddress && attemptedSteps.includes(1) ? "border-red-500" : ""}`} />
                    {!formData.billingAddress && attemptedSteps.includes(1) && (<p className="mt-1 text-sm text-red-500">Billing address is required</p>)}
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
                    <p className="text-2xl font-bold mb-2">$9.99<span className="text-sm font-normal">/month</span></p>
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
                    <p className="text-2xl font-bold mb-2">$39.99<span className="text-sm font-normal">/month</span></p>
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
                    <p className="text-2xl font-bold mb-2">$49.99<span className="text-sm font-normal">/month</span></p>
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

                {/* Logo Upload Section */}
                <div className="mb-8">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Store Logo *
                  </Label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className={`border-2 border-dashed ${!formData.logo && attemptedSteps.includes(4) ? "border-red-500" : "border-gray-300"} rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors`}>
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <label htmlFor="logo" className="cursor-pointer flex flex-col items-center">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Click to upload your logo</span>
                          <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                        </label>
                      </div>
                      {!formData.logo && attemptedSteps.includes(4) && (
                        <p className="mt-1 text-sm text-red-500">Logo is required</p>
                      )}
                    </div>
                    {logoPreview && (
                      <div className="w-24 h-24 relative border rounded-lg overflow-hidden">
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Upload Section */}
                <div className="mb-8">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Store Banner
                  </Label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="file"
                          id="banner"
                          accept="image/*"
                          onChange={handleBannerChange}
                          className="hidden"
                        />
                        <label htmlFor="banner" className="cursor-pointer flex flex-col items-center">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Click to upload your banner</span>
                          <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                        </label>
                      </div>
                    </div>
                    {bannerPreview && (
                      <div className="w-48 h-24 relative border rounded-lg overflow-hidden">
                        <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                      </div>
                    )}
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
                            {/* Product Images Upload */}
                            <div className="mb-4">
                              <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Product/Service Image(s) *
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
                                    Click to upload product/service images
                                  </span>
                                  <span className="text-xs text-gray-400 mt-1">
                                    PNG, JPG, GIF up to 5MB each (multiple files allowed)
                                  </span>
                                </label>
                              </div>
                              {productImagePreviews[productIndex] && productImagePreviews[productIndex].length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                  {productImagePreviews[productIndex].map((preview, imageIndex) => (
                                    <div key={imageIndex} className="relative group">
                                      <div className="w-full h-24 border rounded-lg overflow-hidden">
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
                                  ))}
                                </div>
                              )}
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
                                Pricing Information
                              </Label>
                              <Input
                                id={`pricing-info-${productIndex}`}
                                value={product.pricingInfo}
                                onChange={(e) => updateProduct(productIndex, "pricingInfo", e.target.value)}
                                className="w-full"
                                placeholder="e.g., $19.99 per item, $50-100 per service, Starting at $29.99"
                              />
                              <p className="mt-1 text-sm text-gray-500">
                                Provide general pricing information for your products/services
                              </p>
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
                    type="submit"
                    className="bg-[#006699] hover:bg-[#005588] text-white"
                    disabled={
                      isSubmitting ||
                      (formData.subscriptionTier === "elite" &&
                        (!formData.logo || !formData.organizationName))
                    }
                  >
                    {isSubmitting ? "Processing..." : "Complete Registration"}
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
