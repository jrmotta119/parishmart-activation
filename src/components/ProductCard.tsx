import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  image?: string;
  title?: string;
  price?: number;
  description?: string;
  onAddToCart?: () => void;
}

const ProductCard = ({
  image = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
  title = "Community T-Shirt",
  price = 29.99,
  description = "100% cotton t-shirt with ParishMart logo. Proceeds support local community initiatives.",
  onAddToCart = () => console.log("Product added to cart"),
}: ProductCardProps) => {
  return (
    <Card className="w-80 h-[450px] flex flex-col overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-60 overflow-hidden bg-gray-100">
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
        <p className="text-[#006699] font-bold">${price.toFixed(2)}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
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
