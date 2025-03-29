import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Heart, DollarSign, Users } from "lucide-react";

interface ValuePropositionProps {
  title?: string;
  description?: string;
  stats?: Array<{
    icon: React.ReactNode;
    value: string;
    label: string;
    color: string;
  }>;
  ctaText?: string;
  onCtaClick?: () => void;
}

const ValueProposition = ({
  title = "Your Purchase Makes a Difference",
  description = "Every purchase at ParishMart directly contributes to community initiatives. We're committed to transparency about how your shopping impacts those in need.",
  stats = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      value: "$250,000+",
      label: "Donated to local causes",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: "15,000+",
      label: "Causes helped annually",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      value: "100%",
      label: "Of purchases give back to the community",
      color: "bg-red-100 text-red-600",
    },
  ],
  ctaText = "Learn about our mission",
  onCtaClick = () => console.log("Learn more clicked"),
}: ValuePropositionProps) => {
  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="pb-2">
                <div
                  className={`w-16 h-16 rounded-full ${stat.color} flex items-center justify-center mb-4`}
                >
                  {stat.icon}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onCtaClick}
            className="bg-[#006699] hover:bg-[#005588] text-white px-8 py-6 h-auto text-lg group"
          >
            {ctaText}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Transparent Impact Reporting section moved to its own component */}
      </div>
    </section>
  );
};

export default ValueProposition;
