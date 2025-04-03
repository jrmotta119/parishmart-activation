import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  image?: string;
  title?: string;
  price?: number;
  description?: string;
  sellerName?: string;
  sellerSlug?: string;
  parish?: string;
  rating?: number;
  onAddToCart?: () => void;
}

const ProductCard = ({
  image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
  title = "Community T-Shirt",
  price = 29.99,
  description = "100% cotton t-shirt with ParishMart logo. Proceeds support local community initiatives.",
  sellerName = "Default Seller",
  sellerSlug = "",
  parish = "St. Mary's Church",
  rating = 4.5,
  onAddToCart = () => console.log("Product added to cart"),
}: ProductCardProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : index < rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Card className="w-full flex flex-col overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-900">
          {title}
        </CardTitle>
        <p className="text-[#006699] font-bold text-xl">${price.toFixed(2)}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <Link 
          to={`/marketplace/vendor/${sellerSlug}`}
          className="text-sm font-medium text-[#006699] hover:underline block"
        >
          {sellerName}
        </Link>
        <p className="text-sm text-gray-600">{parish}</p>
        {renderStars(rating)}
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button
          onClick={onAddToCart}
          className="w-full bg-[#006699] hover:bg-[#005588] text-white"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
