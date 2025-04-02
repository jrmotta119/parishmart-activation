import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { shopCategories } from "./Header";

// Add placeholder images for categories (you should replace these with your actual images)
const categoryImages = {
  "Apparel & Accessories": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
  "Electronics & Technology": "https://images.unsplash.com/photo-1498049794561-7780e7231661",
  "Home & Living": "https://images.unsplash.com/photo-1513694203232-719a280e022f",
  "Automotive & Transportation": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
  "Food & Beverages": "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "Outdoor & Gardening": "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735",
  "Religious Products": "https://images.unsplash.com/photo-1545987796-200677ee1011",
  "Toys, Games & Hobbies": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088",
  "Gifts & Souvenirs": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48",
};

const ShopPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= shopCategories.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 3 < 0 ? Math.floor((shopCategories.length - 1) / 3) * 3 : prevIndex - 3
    );
  };

  const visibleCategories = shopCategories.slice(currentIndex, currentIndex + 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Category Navigation Bar */}
      <div className="sticky top-20 bg-white border-b border-gray-200 z-40">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-9 gap-2 py-4">
            {shopCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}`)}
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Shop Our Categories
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Discover our curated selection of products across multiple categories,
              all supporting parish communities and charitable causes.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      {/* Explore Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Explore categories
        </h2>
        <div className="relative mb-24">
          <button
            onClick={prevSlide}
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
              {visibleCategories.map((category) => (
                <motion.div
                  key={category.name}
                  className="aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}`)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={categoryImages[category.name as keyof typeof categoryImages]}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold text-center px-4">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Marketplace Banner - Full Width */}
      <div className="w-full bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div className="p-16 pl-0">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Explore the Marketplace
              </h2>
              <p className="text-2xl text-gray-600 mb-10">
                Check out the marketplace to find great deals on a wide range of products and services!
              </p>
              <Button 
                onClick={() => navigate('/sell-with-us')}
                className="bg-[#006699] hover:bg-[#005588] text-white text-xl px-10 py-8 h-auto rounded-md"
              >
                Go to Marketplace
              </Button>
            </div>
            <div className="h-[600px] relative">
              <div className="absolute inset-0 grid grid-cols-2 gap-6 p-12 pr-0">
                <img
                  src="https://images.unsplash.com/photo-1720454623734-4da157fa6596?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Religious items"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="grid grid-rows-2 gap-6">
                  <img
                    src="https://images.unsplash.com/photo-1501523460185-2aa5d2a0f981?q=80&w=2131&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Marketplace"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1714779044696-6e27f7441c13?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Artisan crafts"
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

export default ShopPage; 