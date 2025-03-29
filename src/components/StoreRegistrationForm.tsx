import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Upload, Check, Eye, ArrowRight, Crown, Globe } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  organizationName: string;
  organizationType: string;
  description: string;
  logo: File | null;
  photos: File[];
  primaryColor: string;
  secondaryColor: string;
  subscriptionTier: "basic" | "elite";
  needsConsultation: boolean;
}

const StoreRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    organizationName: "",
    organizationType: "parish",
    description: "",
    logo: null,
    photos: [],
    primaryColor: "#006699",
    secondaryColor: "#ffffff",
    subscriptionTier: "basic",
    needsConsultation: false,
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptedSteps, setAttemptedSteps] = useState<number[]>([]);

  const [customPrimaryColor, setCustomPrimaryColor] = useState("#006699");
  const [customSecondaryColor, setCustomSecondaryColor] = useState("#e6f7ff");

  const colorOptions = [
    { name: "Blue", primary: "#006699", secondary: "#e6f7ff" },
    { name: "Green", primary: "#2e7d32", secondary: "#e8f5e9" },
    { name: "Purple", primary: "#673ab7", secondary: "#ede7f6" },
    { name: "Red", primary: "#d32f2f", secondary: "#ffebee" },
    { name: "Orange", primary: "#ed6c02", secondary: "#fff3e0" },
    { name: "Teal", primary: "#00796b", secondary: "#e0f2f1" },
  ];

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

  const handleSubscriptionChange = (tier: "basic" | "elite") => {
    setFormData({ ...formData, subscriptionTier: tier });
  };

  const handleConsultationChange = (needsConsultation: boolean) => {
    setFormData({ ...formData, needsConsultation });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all steps as attempted for validation
    setAttemptedSteps([1, 2, 3, 4]);

    // Validate all required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.organizationName
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate elite subscription requirements
    if (formData.subscriptionTier === "elite" && !formData.logo) {
      alert("Please upload your organization logo");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      alert("Registration successful! Your store is being set up.");
      // Redirect to home or dashboard
      window.location.href = "/";
    }, 2000);
  };

  const nextStep = () => {
    // Mark this step as attempted
    if (!attemptedSteps.includes(step)) {
      setAttemptedSteps([...attemptedSteps, step]);
    }

    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
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
                  Administrator Info
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
                  Organization Info
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
                <span className="mt-2 text-sm font-medium">Subscription</span>
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
                <span className="mt-2 text-sm font-medium">Final Steps</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Administrator Information */}
            {step === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Administrator Information
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
                      className={`w-full ${!formData.firstName && attemptedSteps.includes(1) ? "border-red-500" : ""}`}
                    />
                    {!formData.firstName && attemptedSteps.includes(1) && (
                      <p className="mt-1 text-sm text-red-500">
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
                      className={`w-full ${!formData.lastName && attemptedSteps.includes(1) ? "border-red-500" : ""}`}
                    />
                    {!formData.lastName && attemptedSteps.includes(1) && (
                      <p className="mt-1 text-sm text-red-500">
                        Last name is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
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
                    className={`w-full ${!formData.email && attemptedSteps.includes(1) ? "border-red-500" : ""}`}
                  />
                  {!formData.email && attemptedSteps.includes(1) && (
                    <p className="mt-1 text-sm text-red-500">
                      Email is required
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    We'll send your login credentials to this email
                  </p>
                </div>

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

            {/* Step 2: Organization Information */}
            {step === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Organization Information
                </h2>

                <div className="mb-6">
                  <Label
                    htmlFor="organizationName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Organization Name *
                  </Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    required
                    className={`w-full ${!formData.organizationName && attemptedSteps.includes(2) ? "border-red-500" : ""}`}
                  />
                  {!formData.organizationName && attemptedSteps.includes(2) && (
                    <p className="mt-1 text-sm text-red-500">
                      Organization name is required
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <Label
                    htmlFor="organizationType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Organization Type *
                  </Label>
                  <select
                    id="organizationType"
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent"
                  >
                    <option value="parish">Parish</option>
                    <option value="church">Church</option>
                    <option value="non-profit">Non-Profit</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <Label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Organization Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full h-32"
                    placeholder="Tell us about your organization and mission..."
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

            {/* Step 3: Subscription Selection */}
            {step === 3 && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Choose Your Subscription
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Basic Tier */}
                  <div
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${formData.subscriptionTier === "basic" ? "border-[#006699] shadow-md" : "border-gray-200"}`}
                    onClick={() => handleSubscriptionChange("basic")}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-[#006699]" />
                          Basic
                        </h3>
                        <p className="text-2xl font-bold mt-1">
                          $0
                          <span className="text-sm font-normal text-gray-500">
                            /month
                          </span>
                        </p>
                      </div>
                      {formData.subscriptionTier === "basic" && (
                        <div className="bg-[#006699] text-white rounded-full p-1">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-[#006699] mt-1 mr-2 flex-shrink-0" />
                        <span>Direct connection to Parishmart Marketplace</span>
                      </li>
                      <li className="flex items-start text-gray-500">
                        <span className="h-4 w-4 mt-1 mr-2 flex-shrink-0">
                          ✕
                        </span>
                        <span>Personalized storefront</span>
                      </li>
                      <li className="flex items-start text-gray-500">
                        <span className="h-4 w-4 mt-1 mr-2 flex-shrink-0">
                          ✕
                        </span>
                        <span>Curated products and services</span>
                      </li>
                      <li className="flex items-start text-gray-500">
                        <span className="h-4 w-4 mt-1 mr-2 flex-shrink-0">
                          ✕
                        </span>
                        <span>Donations as a product</span>
                      </li>
                      <li className="flex items-start text-gray-500">
                        <span className="h-4 w-4 mt-1 mr-2 flex-shrink-0">
                          ✕
                        </span>
                        <span>Access the marketplace community</span>
                      </li>
                    </ul>
                  </div>

                  {/* Elite Tier */}
                  <div
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${formData.subscriptionTier === "elite" ? "border-[#006699] shadow-md" : "border-gray-200"}`}
                    onClick={() => handleSubscriptionChange("elite")}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <Crown className="h-5 w-5 mr-2 text-[#006699]" />
                          Elite
                        </h3>
                        <p className="text-2xl font-bold mt-1">
                          $200
                          <span className="text-sm font-normal text-gray-500">
                            /month
                          </span>
                        </p>
                      </div>
                      {formData.subscriptionTier === "elite" && (
                        <div className="bg-[#006699] text-white rounded-full p-1">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-[#006699] mt-1 mr-2 flex-shrink-0" />
                        <span>Direct connection to Parishmart Marketplace</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-[#006699] mt-1 mr-2 flex-shrink-0" />
                        <span>Personalized Storefront</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-[#006699] mt-1 mr-2 flex-shrink-0" />
                        <span>Curated products and services</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-[#006699] mt-1 mr-2 flex-shrink-0" />
                        <span>Donations as a product</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-[#006699] mt-1 mr-2 flex-shrink-0" />
                        <span>Access the marketplace community</span>
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

            {/* Step 4: Finalize Steps */}
            {step === 4 && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Store Customization
                </h2>

                {formData.subscriptionTier === "basic" ? (
                  <div className="mb-8 bg-white p-6 rounded-lg border-2 border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Add a ParishMart callout to your website and encourage
                      your community members to support your cause. Would you
                      like our team to contact you for a free consultation on
                      our solutions?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        type="button"
                        onClick={() => handleConsultationChange(true)}
                        className={`flex items-center justify-center h-16 ${formData.needsConsultation ? "bg-[#006699] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        <div className="flex items-center">
                          {formData.needsConsultation && (
                            <Check className="mr-2 h-5 w-5" />
                          )}
                          <span className="font-medium">
                            Yes, please contact me
                          </span>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleConsultationChange(false)}
                        className={`flex items-center justify-center h-16 ${!formData.needsConsultation ? "bg-[#006699] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        <div className="flex items-center">
                          {!formData.needsConsultation && (
                            <Check className="mr-2 h-5 w-5" />
                          )}
                          <span className="font-medium">No, thank you</span>
                        </div>
                      </Button>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                      Our team can guide you on effectively leveraging the
                      ParishMart community to help your organization thrive.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Logo Upload */}
                    <div className="mb-8">
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Logo *
                      </Label>
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div
                            className={`border-2 border-dashed ${!formData.logo && attemptedSteps.includes(4) ? "border-red-500" : "border-gray-300"} rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors`}
                          >
                            <input
                              type="file"
                              id="logo"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="logo"
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <Upload className="h-8 w-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">
                                Click to upload your logo
                              </span>
                              <span className="text-xs text-gray-400 mt-1">
                                PNG, JPG, GIF up to 5MB
                              </span>
                            </label>
                          </div>
                          {!formData.logo && attemptedSteps.includes(4) && (
                            <p className="mt-1 text-sm text-red-500">
                              Logo is required for Elite subscription
                            </p>
                          )}
                        </div>
                        {logoPreview && (
                          <div className="w-24 h-24 relative border rounded-lg overflow-hidden">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Photos Upload */}
                    <div className="mb-8">
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Photos (Up to 5)
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4">
                        <input
                          type="file"
                          id="photos"
                          accept="image/*"
                          multiple
                          onChange={handlePhotosChange}
                          className="hidden"
                          disabled={formData.photos.length >= 5}
                        />
                        <label
                          htmlFor="photos"
                          className={`cursor-pointer flex flex-col items-center ${formData.photos.length >= 5 ? "opacity-50" : ""}`}
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            Click to upload store photos
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            PNG, JPG, GIF up to 5MB each
                          </span>
                        </label>
                      </div>

                      {photosPreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {photosPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <div className="w-full h-24 border rounded-lg overflow-hidden">
                                <img
                                  src={preview}
                                  alt={`Photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
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

                    {/* Color Selection */}
                    <div className="mb-8">
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Colors
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {colorOptions.map((color, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              handleColorChange(color.primary, color.secondary)
                            }
                            className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${formData.primaryColor === color.primary ? "border-[#006699] shadow-md" : "border-gray-200"}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {color.name}
                              </span>
                              {formData.primaryColor === color.primary && (
                                <Check className="h-4 w-4 text-[#006699]" />
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <div
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: color.primary }}
                              ></div>
                              <div
                                className="w-8 h-8 rounded-full border border-gray-200"
                                style={{ backgroundColor: color.secondary }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Color Selection */}
                    <div className="mb-8">
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Colors
                      </Label>
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Primary Color
                            </span>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-8 h-8 rounded-full border border-gray-200"
                                style={{ backgroundColor: customPrimaryColor }}
                              ></div>
                              <span className="text-sm font-mono">
                                {customPrimaryColor}
                              </span>
                            </div>
                          </div>
                          <input
                            type="color"
                            value={customPrimaryColor}
                            onChange={(e) => {
                              setCustomPrimaryColor(e.target.value);
                              handleColorChange(
                                e.target.value,
                                customSecondaryColor,
                              );
                            }}
                            className="w-full h-10 cursor-pointer rounded"
                          />
                          <div className="mt-2">
                            <Label
                              htmlFor="primaryHex"
                              className="text-xs text-gray-500"
                            >
                              Hex Value
                            </Label>
                            <div className="flex items-center mt-1">
                              <Input
                                id="primaryHex"
                                value={customPrimaryColor}
                                onChange={(e) => {
                                  setCustomPrimaryColor(e.target.value);
                                  handleColorChange(
                                    e.target.value,
                                    customSecondaryColor,
                                  );
                                }}
                                className="font-mono text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Secondary Color
                            </span>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-8 h-8 rounded-full border border-gray-200"
                                style={{
                                  backgroundColor: customSecondaryColor,
                                }}
                              ></div>
                              <span className="text-sm font-mono">
                                {customSecondaryColor}
                              </span>
                            </div>
                          </div>
                          <input
                            type="color"
                            value={customSecondaryColor}
                            onChange={(e) => {
                              setCustomSecondaryColor(e.target.value);
                              handleColorChange(
                                customPrimaryColor,
                                e.target.value,
                              );
                            }}
                            className="w-full h-10 cursor-pointer rounded"
                          />
                          <div className="mt-2">
                            <Label
                              htmlFor="secondaryHex"
                              className="text-xs text-gray-500"
                            >
                              Hex Value
                            </Label>
                            <div className="flex items-center mt-1">
                              <Input
                                id="secondaryHex"
                                value={customSecondaryColor}
                                onChange={(e) => {
                                  setCustomSecondaryColor(e.target.value);
                                  handleColorChange(
                                    customPrimaryColor,
                                    e.target.value,
                                  );
                                }}
                                className="font-mono text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button
                            type="button"
                            onClick={() =>
                              handleColorChange(
                                customPrimaryColor,
                                customSecondaryColor,
                              )
                            }
                            className="w-full bg-[#006699] hover:bg-[#005588] text-white"
                          >
                            Apply Custom Colors
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Preview Button */}
                    <div className="mb-8">
                      <Button
                        type="button"
                        onClick={togglePreview}
                        variant="outline"
                        className="w-full border-[#006699] text-[#006699] flex items-center justify-center"
                        disabled={!formData.logo || !formData.organizationName}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {showPreview ? "Hide Preview" : "Preview Your Store"}
                      </Button>
                    </div>

                    {/* Store Preview */}
                    {showPreview && formData.logo && (
                      <div className="mb-8 border rounded-lg overflow-hidden">
                        <div className="p-4 text-center bg-gray-50 border-b">
                          <h3 className="font-medium">Store Preview</h3>
                        </div>
                        <div className="p-4">
                          {/* Header Preview */}
                          <div
                            className="bg-white shadow-sm p-4 flex items-center justify-between rounded-t-lg"
                            style={{ backgroundColor: formData.secondaryColor }}
                          >
                            <div className="flex items-center">
                              <img
                                src={logoPreview}
                                alt="Logo"
                                className="h-10 w-auto mr-2"
                              />
                              <span
                                className="font-bold"
                                style={{ color: formData.primaryColor }}
                              >
                                {formData.organizationName}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                            </div>
                          </div>

                          {/* Hero Preview */}
                          <div
                            className="h-32 relative overflow-hidden rounded-b-lg"
                            style={{ backgroundColor: formData.primaryColor }}
                          >
                            {photosPreviews.length > 0 && (
                              <div className="absolute inset-0">
                                <img
                                  src={photosPreviews[0]}
                                  alt="Hero background"
                                  className="w-full h-full object-cover opacity-50"
                                />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center text-white">
                              <div className="text-center">
                                <h2 className="text-xl font-bold mb-2">
                                  {formData.organizationName}
                                </h2>
                                <p className="text-sm">
                                  {formData.description ||
                                    "Shop with purpose, serve with love"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Content Preview */}
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {photosPreviews.length > 1 ? (
                              photosPreviews
                                .slice(1, 5)
                                .map((preview, index) => {
                                  const pageLabels = [
                                    "Store",
                                    "About",
                                    "Contact",
                                    "FAQ",
                                  ];
                                  return (
                                    <div
                                      key={index}
                                      className="h-20 rounded-lg overflow-hidden relative"
                                    >
                                      <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                        <span className="text-white font-medium">
                                          {pageLabels[index]}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })
                            ) : (
                              <div className="col-span-2 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-sm text-gray-400">
                                  Add photos to see them in the preview
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
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
              >
                Contact Support
              </Button>
              <Button variant="link" className="text-[#006699]">
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoreRegistrationForm;
