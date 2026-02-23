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
  title = "Grow with us",
  subtitle = "Join the first Catholic marketplace that connects parishes, causes and faith-driven entrepreneurs.",
  cards = [
    {
      title: "Are you a Parish, Diocese, or Archdiocese?",
      description: "Create your personalized online store to amplify your reach and engagement.",
      buttonText: "Build Your Store",
      imageSrc:
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80",
      onClick: () => (window.location.href = "./why-register"),
    },
    {
      title: "Are you a local entrepreneur?",
      description: "Sell your products or services while growing your business and giving back.",
      buttonText: "Start Selling",
      imageSrc:
        "https://images.unsplash.com/photo-1556740772-1a741367b93e?w=800&q=80",
      onClick: () => (window.location.href = "./sell-with-us"),
    },
  ],
}: GrowWithUsProps) => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-white scroll-mt-24" id="grow-with-us">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
