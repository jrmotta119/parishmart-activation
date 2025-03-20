import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  logo?: string;
  tagline?: string;
  ctaText?: string;
  backgroundImage?: string;
  onCtaClick?: () => void;
}

const HeroSection = ({
  logo = "/parishmart-full-logo.png",
  tagline = "Shop with purpose, serve with love",
  ctaText = "Browse Products",
  backgroundImage = "https://s3-us-west-2.amazonaws.com/tota-images/1280px-sainte-ch-f916f606d44074ce.jpg",
  onCtaClick = () => console.log("CTA clicked"),
}: HeroSectionProps) => {
  return (
    <section className="relative w-full h-[600px] flex items-center justify-center bg-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#006699]/40 z-10" />
        <img
          src={backgroundImage}
          alt="ParishMart Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          {logo ? (
            <img
              src={logo}
              alt="ParishMart Logo"
              className="h-24 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold text-[#006699]">ParishMart</h1>
            </div>
          )}
        </div>

        {/* Tagline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg">
          {tagline}
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl text-white mb-10 max-w-2xl mx-auto drop-shadow-md">
          Discover products that make a difference. Every purchase supports
          community initiatives and charitable causes.
        </p>

        {/* CTA Button */}
        <Button
          onClick={onCtaClick}
          size="lg"
          className="bg-[#006699] hover:bg-[#005588] text-white font-semibold text-lg px-8 py-6 h-auto rounded-full transition-all duration-300 transform hover:scale-105"
        >
          {ctaText}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white/20 to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
