import { Product } from '../types/product';

export const parishes = [
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

export const allProducts: Product[] = [
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

export const getProductsByVendor = (vendorSlug: string) => {
  return allProducts.filter(product => product.sellerSlug === vendorSlug);
};

export const getProductsByCategory = (category: string) => {
  return allProducts.filter(product => product.category === category);
};

export const getProductsBySubcategory = (subcategory: string) => {
  return allProducts.filter(product => product.subcategory === subcategory);
}; 