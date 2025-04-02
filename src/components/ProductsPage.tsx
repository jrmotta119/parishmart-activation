import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { shopCategories } from "./Header"; // Import shopCategories from Header

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  description: string;
  category?: string;
  subcategory?: string;
}

const products: Product[] = [
  {
    id: "1",
    image:
      "https://images.pexels.com/photos/236358/pexels-photo-236358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Handcrafted Rosary",
    price: 39.99,
    description:
      "Beautiful wooden rosary handcrafted by local artisans. Proceeds support parish youth ministry.",
    category: "Religious Products",
    subcategory: "Liturgical Supplies, Sacramental Gifts, and Apparel",
  },
  {
    id: "2",
    image:
      "https://images.pexels.com/photos/5199801/pexels-photo-5199801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Leather Bible Cover",
    price: 49.99,
    description:
      "Premium leather Bible cover with cross embossing. Protects your Bible while supporting local craftsmen.",
    category: "Religious Products",
    subcategory: "Bibles, Prayer Books, and Devotional Items",
  },
  {
    id: "3",
    image: "https://images.pexels.com/photos/237831/pexels-photo-237831.jpeg",
    title: "Saint Medal Collection",
    price: 24.99,
    description:
      "Set of five beautifully detailed saint medals. Perfect for gifts or personal devotion.",
    category: "Religious Products",
    subcategory: "Liturgical Supplies, Sacramental Gifts, and Apparel",
  },
  {
    id: "4",
    image: "https://free-images.com/or/a395/diary_journal_pen_notebook.jpg",
    title: "Prayer Journal",
    price: 18.99,
    description:
      "Beautifully designed journal with guided prayer prompts. Supports parish literacy programs.",
    category: "Religious Products",
    subcategory: "Bibles, Prayer Books, and Devotional Items",
  },
  {
    id: "5",
    image:
      "https://images.pexels.com/photos/5874943/pexels-photo-5874943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Handmade Baptism Candle",
    price: 32.99,
    description:
      "Personalized baptism candle handcrafted with care. A beautiful keepsake for this special sacrament.",
    category: "Religious Products",
    subcategory: "Liturgical Supplies, Sacramental Gifts, and Apparel",
  },
  {
    id: "6",
    image:
      "https://images.unsplash.com/photo-1566903451935-7e8833da3dd0?w=500&q=80",
    title: "Olive Wood Cross",
    price: 29.99,
    description:
      "Authentic olive wood cross from the Holy Land. Each piece is unique with beautiful natural grain patterns.",
    category: "Religious Products",
    subcategory: "Liturgical Supplies, Sacramental Gifts, and Apparel",
  },
  {
    id: "7",
    image:
      "https://images.unsplash.com/photo-1603393518079-f0a2b3cc5ed8?w=500&q=80",
    title: "Incense & Burner Set",
    price: 34.99,
    description:
      "Traditional church incense with brass burner. Creates a reverent atmosphere for home prayer.",
    category: "Religious Products",
    subcategory: "Liturgical Supplies, Sacramental Gifts, and Apparel",
  },
  {
    id: "8",
    image:
      "https://images.unsplash.com/photo-1510035618584-c442e0f35989?w=500&q=80",
    title: "Illuminated Scripture Art",
    price: 45.99,
    description:
      "Beautifully illuminated scripture verse in calligraphy. Perfect for home or office display.",
    category: "Religious Products",
    subcategory: "Bibles, Prayer Books, and Devotional Items",
  },
  {
    id: "9",
    image:
      "https://images.unsplash.com/photo-1565073624497-7e91633da6e6?w=500&q=80",
    title: "Communion Host Box",
    price: 27.99,
    description:
      "Elegant wooden box for storing communion hosts. Handcrafted with reverence for the Eucharist.",
    category: "Religious Products",
    subcategory: "Liturgical Supplies, Sacramental Gifts, and Apparel",
  },
  {
    id: "10",
    image:
      "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=500&q=80",
    title: "Children's Prayer Book",
    price: 15.99,
    description:
      "Colorfully illustrated prayer book for children. Introduces young ones to the beauty of prayer.",
    category: "Religious Products",
    subcategory: "Bibles, Prayer Books, and Devotional Items",
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.title}
        </h3>
        <p className="text-[#006699] font-bold mb-3">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
        <Button className="w-full bg-[#006699] hover:bg-[#005588] text-white mt-auto">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

const ProductsPage = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(subcategory);

  useEffect(() => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter((product) => product.category === category);
      setSelectedCategory(category);
    }

    if (subcategory) {
      filtered = filtered.filter((product) => product.subcategory === subcategory);
      setSelectedSubcategory(subcategory);
    }

    setFilteredProducts(filtered);
  }, [category, subcategory]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    navigate(`/products/${cat.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleSubcategoryClick = (cat: string, subcat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(subcat);
    navigate(`/products/${cat.toLowerCase().replace(/\s+/g, "-")}/${subcat.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
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

          {/* Category Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                className={!selectedCategory ? "bg-[#006699] text-white" : ""}
                onClick={() => navigate("/products")}
              >
                All Products
              </Button>
              {shopCategories.map((cat) => (
                <div key={cat.name} className="flex flex-col gap-2">
                  <Button
                    variant={selectedCategory === cat.name ? "default" : "outline"}
                    className={selectedCategory === cat.name ? "bg-[#006699] text-white" : ""}
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    {cat.name}
                  </Button>
                  {selectedCategory === cat.name && (
                    <div className="flex flex-wrap gap-2 ml-4">
                      {cat.subcategories.map((subcat) => (
                        <Button
                          key={subcat}
                          variant={selectedSubcategory === subcat ? "default" : "outline"}
                          className={selectedSubcategory === subcat ? "bg-[#006699] text-white" : "text-sm"}
                          onClick={() => handleSubcategoryClick(cat.name, subcat)}
                        >
                          {subcat}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="border-[#006699] bg-[#006699] text-white"
              >
                1
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                2
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                3
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
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
