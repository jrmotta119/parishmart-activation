import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface GrowCardProps {
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  onClick?: () => void;
}

const GrowCard = ({
  title,
  description,
  buttonText,
  imageSrc,
  onClick = () => console.log("Card clicked"),
}: GrowCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600">{description}</p>
        </CardContent>
        <CardFooter className="pt-2 pb-6">
          <Button
            onClick={onClick}
            className="w-full bg-[#006699] hover:bg-[#005588] text-white font-medium"
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

interface GrowWithUsProps {
  title?: string;
  subtitle?: string;
  cards?: GrowCardProps[];
}

const GrowWithUs = ({
  title = "Grow With Us",
  subtitle = "Join our community and make a difference",
  cards = [
    {
      title: "Open a Store for Your Parish or Non-Profit",
      description: "Empower Your Mission with an Online Store",
      buttonText: "Start Your Store",
      imageSrc:
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80",
      onClick: () => (window.location.href = "/why-register"),
    },
    {
      title: "Sell & Support Your Community",
      description: "Turn Your Products into Support for Your Parish",
      buttonText: "Start Selling",
      imageSrc:
        "https://images.unsplash.com/photo-1556740772-1a741367b93e?w=800&q=80",
      onClick: () => (window.location.href = "/sell-with-us"),
    },
    {
      title: "Set Up Donations for Your Cause",
      description: "Raise Funds, Inspire Giving",
      buttonText: "Create a Donation Cause",
      imageSrc:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
      onClick: () => (window.location.href = "/donations"),
    },
  ],
}: GrowWithUsProps) => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <GrowCard
              key={index}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              imageSrc={card.imageSrc}
              onClick={card.onClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GrowWithUs;
