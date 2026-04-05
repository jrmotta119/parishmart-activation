import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { marketplaceCategories } from './Header';
import { Button } from './ui/button';
import { ChevronDown, Search } from 'lucide-react';
import logo from '../assets/logo1.png';
import { getProductsByVendor } from '../data/products';
import { Product } from '../types/product';

interface VendorData {
  name: string;
  category: string;
  bannerImage: string;
  logoImage: string;
  businessDescription: string;
  ownerName: string;
  ownerDescription: string;
  products: Product[];
}

// This would typically come from an API or database
const mockVendorData: { [key: string]: VendorData } = {
  "meraki": {
    name: "Meraki",
    category: "Community Businesses",
    bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    logoImage: "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
    businessDescription: "Meraki is a boutique food and beverage company specializing in artisanal products that bring joy and flavor to any occasion. Our passion lies in creating unique, handcrafted items that tell a story.",
    ownerName: "Maria Rodriguez",
    ownerDescription: "With over 15 years of experience in food crafting and beverage making, Maria brings her passion for creating delicious products to every batch.",
    products: [
      {
        id: "m1",
        title: "Artisanal Honey Collection",
        price: 24.99,
        category: "Food & Beverages",
        subcategory: "Packaged Foods, Snacks, and Specialty Items",
        image: "https://images.unsplash.com/photo-1544164559-2e64cde0c9f5",
        description: "Premium local honey varieties including wildflower, clover, and orange blossom.",
        sellerName: "Meraki",
        sellerSlug: "meraki",
        parish: "St. Mary's Catholic Church",
        rating: 4.9
      },
      {
        id: "m2",
        title: "Handcrafted Preserves",
        price: 12.99,
        category: "Food & Beverages",
        subcategory: "Packaged Foods, Snacks, and Specialty Items",
        image: "https://images.unsplash.com/photo-1585504198199-20277593b94f",
        description: "Small-batch fruit preserves made with local, seasonal ingredients.",
        sellerName: "Meraki",
        sellerSlug: "meraki",
        parish: "St. Mary's Catholic Church",
        rating: 4.8
      },
      {
        id: "m3",
        title: "Gourmet Tea Collection",
        price: 29.99,
        category: "Food & Beverages",
        subcategory: "Beverages, Coffee, and Tea",
        image: "https://images.unsplash.com/photo-1585504198199-20277593b94f",
        description: "Curated selection of premium loose-leaf teas with unique blends.",
        sellerName: "Meraki",
        sellerSlug: "meraki",
        parish: "St. Mary's Catholic Church",
        rating: 4.7
      },
      {
        id: "m4",
        title: "Artisan Coffee Beans",
        price: 18.99,
        category: "Food & Beverages",
        subcategory: "Beverages, Coffee, and Tea",
        image: "https://images.unsplash.com/photo-143832040297-5a6979dcfec5",
        description: "Single-origin coffee beans roasted in small batches for optimal flavor.",
        sellerName: "Meraki",
        sellerSlug: "meraki",
        parish: "St. Mary's Catholic Church",
        rating: 4.9
      },
      {
        id: "m5",
        title: "Homemade Granola",
        price: 14.99,
        category: "Food & Beverages",
        subcategory: "Packaged Foods, Snacks, and Specialty Items",
        image: "https://images.unsplash.com/photo-1604074131665-7a4b13870ab4",
        description: "Nutritious granola made with organic oats, nuts, and dried fruits.",
        sellerName: "Meraki",
        sellerSlug: "meraki",
        parish: "St. Mary's Catholic Church",
        rating: 4.8
      },
      {
        id: "m6",
        title: "Seasonal Fruit Baskets",
        price: 49.99,
        category: "Food & Beverages",
        subcategory: "Packaged Foods, Snacks, and Specialty Items",
        image: "https://images.unsplash.com/photo-1578500351865-d6c3d13f8d84",
        description: "Curated selection of seasonal fruits from local orchards.",
        sellerName: "Meraki",
        sellerSlug: "meraki",
        parish: "St. Mary's Catholic Church",
        rating: 4.9
      },
      {
        id: "m7",
        title: "Herbal Tea Sampler",
        price: 22.99,
        category: "Food & Beverages",
        subcategory: "Beverages, Coffee, and Tea",
        image: "https://images.unsplash.com/photo-1595760780346-f972eb49709f",
        description: "Collection of hand-blended herbal teas for wellness and relaxation.",
        sellerName: "Meraki",
        sellerSlug: "meraki",
        parish: "St. Mary's Catholic Church",
        rating: 4.7
      },
      {
        id: "m8",
        title: "Gourmet Gift Box",
        price: 79.99,
        category: "Food & Beverages",
        subcategory: "Packaged Foods, Snacks, and Specialty Items",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",
        description: "Luxury gift box featuring a selection of our finest food products.",
        sellerName: "Meraki",
        sellerSlug: "meraki",
        parish: "St. Mary's Catholic Church",
        rating: 4.9
      }
    ]
  },
};

const VendorProfilePage = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const vendor = mockVendorData[vendorId?.toLowerCase() ?? ''];
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  // Get vendor's products from the exported products list
  const vendorProducts = useMemo(() => {
    if (!vendorId) return [];
    return getProductsByVendor(vendorId.toLowerCase());
  }, [vendorId]);

  // Get unique categories from products
  const categories = useMemo(() => {
    return Array.from(new Set(vendorProducts.map(product => product.category)));
  }, [vendorProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return vendorProducts
      .filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.title.localeCompare(b.title);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }, [vendorProducts, searchQuery, selectedCategory, sortBy]);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center h-[60vh]">
          <h1 className="text-2xl text-gray-600">Vendor not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Banner Section with Overlaid Logo */}
      <div className="relative pt-20">
        {/* Banner Image */}
        <div className="w-full h-[300px] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" /> {/* Overlay */}
          <img
            src={vendor.bannerImage}
            alt={`${vendor.name} banner`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logo Circle */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-24 z-20">
          <div className="w-48 h-48 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            <img
              src={vendor.logoImage}
              alt={`${vendor.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Business Name */}
      <div className="text-center mt-28 mb-16">
        <h1 className="text-4xl font-bold text-gray-900">{vendor.name}</h1>
        <p className="text-gray-600 mt-2">{vendor.category}</p>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Business Description */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Our Business</h2>
            <p className="text-gray-600 leading-relaxed">
              {vendor.businessDescription}
            </p>
          </div>

          {/* Owner Description */}
          <div className="lg:col-span-4 bg-gray-50 rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Meet the Owner</h2>
            <h3 className="text-lg font-medium text-[#006699] mb-4">{vendor.ownerName}</h3>
            <p className="text-gray-600 leading-relaxed">
              {vendor.ownerDescription}
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h2>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price-asc' | 'price-desc')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#006699] font-bold">${product.price.toFixed(2)}</span>
                    <Button className="bg-[#006699] hover:bg-[#005588] text-white">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorProfilePage; 