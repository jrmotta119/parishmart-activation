import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { shopCategories, marketplaceCategories } from "./Header";
import ProductCard from "./ProductCard";
import { allProducts, getProductsByCategory, getProductsBySubcategory } from "../data/products";
import { Product } from "../types/product";

const parishes = [
  "St. Mary's Catholic Church",
  "St. Joseph's Parish",
  "Holy Trinity Church",
  "Sacred Heart Cathedral",
  "St. Patrick's Church",
  "Our Lady of Grace Parish",
  "St. Michael's Church",
  "Christ the King Parish",
  "Blessed Sacrament Church",
  "St. Francis of Assisi Parish"
];

const products: Product[] = [
  // Meraki's Food & Beverages Products
  {
    id: "m1",
    image: "https://images.unsplash.com/photo-1544164559-2e64cde0c9f5",
    title: "Artisanal Honey Collection",
    price: 24.99,
    description: "Premium local honey varieties including wildflower, clover, and orange blossom.",
    category: "Food & Beverages",
    subcategory: "Packaged Foods, Snacks, and Specialty Items",
    sellerName: "Meraki",
    sellerSlug: "meraki",
    parish: parishes[0],
    rating: 4.9
  },
  {
    id: "m2",
    image: "https://images.unsplash.com/photo-1585504198199-20277593b94f",
    title: "Handcrafted Preserves",
    price: 12.99,
    description: "Small-batch fruit preserves made with local, seasonal ingredients.",
    category: "Food & Beverages",
    subcategory: "Packaged Foods, Snacks, and Specialty Items",
    sellerName: "Meraki",
    sellerSlug: "meraki",
    parish: parishes[0],
    rating: 4.8
  },
  {
    id: "m3",
    image: "https://images.unsplash.com/photo-1585504198199-20277593b94f",
    title: "Gourmet Tea Collection",
    price: 29.99,
    description: "Curated selection of premium loose-leaf teas with unique blends.",
    category: "Food & Beverages",
    subcategory: "Beverages, Coffee, and Tea",
    sellerName: "Meraki",
    sellerSlug: "meraki",
    parish: parishes[0],
    rating: 4.7
  },
  {
    id: "m4",
    image: "https://images.unsplash.com/photo-143832040297-5a6979dcfec5",
    title: "Artisan Coffee Beans",
    price: 18.99,
    description: "Single-origin coffee beans roasted in small batches for optimal flavor.",
    category: "Food & Beverages",
    subcategory: "Beverages, Coffee, and Tea",
    sellerName: "Meraki",
    sellerSlug: "meraki",
    parish: parishes[0],
    rating: 4.9
  },
  {
    id: "m5",
    image: "https://images.unsplash.com/photo-1604074131665-7a4b13870ab4",
    title: "Homemade Granola",
    price: 14.99,
    description: "Nutritious granola made with organic oats, nuts, and dried fruits.",
    category: "Food & Beverages",
    subcategory: "Packaged Foods, Snacks, and Specialty Items",
    sellerName: "Meraki",
    sellerSlug: "meraki",
    parish: parishes[0],
    rating: 4.8
  },
  {
    id: "m6",
    image: "https://images.unsplash.com/photo-1578500351865-d6c3d13f8d84",
    title: "Seasonal Fruit Baskets",
    price: 49.99,
    description: "Curated selection of seasonal fruits from local orchards.",
    category: "Food & Beverages",
    subcategory: "Packaged Foods, Snacks, and Specialty Items",
    sellerName: "Meraki",
    sellerSlug: "meraki",
    parish: parishes[0],
    rating: 4.9
  },
  {
    id: "m7",
    image: "https://images.unsplash.com/photo-1595760780346-f972eb49709f",
    title: "Herbal Tea Sampler",
    price: 22.99,
    description: "Collection of hand-blended herbal teas for wellness and relaxation.",
    category: "Food & Beverages",
    subcategory: "Beverages, Coffee, and Tea",
    sellerName: "Meraki",
    sellerSlug: "meraki",
    parish: parishes[0],
    rating: 4.7
  },
  {
    id: "m8",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",
    title: "Gourmet Gift Box",
    price: 79.99,
    description: "Luxury gift box featuring a selection of our finest food products.",
    category: "Food & Beverages",
    subcategory: "Packaged Foods, Snacks, and Specialty Items",
    sellerName: "Meraki",
    sellerSlug: "meraki",
    parish: parishes[0],
    rating: 4.9
  }
];

const ProductsPage = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(subcategory);

  useEffect(() => {
    let filtered = allProducts;

    if (category) {
      // Convert URL parameter to match category format
      const formattedCategory = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      filtered = getProductsByCategory(formattedCategory);
      setSelectedCategory(formattedCategory);
    }

    if (subcategory) {
      // Convert URL parameter to match subcategory format
      const formattedSubcategory = subcategory.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      filtered = getProductsBySubcategory(formattedSubcategory);
      setSelectedSubcategory(formattedSubcategory);
    }

    setFilteredProducts(filtered);
  }, [category, subcategory]);

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
                className={`text-gray-600 hover:text-[#006699] text-xs font-medium transition-colors text-center px-1 ${
                  selectedCategory === category.name ? 'text-[#006699]' : ''
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {subcategory || category || "Our Products"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our collection of faith-inspired products that support
              parish communities
            </p>
          </div>

          {/* Subcategories (only show if category is selected) */}
          {selectedCategory && (
            <div className="mb-8 flex justify-center">
              <div className="flex flex-wrap gap-2 justify-center">
                {shopCategories
                  .find(cat => cat.name === selectedCategory)
                  ?.subcategories.map((subcat) => (
                    <Button
                      key={subcat}
                      variant={selectedSubcategory === subcat ? "default" : "outline"}
                      className={`${
                        selectedSubcategory === subcat 
                          ? "bg-[#006699] text-white" 
                          : "text-sm"
                      }`}
                      onClick={() => navigate(`/products/${selectedCategory.toLowerCase().replace(/\s+/g, "-")}/${subcat.toLowerCase().replace(/\s+/g, "-")}`)}
                    >
                      {subcat}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
                description={product.description}
                sellerName={product.sellerName}
                sellerSlug={product.sellerSlug}
                parish={product.parish}
                rating={product.rating}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-300 text-gray-700">
                Previous
              </Button>
              <Button variant="outline" className="border-[#006699] bg-[#006699] text-white">
                1
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700">
                2
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700">
                3
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
