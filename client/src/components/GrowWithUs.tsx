import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface GrowCardProps {
  title: string;
  bullets: string[];
  buttonText: string;
  imageSrc: string;
  onClick?: () => void;
}

const GrowCard = ({
  title,
  bullets,
  buttonText,
  imageSrc,
  onClick = () => {},
}: GrowCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <ul className="space-y-2">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-600">
                <Check className="w-4 h-4 text-[#006699] flex-shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pt-4 pb-6">
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

const GrowWithUs = () => {
  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-white scroll-mt-24 w-full" id="grow-with-us">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-14">
          <p className="text-lg text-gray-600 mx-auto">
            ParishMart connects catholic faith-driven institutions, causes, and local businesses
            in one unified ecosystem.
          </p>
          <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
            Grow Your Mission. Grow Your Business.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <GrowCard
            title="For Parishes, Dioceses & Causes"
            bullets={[
              "Raises funds automatically through everyday purchases",
              "Activates parish ministries and fundraising initiatives",
              "Engages your community year-round",
              "Supports local businesses",
            ]}
            buttonText="Launch your Store"
            imageSrc="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80"
            onClick={() => (window.location.href = "./why-register")}
          />
          <GrowCard
            title="For Local Businesses"
            bullets={[
              "Connect with a purpose-driven community",
              "Support a cause of your choosing",
              "Grow your customer base",
              "Build long-lasting relationships",
            ]}
            buttonText="Start Selling with Purpose"
            imageSrc="https://images.unsplash.com/photo-1556740772-1a741367b93e?w=800&q=80"
            onClick={() => (window.location.href = "./sell-with-us")}
          />
        </div>
      </div>
    </section>
  );
};

export default GrowWithUs;
