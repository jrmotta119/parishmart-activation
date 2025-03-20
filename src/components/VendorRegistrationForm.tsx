import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Upload,
  ArrowRight,
  CheckCircle,
  XCircle,
  Info,
  Plus,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  parishAffiliation: string;
  communityContribution: string;
  businessName: string;
  businessType: "product" | "service" | "both";
  businessDescription: string;
  logo: File | null;
  websiteLinks: string;
  subscriptionType: "basic" | "premium" | "elite";
  contactEmail: string;
  contactPhone: string;
  products: {
    name: string;
    category: string;
    description: string;
    images: File[];
    promotionalHook: string;
    pricingInfo: string;
  }[];
  participateInCampaigns: boolean;
  receiveUpdates: boolean;
}

const VendorRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    parishAffiliation: "",
    communityContribution: "",
    businessName: "",
    businessType: "product",
    businessDescription: "",
    logo: null,
    websiteLinks: "",
    subscriptionType: "basic",
    contactEmail: "",
    contactPhone: "",
    products: [],
    participateInCampaigns: true,
    receiveUpdates: true,
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [productImagePreviews, setProductImagePreviews] = useState<{
    [key: number]: string[];
  }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parishes = [
    "St. Mary's Parish",
    "St. Joseph's Church",
    "Holy Trinity Parish",
    "Sacred Heart Church",
    "St. Patrick's Cathedral",
    "Our Lady of Perpetual Help",
    "St. Francis of Assisi",
    "Christ the King Parish",
    "Immaculate Conception Church",
    "St. Thomas Aquinas Parish",
  ];

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

  const handleProductImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productIndex: number,
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5);
      const updatedProducts = [...formData.products];

      if (!updatedProducts[productIndex].images) {
        updatedProducts[productIndex].images = [];
      }

      updatedProducts[productIndex].images = [
        ...updatedProducts[productIndex].images,
        ...filesArray,
      ].slice(0, 5);
      setFormData({
        ...formData,
        products: updatedProducts,
      });

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

  const removeProductImage = (productIndex: number, imageIndex: number) => {
    const updatedProducts = [...formData.products];
    updatedProducts[productIndex].images.splice(imageIndex, 1);
    setFormData({
      ...formData,
      products: updatedProducts,
    });

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

  const addProduct = () => {
    if (
      formData.subscriptionType === "premium" &&
      formData.products.length >= 3
    ) {
      setToastMessage("You can only add 3 products with the Premium package");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          name: "",
          category: "",
          description: "",
          images: [],
          promotionalHook: "",
          pricingInfo: "",
        },
      ],
    });
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...formData.products];
    updatedProducts.splice(index, 1);
    setFormData({
      ...formData,
      products: updatedProducts,
    });

    setProductImagePreviews((prev) => {
      const updatedPreviews = { ...prev };
      delete updatedPreviews[index];
      return updatedPreviews;
    });
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      products: updatedProducts,
    });
  };

  const handleRadioChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle subscription type change
  const handleSubscriptionChange = (type: "basic" | "premium" | "elite") => {
    // Always update the subscription type first
    let updatedProducts = [...formData.products];
    let message = "";

    if (type === "basic") {
      // Basic subscription doesn't allow products
      if (formData.products.length > 0) {
        updatedProducts = [];
        message = "Basic subscription doesn't include product listings";
      }
    } else if (type === "premium") {
      // Premium subscription allows max 3 products
      if (formData.products.length > 3) {
        updatedProducts = formData.products.slice(0, 3);
        message = "Premium subscription allows up to 3 products";
      }
    }

    // Update form data with new subscription type and adjusted products
    setFormData({
      ...formData,
      subscriptionType: type,
      products: updatedProducts,
    });

    // Show toast message if needed
    if (message) {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      alert("Registration successful! Your vendor account is being set up.");
      // Redirect to home or dashboard
      window.location.href = "/";
    }, 2000);
  };

  // We don't need this useEffect anymore as the logic is handled in handleSubscriptionChange
  // This was causing issues with the subscription type not updating properly

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        setToastMessage("Please fill in all required fields");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    } else if (step === 2) {
      if (
        !formData.businessName ||
        !formData.businessDescription ||
        !formData.logo
      ) {
        setToastMessage("Please fill in all required fields and upload a logo");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    } else if (step === 4) {
      if (!formData.contactEmail || !formData.contactPhone) {
        setToastMessage("Please provide contact information");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      // Validate products if not basic subscription
      if (
        formData.subscriptionType !== "basic" &&
        formData.products.length > 0
      ) {
        const invalidProducts = formData.products.filter(
          (product) =>
            !product.name || !product.category || !product.description,
        );

        if (invalidProducts.length > 0) {
          setToastMessage("Please complete all product information");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
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

  return (
    <>
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-amber-50 border-l-4 border-amber-500 p-4 rounded shadow-md max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
                    Personal Info
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
                    Business Info
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
                    Subscriptions
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
                  <span className="mt-2 text-sm font-medium">
                    Products & Services
                  </span>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${step >= 5 ? "bg-[#006699]" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`flex flex-col items-center ${step >= 5 ? "text-[#006699]" : "text-gray-400"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 5 ? "bg-[#006699] text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    5
                  </div>
                  <span className="mt-2 text-sm font-medium">Submission</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h2>

                  <div className="mb-6">
                    <Label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
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
                        className="w-full"
                      />
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
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-1">
                      <Label
                        htmlFor="parishAffiliation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Parish/Non-profit Affiliation
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="ml-2 cursor-help">
                              <Info className="h-4 w-4 text-gray-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              Selecting a parish helps donate a percentage of
                              your sales to support their mission.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select
                      onValueChange={(value) =>
                        setFormData({ ...formData, parishAffiliation: value })
                      }
                      value={formData.parishAffiliation}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a parish or non-profit (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {parishes.map((parish) => (
                          <SelectItem key={parish} value={parish}>
                            {parish}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-sm text-gray-500">
                      A percentage of your sales will be donated to your
                      selected parish
                    </p>
                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="communityContribution"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      How do you contribute to your community or parish?
                    </Label>
                    <Textarea
                      id="communityContribution"
                      name="communityContribution"
                      value={formData.communityContribution}
                      onChange={handleInputChange}
                      className="w-full h-32"
                      placeholder="Tell us about your community involvement (optional)"
                    />
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

              {/* Step 2: Business Information */}
              {step === 2 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Business Information
                  </h2>

                  <div className="mb-6">
                    <Label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="mb-6">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                    </Label>
                    <RadioGroup
                      value={formData.businessType}
                      onValueChange={(value) =>
                        handleRadioChange("businessType", value)
                      }
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
                          Service Provider – (Offers services like teaching,
                          repairs, etc.)
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

                  <div className="mb-6">
                    <Label
                      htmlFor="businessDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Business Description *
                    </Label>
                    <Textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      required
                      className="w-full h-32"
                      placeholder="Describe your business in detail..."
                    />
                  </div>

                  {/* Logo Upload */}
                  <div className="mb-6">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Your Business Logo *
                    </Label>
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            required={!formData.logo}
                          />
                          <label
                            htmlFor="logo"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Click to upload your business logo
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              PNG, JPG, GIF up to 5MB
                            </span>
                          </label>
                        </div>
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

                  <div className="mb-6">
                    <Label
                      htmlFor="websiteLinks"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Website or Social Media Links
                    </Label>
                    <Input
                      id="websiteLinks"
                      name="websiteLinks"
                      value={formData.websiteLinks}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="https://yourwebsite.com, instagram.com/yourbusiness"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Optional: Add your website or social media links separated
                      by commas
                    </p>
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
                    Choose Your Subscription Plan
                  </h2>

                  <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card
                        className={`cursor-pointer transition-all ${formData.subscriptionType === "basic" ? "border-2 border-[#006699] shadow-md" : "border border-gray-200"}`}
                        onClick={() => handleSubscriptionChange("basic")}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="basic"
                                name="subscriptionType"
                                value="basic"
                                checked={formData.subscriptionType === "basic"}
                                onChange={() =>
                                  handleSubscriptionChange("basic")
                                }
                                className="h-4 w-4 text-[#006699] focus:ring-[#006699]"
                              />
                            </div>
                            <Label
                              htmlFor="basic"
                              className="cursor-pointer ml-2"
                            >
                              Basic
                            </Label>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold mb-2">
                            $9.99
                            <span className="text-sm font-normal">/month</span>
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Business listing
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Contact information
                            </li>
                            <li className="flex items-center text-gray-400">
                              <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                              Product listings
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all ${formData.subscriptionType === "premium" ? "border-2 border-[#006699] shadow-md" : "border border-gray-200"}`}
                        onClick={() => handleSubscriptionChange("premium")}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="premium"
                                name="subscriptionType"
                                value="premium"
                                checked={
                                  formData.subscriptionType === "premium"
                                }
                                onChange={() =>
                                  handleSubscriptionChange("premium")
                                }
                                className="h-4 w-4 text-[#006699] focus:ring-[#006699]"
                              />
                            </div>
                            <Label
                              htmlFor="premium"
                              className="cursor-pointer ml-2"
                            >
                              Premium
                            </Label>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold mb-2">
                            $29.99
                            <span className="text-sm font-normal">/month</span>
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Business listing
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Contact information
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Up to 3 product listings
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all ${formData.subscriptionType === "elite" ? "border-2 border-[#006699] shadow-md" : "border border-gray-200"}`}
                        onClick={() => handleSubscriptionChange("elite")}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="elite"
                                name="subscriptionType"
                                value="elite"
                                checked={formData.subscriptionType === "elite"}
                                onChange={() =>
                                  handleSubscriptionChange("elite")
                                }
                                className="h-4 w-4 text-[#006699] focus:ring-[#006699]"
                              />
                            </div>
                            <Label
                              htmlFor="elite"
                              className="cursor-pointer ml-2"
                            >
                              Elite
                            </Label>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold mb-2">
                            $49.99
                            <span className="text-sm font-normal">/month</span>
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Business listing
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Contact information
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Unlimited product listings
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Featured placement
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
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

              {/* Step 4: Products & Services */}
              {step === 4 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Contact Information & Products
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label
                          htmlFor="contactEmail"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Contact Email *
                        </Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="customer-service@yourbusiness.com"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="contactPhone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Contact Phone *
                        </Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.subscriptionType === "basic" ? (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <p className="text-gray-700">
                        Based on the current subscription selected, you are only
                        eligible to list your business. Upgrade to Premium if
                        you would like to add any products.
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">
                          Products & Services
                        </h3>
                        <Button
                          type="button"
                          onClick={addProduct}
                          size="sm"
                          className="bg-[#006699] hover:bg-[#005588] text-white"
                        >
                          Add Product
                        </Button>
                      </div>

                      {formData.products.length === 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
                          <p className="text-gray-500">
                            No products added yet. Click "Add Product" to get
                            started.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {formData.products.map((product, productIndex) => (
                            <div
                              key={productIndex}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium">
                                  Product {productIndex + 1}
                                </h4>
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
                                <Label
                                  htmlFor={`product-name-${productIndex}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Product/Service Name *
                                </Label>
                                <Input
                                  id={`product-name-${productIndex}`}
                                  value={product.name}
                                  onChange={(e) =>
                                    updateProduct(
                                      productIndex,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  required
                                  className="w-full"
                                />
                              </div>

                              <div className="mb-4">
                                <Label
                                  htmlFor={`product-category-${productIndex}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Category of Your Product/Service *
                                </Label>
                                <Select
                                  onValueChange={(value) =>
                                    updateProduct(
                                      productIndex,
                                      "category",
                                      value,
                                    )
                                  }
                                  value={product.category}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {productCategories.map((category) => (
                                      <SelectItem
                                        key={category}
                                        value={category}
                                      >
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="mb-4">
                                <Label
                                  htmlFor={`product-description-${productIndex}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Description of Product/Service *
                                </Label>
                                <Textarea
                                  id={`product-description-${productIndex}`}
                                  value={product.description}
                                  onChange={(e) =>
                                    updateProduct(
                                      productIndex,
                                      "description",
                                      e.target.value,
                                    )
                                  }
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
                                    onChange={(e) =>
                                      handleProductImagesChange(e, productIndex)
                                    }
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
                                      PNG, JPG, GIF up to 5MB each (multiple
                                      files allowed)
                                    </span>
                                  </label>
                                </div>

                                {productImagePreviews[productIndex] &&
                                  productImagePreviews[productIndex].length >
                                    0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                      {productImagePreviews[productIndex].map(
                                        (preview, imageIndex) => (
                                          <div
                                            key={imageIndex}
                                            className="relative group"
                                          >
                                            <div className="w-full h-24 border rounded-lg overflow-hidden">
                                              <img
                                                src={preview}
                                                alt={`Product ${productIndex + 1} Image ${imageIndex + 1}`}
                                                className="w-full h-full object-cover"
                                              />
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeProductImage(
                                                  productIndex,
                                                  imageIndex,
                                                )
                                              }
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
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>

                              <div className="mb-4">
                                <Label
                                  htmlFor={`promotional-hook-${productIndex}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Promotional Hook Offer
                                </Label>
                                <Input
                                  id={`promotional-hook-${productIndex}`}
                                  value={product.promotionalHook}
                                  onChange={(e) =>
                                    updateProduct(
                                      productIndex,
                                      "promotionalHook",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full"
                                  placeholder="e.g., 10% off first purchase, Free shipping on orders over $50"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                  Optional: Add a special offer to attract
                                  customers
                                </p>
                              </div>

                              <div className="mb-4">
                                <Label
                                  htmlFor={`pricing-info-${productIndex}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Pricing Information
                                </Label>
                                <Input
                                  id={`pricing-info-${productIndex}`}
                                  value={product.pricingInfo}
                                  onChange={(e) =>
                                    updateProduct(
                                      productIndex,
                                      "pricingInfo",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full"
                                  placeholder="e.g., $19.99 per item, $50-100 per service, Starting at $29.99"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                  Provide general pricing information for your
                                  products/services
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {formData.subscriptionType === "premium" &&
                        formData.products.length >= 3 && (
                          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                            <p className="text-amber-700">
                              You have reached the maximum of 3 products allowed
                              with the Premium package. Upgrade to Elite for
                              unlimited products.
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
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Final Submission */}
              {step === 5 && (
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
                        <h4 className="font-medium text-gray-700">
                          Personal Information
                        </h4>
                        <p className="text-gray-600">
                          Name: {formData.fullName}
                        </p>
                        <p className="text-gray-600">Email: {formData.email}</p>
                        <p className="text-gray-600">Phone: {formData.phone}</p>
                        {formData.parishAffiliation && (
                          <p className="text-gray-600">
                            Parish Affiliation: {formData.parishAffiliation}
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700">
                          Business Information
                        </h4>
                        <p className="text-gray-600">
                          Business Name: {formData.businessName}
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

                      <div>
                        <h4 className="font-medium text-gray-700">
                          Subscription & Contact Information
                        </h4>
                        <p className="text-gray-600">
                          Subscription:{" "}
                          {formData.subscriptionType === "basic"
                            ? "Basic"
                            : formData.subscriptionType === "premium"
                              ? "Premium"
                              : "Elite"}
                        </p>
                        <p className="text-gray-600">
                          Contact Email: {formData.contactEmail}
                        </p>
                        <p className="text-gray-600">
                          Contact Phone: {formData.contactPhone}
                        </p>
                      </div>

                      {formData.products.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mt-4">
                            Products/Services Information
                          </h4>
                          <p className="text-gray-600">
                            Number of Products: {formData.products.length}
                          </p>
                          {formData.products.map((product, index) => (
                            <div key={index} className="mt-2">
                              <p className="text-gray-600 font-medium">
                                Product {index + 1}: {product.name}
                              </p>
                              {product.category && (
                                <p className="text-gray-600 text-sm">
                                  Category: {product.category}
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
                Our team is here to assist you with your vendor registration.
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
    </>
  );
};

export default VendorRegistrationForm;
