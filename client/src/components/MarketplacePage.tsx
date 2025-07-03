import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { marketplaceCategories } from "./Header";

// Add placeholder images for categories
const categoryImages = {
  "Community Businesses": {
    image: "https://images.unsplash.com/photo-1540821924489-7690c70c4eac",
    subcategoryImages: {
      "Meraki": "https://shopify-digital-delivery.s3.amazonaws.com/store_banner/2694058/wTXpeRBbTs.jpg",
      "Dry Steam Pro": "https://shopify-digital-delivery.s3.amazonaws.com/store_banner/2694057/wB8lHxpECo.jpg",
      "Sebanda Insurance Weston": "https://shopify-digital-delivery.s3.amazonaws.com/store_banner/2694050/yalmn5GJJU.jpg",
      "PaleoLife": "https://shopify-digital-delivery.s3.amazonaws.com/seller_shop_logo/2694049/CRTI5O91bq.png",
      "Armando Fit": "https://shopify-digital-delivery.s3.amazonaws.com/seller_shop_logo/2694046/nuIflsKdWy.png",
      "Immigration Law Office": "https://shopify-digital-delivery.s3.amazonaws.com/seller_shop_logo/2693323/KYmOq37Yry.png",
      "Rent A Boat In Miami": "https://parishmart.com/cdn/shop/files/AquaticAdventureFlorida_1.png?v=1739991876&width=130",
      "HarpsClub Store": "https://parishmart.com/cdn/shop/files/harps.png?v=1740065735&width=130",
    }
  },
  "Fund Raising Stores": {
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433",
    subcategoryImages: {
      "Schoenstatt Store": "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
      "Emmaus": "https://images.unsplash.com/photo-1504052434569-70ad5836ab65",
    }
  },
  "Products and Services": {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
    subcategoryImages: {
      "Immigration Legal Services": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
      "Rent a Boat with a Captain": "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13",
      "Cakes and Desserts": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
      "Fitness Coach": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
      "Insurance Broker": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
      "Professional Floor Cleaning": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab",
      "Custom Brand-Name Merchandise": "https://images.unsplash.com/photo-1481437156560-3205f6a55735",
      "Natural Premium Supplements Store": "https://images.unsplash.com/photo-1490818387583-1baba5e638af",
    }
  },
};

const CategoryCarousel = ({ 
  category, 
  subcategories, 
  currentIndex, 
  onNext, 
  onPrev 
}: { 
  category: string; 
  subcategories: string[]; 
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const navigate = useNavigate();
  const visibleSubcategories = subcategories.slice(currentIndex, currentIndex + 3);

  return (
    <div className="relative mb-24">
      <button
        onClick={onPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50"
      >
        <ChevronLeft className="h-6 w-6 text-gray-600" />
      </button>
      
      <div className="relative overflow-hidden">
        <motion.div
          className="grid grid-cols-3 gap-8"
          initial={false}
          animate={{ x: 0 }}
        >
          {visibleSubcategories.map((subcategory) => (
            <motion.div
              key={subcategory}
              className="aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => navigate(`/marketplace/vendor/${subcategory.toLowerCase().replace(/\s+/g, "-")}`)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={categoryImages[category as keyof typeof categoryImages].subcategoryImages[subcategory as keyof typeof categoryImages[keyof typeof categoryImages]["subcategoryImages"]]}
                alt={subcategory}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold text-center px-4">
                  {subcategory}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={onNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50"
      >
        <ChevronRight className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  );
};

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { category, subcategory } = useParams();
  const [currentIndices, setCurrentIndices] = useState<{ [key: string]: number }>({
    "Community Businesses": 0,
    "Fund Raising Stores": 0,
    "Products and Services": 0,
  });

  const handleNext = (category: string, maxItems: number) => {
    setCurrentIndices(prev => ({
      ...prev,
      [category]: (prev[category] + 3) >= maxItems ? 0 : prev[category] + 3
    }));
  };

  const handlePrev = (category: string, maxItems: number) => {
    setCurrentIndices(prev => ({
      ...prev,
      [category]: prev[category] - 3 < 0 ? Math.floor((maxItems - 1) / 3) * 3 : prev[category] - 3
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Category Navigation Bar */}
      <div className="sticky top-20 bg-white border-b border-gray-200 z-40">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-2 py-4">
            {marketplaceCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(`/marketplace/${category.name.toLowerCase().replace(/\s+/g, "-")}`)}
                className="text-gray-600 hover:text-[#006699] text-xs font-medium transition-colors text-center px-1"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-[#006699] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">
              Explore Our Marketplace
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Discover local businesses, fundraising stores, and professional services
              all supporting our community
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Category Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {marketplaceCategories.map((category) => (
          <div key={category.name} className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              {category.name}
            </h2>
            <CategoryCarousel
              category={category.name}
              subcategories={category.subcategories}
              currentIndex={currentIndices[category.name]}
              onNext={() => handleNext(category.name, category.subcategories.length)}
              onPrev={() => handlePrev(category.name, category.subcategories.length)}
            />
          </div>
        ))}
      </div>

      {/* Sell With Us Banner */}
      <div className="w-full bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 items-center h-[600px]">
            <div className="py-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Want to sell with us?
              </h2>
              <p className="text-2xl text-gray-600 mb-10">
                Sign up as a seller and join our growing marketplace community!
              </p>
              <Button 
                onClick={() => navigate('/sell-with-us')}
                className="bg-[#006699] hover:bg-[#005588] text-white text-xl px-10 py-8 h-auto rounded-md"
              >
                Sign up to sell
              </Button>
            </div>
            <div className="relative h-full">
              <div className="absolute inset-0 grid grid-cols-2 gap-6 p-12 pr-0">
                <img
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad"
                  alt="Business owner"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="grid grid-rows-2 gap-6">
                  <img
                    src="https://images.unsplash.com/photo-1556740772-1a741367b93e"
                    alt="Small business"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Marketplace vendor"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarketplacePage; 