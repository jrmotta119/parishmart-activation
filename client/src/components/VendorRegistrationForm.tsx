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
import AnnouncementStrip from "./AnnouncementStrip";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  parishAffiliation: string;
  ownerDescription: string;
  businessUnique: string;
  communityEfforts: string;
  businessName: string;
  businessType: "product" | "service" | "both";
  businessDescription: string;
  businessPolicy: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessCountry: string;
  businessZipCode: string;
  logo: File | null;
  businessImages: (File | null)[];
  websiteLinks: string;
  subscriptionType: "basic" | "premium" | "elite";
  contactEmail: string;
  contactPhone: string;
  products: {
    name: string;
    category: string;
    description: string;
    images: File[];
    videos: File[];
    promotionalHook: string;
    pricingInfo: string;
    otherCategory?: string;
  }[];
  participateInCampaigns: boolean;
  
  reach: "local" | "regional" | "national" | "global" | "";
  contactForOpportunities: boolean | null;
}

const VendorRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    parishAffiliation: "",
    ownerDescription: "",
    businessUnique: "",
    communityEfforts: "",
    businessName: "",
    businessType: "product",
    businessDescription: "",
    businessPolicy: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessCountry: "",
    businessZipCode: "",
    logo: null,
    businessImages: [null, null, null],
    websiteLinks: "",
    subscriptionType: "basic",
    contactEmail: "",
    contactPhone: "",
    products: [],
    participateInCampaigns: true,
    
    reach: "",
    contactForOpportunities: null,
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [productImagePreviews, setProductImagePreviews] = useState<{
    [key: number]: string[];
  }>({});
  const [productVideoPreviews, setProductVideoPreviews] = useState<{
    [key: number]: string;
  }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptedSteps, setAttemptedSteps] = useState<number[]>([]);
  const [parishSearch, setParishSearch] = useState("");
  const [customParish, setCustomParish] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const [businessImagePreviews, setBusinessImagePreviews] = useState([null, null, null]);

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
    "Other",
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
    "Other",
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

  const handleProductVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productIndex: number,
  ) => {
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

      const updatedProducts = [...formData.products];
      if (!updatedProducts[productIndex].videos) {
        updatedProducts[productIndex].videos = [];
      }
      updatedProducts[productIndex].videos = [file]; // Only allow one video
      setFormData({
        ...formData,
        products: updatedProducts,
      });
      
      const videoPreview = URL.createObjectURL(file);
      setProductVideoPreviews((prev) => ({
        ...prev,
        [productIndex]: videoPreview,
      }));
    }
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // TODO: implement CSV parsing logic
      // For now, just show a message that the file was received
      const file = e.target.files[0];
      setToastMessage(`CSV file received: ${file.name}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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

  const removeProductVideo = (productIndex: number) => {
    const updatedProducts = [...formData.products];
    updatedProducts[productIndex].videos = [];
    setFormData({
      ...formData,
      products: updatedProducts,
    });
    setProductVideoPreviews((prev) => {
      const updatedPreviews = { ...prev };
      delete updatedPreviews[productIndex];
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
          videos: [],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all steps as attempted for validation
    setAttemptedSteps([1, 2, 3, 4, 5]);

    // Validate all required fields before submission
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.businessName ||
      !formData.businessDescription ||
      !formData.logo ||
      !formData.reach ||
      !formData.businessAddress ||
      !formData.businessCity ||
      !formData.businessState ||
      !formData.businessCountry ||
      !formData.businessZipCode
    ) {
      setToastMessage("Please fill in all required fields before submitting");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Validate basic subscription specific requirements
    if (formData.subscriptionType === "basic" && formData.contactForOpportunities === null) {
      setToastMessage("Please indicate if you would like to be contacted for opportunities");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Validate products if not basic subscription
    if (formData.subscriptionType !== "basic" && formData.products.length > 0) {
      const invalidProducts = formData.products.filter(
        (product) => !product.name || !product.category || (product.category === 'Other' && !product.otherCategory) || !product.description || !product.pricingInfo
      );

      if (invalidProducts.length > 0) {
        setToastMessage(
          "Please complete all product information before submitting",
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add registration type
      submitData.append('registrationType', 'vendor');
      
      // Handle parish affiliation with custom parish override
      const finalParishAffiliation = formData.parishAffiliation === "Other" && customParish.trim()
        ? customParish.trim()
        : formData.parishAffiliation || "";
      
      submitData.append('parishAffiliation', finalParishAffiliation);
      
      // Add all form fields (except parishAffiliation which we handled above)
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'parishAffiliation') {
          // Skip - already handled above
          return;
        } else if (key === 'logo' && value) {
          submitData.append('logo', value);
        } else if (key === 'businessImages' && value && Array.isArray(value)) {
          value.forEach((image, index) => {
            if (image) {
              submitData.append('businessImages', image);
            }
          });
        } else if (key === 'products') {
          // Handle products array
          submitData.append('products', JSON.stringify(value));
          
          // Handle product files
          if (value && Array.isArray(value)) {
            value.forEach((product, productIndex) => {
              if (product.images && product.images.length > 0) {
                product.images.forEach((image: File, imageIndex: number) => {
                  submitData.append(`productImages_${productIndex}`, image);
                });
              }
              if (product.videos && product.videos.length > 0) {
                product.videos.forEach((video: File, videoIndex: number) => {
                  submitData.append(`productVideos_${productIndex}`, video);
                });
              }
            });
          }
        } else if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
          submitData.append(key, value.toString());
        }
      });
      
      // Add business contact info (use personal info if business contact not provided)
      submitData.append('contactEmail', formData.contactEmail || formData.email);
      submitData.append('contactPhone', formData.contactPhone || formData.phone);

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
      alert("Registration successful! Your vendor account is being set up. You will receive login credentials via email.");
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
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setToastMessage("Please fill in all required fields");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    } else if (step === 2) {
      if (
        !formData.businessName ||
        !formData.businessDescription ||
        !formData.logo ||
        !formData.reach ||
        !formData.businessAddress ||
        !formData.businessCity ||
        !formData.businessState ||
        !formData.businessCountry ||
        !formData.businessZipCode
      ) {
        setToastMessage("Please fill in all required fields and upload a logo");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    } else if (step === 4) {
      if (formData.subscriptionType === "basic" && formData.contactForOpportunities === null) {
        setToastMessage("Please indicate if you would like to be contacted for opportunities");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      // Only validate products if they exist and subscription is not basic
      if (formData.subscriptionType !== "basic" && formData.products.length > 0) {
        const invalidProducts = formData.products.filter(
          (product) => !product.name || !product.category || (product.category === 'Other' && !product.otherCategory) || !product.description || !product.pricingInfo
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
        <div className="pt-36 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        className={`w-full ${!formData.email && attemptedSteps.includes(step) && "border-red-300"}`}
                      />
                      {!formData.email && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          Email is required
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
                        className={`w-full ${!formData.phone && attemptedSteps.includes(step) && "border-red-300"}`}
                      />
                      {!formData.phone && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          Phone number is required
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
                        {formData.parishAffiliation || "Select a parish or non-profit (optional)"}
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
                            {parishes
                              .filter(parish => parish.toLowerCase().includes(parishSearch.toLowerCase()))
                              .map(parish => (
                                <div
                                  key={parish}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setFormData({ ...formData, parishAffiliation: parish });
                                    setDropdownOpen(false);
                                    setParishSearch("");
                                  }}
                                >
                                  {parish}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      A percentage of your sales will be donated to your
                      selected mission (Parish, Church, or Cause)
                    </p>
                    {formData.parishAffiliation === "Other" && (
                      <div className="mt-2">
                        <Label htmlFor="customParish" className="block text-sm font-medium text-gray-700 mb-1">
                          Please specify the mission or non-profit
                        </Label>
                        <Input
                          id="customParish"
                          name="customParish"
                          value={customParish}
                          onChange={e => setCustomParish(e.target.value)}
                          className="w-full"
                          placeholder="Type the mission or non-profit name"
                        />
                      </div>
                    )}
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
                      placeholder="Share any community efforts or causes..."
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
                      className={`w-full ${!formData.businessName && attemptedSteps.includes(step) && "border-red-300"}`}
                    />
                    {!formData.businessName && attemptedSteps.includes(step) && (
                      <p className="mt-1 text-sm text-red-600">
                        Business name is required
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      What does your business offer? *
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
                          Service Provider – (Offers services from handymen realtors,lawyers, etc.)
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

                  {/* Where do you offer your products or services? */}
                  <div className="mb-6">
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
                        <Label htmlFor="reach-local" className="cursor-pointer font-semibold">
                          Local
                        </Label>
                        <span className="text-xs text-gray-600 ml-2">You serve a specific town or city.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="regional" id="reach-regional" />
                        <Label htmlFor="reach-regional" className="cursor-pointer font-semibold">
                          Regional
                        </Label>
                        <span className="text-xs text-gray-600 ml-2">You operate across a broader area within your neighboring areas or state.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="national" id="reach-national" />
                        <Label htmlFor="reach-national" className="cursor-pointer font-semibold">
                          National
                        </Label>
                        <span className="text-xs text-gray-600 ml-2">You serve customers across the United States.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="global" id="reach-global" />
                        <Label htmlFor="reach-global" className="cursor-pointer font-semibold">
                          Global
                        </Label>
                        <span className="text-xs text-gray-600 ml-2">You offer your products or services internationally.</span>
                      </div>
                    </RadioGroup>
                    {!formData.reach && attemptedSteps.includes(step) && (
                      <p className="mt-1 text-sm text-red-600">
                        Please select where you offer your products or services
                      </p>
                    )}
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
                      className={`w-full h-32 ${!formData.businessDescription && attemptedSteps.includes(step) && "border-red-300"}`}
                      placeholder="Describe your business in detail..."
                    />
                    {!formData.businessDescription &&
                      attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          Business description is required
                        </p>
                      )}
                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="businessPolicy"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Business Policy
                    </Label>
                    <Textarea
                      id="businessPolicy"
                      name="businessPolicy"
                      value={formData.businessPolicy}
                      onChange={handleInputChange}
                      className="w-full h-32"
                      placeholder="Describe your business policies regarding returns, shipping, etc..."
                    />
                  </div>
                  <div className="mb-6">
                    <Label
                      htmlFor="businessUnique"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      What makes your business unique?
                    </Label>
                    <Textarea
                      id="businessUnique"
                      name="businessUnique"
                      value={formData.businessUnique}
                      onChange={handleInputChange}
                      className="w-full mb-3"
                      placeholder="What makes your business unique?"
                    />
                  </div>    
                  <div className="mb-6">
                    <Label
                      htmlFor="businessAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Business Address *
                    </Label>
                    <Input
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${!formData.businessAddress && attemptedSteps.includes(step) && "border-red-300"}`}
                      placeholder="Street address, P.O. box"
                    />
                    {!formData.businessAddress && attemptedSteps.includes(step) && (
                      <p className="mt-1 text-sm text-red-600">
                        Business address is required
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <Label
                        htmlFor="businessCity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        City *
                      </Label>
                      <Input
                        id="businessCity"
                        name="businessCity"
                        value={formData.businessCity}
                        onChange={handleInputChange}
                        required
                        className={`w-full ${!formData.businessCity && attemptedSteps.includes(step) && "border-red-300"}`}
                        placeholder="City"
                      />
                      {!formData.businessCity && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          City is required
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="businessState"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        State *
                      </Label>
                      <Input
                        id="businessState"
                        name="businessState"
                        value={formData.businessState}
                        onChange={handleInputChange}
                        required
                        className={`w-full ${!formData.businessState && attemptedSteps.includes(step) && "border-red-300"}`}
                        placeholder="State"
                      />
                      {!formData.businessState && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          State is required
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="businessCountry"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Country *
                      </Label>
                      <Input
                        id="businessCountry"
                        name="businessCountry"
                        value={formData.businessCountry}
                        onChange={handleInputChange}
                        required
                        className={`w-full ${!formData.businessCountry && attemptedSteps.includes(step) && "border-red-300"}`}
                        placeholder="Country"
                      />
                      {!formData.businessCountry && attemptedSteps.includes(step) && (
                        <p className="mt-1 text-sm text-red-600">
                          Country is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="businessZipCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      ZIP/Postal Code *
                    </Label>
                    <Input
                      id="businessZipCode"
                      name="businessZipCode"
                      value={formData.businessZipCode}
                      onChange={handleInputChange}
                      required
                      className={`w-full ${!formData.businessZipCode && attemptedSteps.includes(step) && "border-red-300"}`}
                      placeholder="ZIP/Postal code"
                      pattern="[0-9]*"
                      title="Please enter a valid ZIP/Postal code"
                    />
                    {!formData.businessZipCode && attemptedSteps.includes(step) && (
                      <p className="mt-1 text-sm text-red-600">
                        ZIP/Postal code is required
                      </p>
                    )}
                  </div>

                  {/* Logo Upload */}
                  <div className="mb-6">
                    <div className="flex flex-row items-start gap-10 w-full">
                      <div className="flex flex-col items-center">
                        <div className="text-center font-medium mb-2">Upload Logo *</div>
                        <div className={`w-32 h-32 border-2 border-dashed ${!formData.logo && attemptedSteps.includes(step) ? "border-red-500" : "border-gray-300"} rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-2`}>
                          <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            required={!formData.logo}
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
                          <p className="mt-1 text-xs text-red-600">Logo is required</p>
                        )}
                      </div>
                      
                      {/* Business Images Upload (3 Rectangular) */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="text-center font-medium mb-2">Upload Business Images (for banner creation)</div>
                        <div className="flex space-x-2">
                          {[0, 1, 2].map((index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-2`}>
                                <input
                                  type="file"
                                  id={`business-image-${index}`}
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const file = e.target.files[0];
                                      // Create a preview URL and update state
                                      const newPreviews = [...businessImagePreviews];
                                      newPreviews[index] = URL.createObjectURL(file);
                                      setBusinessImagePreviews(newPreviews);
                                      
                                      // Update the actual file in formData
                                      const newBusinessImages = [...formData.businessImages];
                                      newBusinessImages[index] = file;
                                      setFormData({ ...formData, businessImages: newBusinessImages });
                                    }
                                  }}
                                  className="hidden"
                                />
                                <label htmlFor={`business-image-${index}`} className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                                  {businessImagePreviews[index] ? (
                                    <img src={businessImagePreviews[index]} alt={`Business preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <>
                                      <Upload className="h-6 w-6 text-gray-400 mb-1 mx-auto" />
                                      <span className="text-xs text-gray-500">Image {index + 1}</span>
                                      <span className="text-xs text-gray-400">PNG, JPG, GIF</span>
                                    </>
                                  )}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Ideal size: 300x225 px</div>
                        <p className="text-xs text-gray-500 mt-1">These images will be used to create your business banner</p>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Basic Tier */}
                    <div
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${formData.subscriptionType === "basic" ? "border-[#006699] shadow-md" : "border-gray-200"}`}
                      onClick={() => handleSubscriptionChange("basic")}
                    >
                      <h3 className="text-lg font-semibold">Basic</h3>
                      <p className="text-2xl font-bold mb-2">$49.99<span className="text-sm font-normal">/month</span></p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="text-[#006699] font-bold mr-2">✓</span> Promotional listing
                        </li>
                        
                        <li className="flex items-center text-gray-400">
                          <span className="mr-2">✗</span> Product listings
                        </li>
                        <li className="flex items-center text-gray-400">
                          <span className="mr-2">✗</span> Featured Placement
                        </li>
                        <li className="flex items-center text-gray-400">
                          <span className="mr-2">✗</span> API integration available **
                        </li>
                      </ul>
                    </div>
                    {/* Premium Tier */}
                    <div
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${formData.subscriptionType === "premium" ? "border-[#006699] shadow-md" : "border-gray-200"}`}
                      onClick={() => handleSubscriptionChange("premium")}
                    >
                      <h3 className="text-lg font-semibold">Premium</h3>
                      <p className="text-2xl font-bold mb-2">$79.99<span className="text-sm font-normal">/month</span></p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="text-[#006699] font-bold mr-2">✓</span> Promotional listing
                        </li>
                
                        <li className="flex items-center">
                          <span className="text-[#006699] font-bold mr-2">✓</span> Up to 3 product listings *
                        </li>
                        <li className="flex items-center text-gray-400">
                          <span className="mr-2">✗</span> Featured Placement
                        </li>
                        <li className="flex items-center text-gray-400">
                          <span className="mr-2">✗</span> API integration available **
                        </li>
                      </ul>
                    </div>
                    {/* Elite Tier */}
                    <div
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${formData.subscriptionType === "elite" ? "border-[#006699] shadow-md" : "border-gray-200"}`}
                      onClick={() => handleSubscriptionChange("elite")}
                    >
                      <h3 className="text-lg font-semibold">Elite</h3>
                      <p className="text-2xl font-bold mb-2">$99.99<span className="text-sm font-normal">/month</span></p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <span className="text-[#006699] font-bold mr-2">✓</span> Promotional listing
                        </li>
                    
                        <li className="flex items-center">
                          <span className="text-[#006699] font-bold mr-2">✓</span> Unlimited product listings*
                        </li>
                        <li className="flex items-center">
                          <span className="text-[#006699] font-bold mr-2">✓</span> Featured placement
                        </li>
                        <li className="flex items-center">
                          <span className="text-[#006699] font-bold mr-2">✓</span> API integration available **
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      * Transactional fees apply. Please review our full
                      policy for details.
                    </p>
                    <p>** One-time set-up fee may apply.</p>
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
                    Products & Services
                  </h2>

                  {/* Contact for Opportunities Question */}
                  {formData.subscriptionType === "basic" && (
                    <div className="mb-6">
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        Would you like to be contacted to explore more opportunities to grow with Parishmart?
                      </Label>
                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          className={`px-4 py-2 rounded ${formData.contactForOpportunities === true ? 'bg-[#006699] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          onClick={() => setFormData({ ...formData, contactForOpportunities: true })}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          className={`px-4 py-2 rounded ${formData.contactForOpportunities === false ? 'bg-[#006699] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          onClick={() => setFormData({ ...formData, contactForOpportunities: false })}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  )}

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
                        
                        <div className="flex space-x-2">
                          {formData.subscriptionType === "elite" && (
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
                          )}
                          <Button
                            type="button"
                            onClick={addProduct}
                            size="sm"
                            className="bg-[#006699] hover:bg-[#005588] text-white"
                          >
                            Add Product
                          </Button>
                        </div>
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
                                  Listing {productIndex + 1}
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
                                  className={`w-full ${!product.name && attemptedSteps.includes(step) && "border-red-300"}`}
                                />
                                {!product.name &&
                                  attemptedSteps.includes(step) && (
                                    <p className="mt-1 text-sm text-red-600">
                                      Product name is required
                                    </p>
                                  )}
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
                                  <SelectTrigger
                                    className={`w-full ${!product.category && attemptedSteps.includes(step) && "border-red-300"}`}
                                  >
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
                                {!product.category &&
                                  attemptedSteps.includes(step) && (
                                    <p className="mt-1 text-sm text-red-600">
                                      Category is required
                                    </p>
                                  )}
                                {product.category === "Other" && (
                                  <div className="mt-2">
                                    <Label htmlFor={`other-category-${productIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                      Please specify the category
                                    </Label>
                                    <Input
                                      id={`other-category-${productIndex}`}
                                      value={product.otherCategory || ""}
                                      onChange={e => updateProduct(productIndex, "otherCategory", e.target.value)}
                                      className={`w-full${!product.otherCategory && attemptedSteps.includes(step) ? " border-red-300" : ""}`}
                                      placeholder="Enter the category"
                                      required
                                    />
                                    {!product.otherCategory && attemptedSteps.includes(step) && (
                                      <p className="mt-1 text-sm text-red-600">Category is required</p>
                                    )}
                                  </div>
                                )}
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
                                  className={`w-full h-32 ${!product.description && attemptedSteps.includes(step) && "border-red-300"}`}
                                  placeholder="Describe your product or service in detail..."
                                />
                                {!product.description &&
                                  attemptedSteps.includes(step) && (
                                    <p className="mt-1 text-sm text-red-600">
                                      Description is required
                                    </p>
                                  )}
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
                                        onChange={(e) =>
                                          handleProductVideoChange(e, productIndex)
                                        }
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
                                          onClick={() =>
                                            removeProductVideo(productIndex)
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
                                          Click to upload images
                                        </span>
                                        <span className="text-xs text-gray-400 mt-1">
                                          PNG, JPG, GIF up to 5MB each (max 5 images)
                                        </span>
                                      </label>
                                    </div>

                                    {productImagePreviews[productIndex] &&
                                      productImagePreviews[productIndex].length >
                                        0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                          {productImagePreviews[productIndex].map(
                                            (preview, imageIndex) => (
                                              <div
                                                key={imageIndex}
                                                className="relative group"
                                              >
                                                <div className="w-full h-20 border rounded-lg overflow-hidden">
                                                  <img
                                                    src={preview}
                                                    alt={`Listing ${productIndex + 1} Image ${imageIndex + 1}`}
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
                                            ),
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </div>
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
                                  placeholder="e.g., 10% off first purchase"
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
                                  Pricing Information *
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
                                  className={`w-full${!product.pricingInfo && attemptedSteps.includes(step) ? " border-red-300" : ""}`}
                                  placeholder="e.g., $19.99 per item, $50-100 per service, Starting at $29.99"
                                  required
                                />
                                {!product.pricingInfo && attemptedSteps.includes(step) && (
                                  <p className="mt-1 text-sm text-red-600">Pricing information is required</p>
                                )}
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
                        <h4 
                          className="font-medium text-gray-700 cursor-pointer hover:text-[#006699] transition-colors flex items-center"
                          onClick={() => setStep(1)}
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
                        {formData.contactForOpportunities !== null && (
                          <p className="text-gray-600">
                            Would like to be contacted for more opportunities: {formData.contactForOpportunities ? 'Yes' : 'No'}
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 
                          className="font-medium text-gray-700 cursor-pointer hover:text-[#006699] transition-colors flex items-center"
                          onClick={() => setStep(2)}
                        >
                          Business Information (Edit)
                          <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
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
                        <h4 
                          className="font-medium text-gray-700 cursor-pointer hover:text-[#006699] transition-colors flex items-center"
                          onClick={() => setStep(3)}
                        >
                          Subscription (Edit)
                          <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
                        </h4>
                        <p className="text-gray-600">
                          Subscription:{" "}
                          {formData.subscriptionType === "basic"
                            ? "Basic"
                            : formData.subscriptionType === "premium"
                              ? "Premium"
                              : "Elite"}
                        </p>
                      </div>

                      {formData.products.length > 0 && (
                        <div>
                          <h4 
                            className="font-medium text-gray-700 cursor-pointer hover:text-[#006699] transition-colors flex items-center"
                            onClick={() => setStep(4)}
                          >
                            Products/Services Information (Edit)
                            <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
                          </h4>
                          <p className="text-gray-600">
                            Number of Products: {formData.products.length}
                          </p>
                          {formData.products.map((product, index) => (
                            <div key={index} className="mt-2">
                              <p className="text-gray-600 font-medium">
                                Listing {index + 1}: {product.name}
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
    </>
  );
};

export default VendorRegistrationForm;
