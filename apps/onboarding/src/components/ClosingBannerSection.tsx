import React from "react";
import { Button } from "./ui/button";

const ClosingBannerSection = () => {
  return (
    <section className="relative w-full min-h-[300px] flex items-center justify-center overflow-hidden">
      {/* Background image with brand blue overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://s3-us-west-2.amazonaws.com/tota-images/1280px-sainte-ch-f916f606d44074ce.jpg"
          alt="Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#006699]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 md:px-12 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Shop with Purpose. Serve with Love.
        </h2>
        <p className="text-white/85 text-lg md:text-xl mb-10">
          Every purchase becomes an act of support — strengthening parishes &amp; causes,
          empowering ministries, and uplifting local businesses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => (window.location.href = "./why-register")}
            className="bg-white text-[#006699] hover:bg-black/80 font-semibold px-8 py-3 text-base h-auto"
          >
            Launch your Store
          </Button>
          <Button
            onClick={() => (window.location.href = "./sell-with-us")}
            variant="outline"
            className="text-white bg-[#006699] hover:bg-white/80 font-semibold px-8 py-3 text-base h-auto"
          >
            Start Selling with Purpose
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClosingBannerSection;
