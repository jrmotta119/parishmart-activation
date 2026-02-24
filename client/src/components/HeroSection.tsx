import React from "react";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

const trustItems = [
  "Built for the Catholic Community",
  "Mission-Aligned Commerce",
  "Sustainable Revenue Growth",
  "No Operational Burden",
];

const HeroSection = () => {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative w-full min-h-[500px] md:min-h-[580px] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg"
            alt="Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1a2341]/65" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl">
            Purpose-Driven Commerce that Strengthens your Community
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mb-10">
            ParishMart is the first Catholic marketplace that helps parishes, dioceses, ministries,
            and local businesses grow together — with every purchase supporting a mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <Button
              onClick={() => (window.location.href = "./why-register")}
              className="bg-white text-[#006699] hover:bg-black/80 font-semibold px-8 py-3 text-base h-auto"
            >
              Launch your Store
            </Button>
            <Button
              onClick={() => (window.location.href = "./sell-with-us")}
              variant="outline"
              className="bg-[#006699] text-white hover:bg-white/70 font-semibold px-8 py-3 text-base h-auto"
            >
              Start Selling with Purpose
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-neutral-300 border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-nowrap justify-center items-center overflow-x-auto">
          {trustItems.map((item, idx) => (
            <React.Fragment key={item}>
              <div className="flex items-center gap-1.5 text-gray-700 text-sm font-medium px-3 whitespace-nowrap">
                <Check className="w-4 h-4 text-[#006699] flex-shrink-0" />
                <span>{item}</span>
              </div>
              {idx < trustItems.length - 1 && (
                <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
