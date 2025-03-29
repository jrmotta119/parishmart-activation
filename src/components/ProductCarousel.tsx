import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  description: string;
}

interface ProductCarouselProps {
  title?: string;
  products?: Product[];
  onProductSelect?: (product: Product) => void;
}

const ProductCarousel = ({
  title = "Featured Products",
  products = [
    {
      id: "1",
      image:
        "https://images.pexels.com/photos/236358/pexels-photo-236358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Handcrafted Rosary",
      price: 39.99,
      description:
        "Beautiful wooden rosary handcrafted by local artisans. Proceeds support parish youth ministry.",
    },
    {
      id: "2",
      image:
        "https://images.pexels.com/photos/5199801/pexels-photo-5199801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Leather Bible Cover",
      price: 49.99,
      description:
        "Premium leather Bible cover with cross embossing. Protects your Bible while supporting local craftsmen.",
    },
    {
      id: "3",
      image: "https://images.pexels.com/photos/237831/pexels-photo-237831.jpeg",
      title: "Saint Medal Collection",
      price: 24.99,
      description:
        "Set of five beautifully detailed saint medals. Perfect for gifts or personal devotion.",
    },
    {
      id: "4",
      image: "https://free-images.com/or/a395/diary_journal_pen_notebook.jpg",
      title: "Prayer Journal",
      price: 18.99,
      description:
        "Beautifully designed journal with guided prayer prompts. Supports parish literacy programs.",
    },
    {
      id: "5",
      image:
        "https://images.pexels.com/photos/5874943/pexels-photo-5874943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Handmade Baptism Candle",
      price: 32.99,
      description:
        "Personalized baptism candle handcrafted with care. A beautiful keepsake for this special sacrament.",
    },
  ],
  onProductSelect = (product) => console.log("Product selected:", product),
}: ProductCarouselProps) => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Swipe to explore more products
            </span>
            <div className="flex gap-2">
              <button
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                aria-label="View previous products"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                aria-label="View next products"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div>
                    <ProductCard
                      image={product.image}
                      title={product.title}
                      price={product.price}
                      description={product.description}
                      onAddToCart={() => onProductSelect(product)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 bg-white hover:bg-gray-100 border border-gray-200" />
              <CarouselNext className="-right-4 bg-white hover:bg-gray-100 border border-gray-200" />
            </div>
          </Carousel>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[#006699] font-medium mb-4">
            Every purchase makes a difference in your community
          </p>
          <button
            className="bg-[#006699] hover:bg-[#005588] text-white px-6 py-2 rounded-md font-medium transition-colors"
            onClick={() => (window.location.href = "./products")}
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
