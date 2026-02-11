import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";

const SellWithUs = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowAnnouncement(true);
      } else {
        setShowAnnouncement(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Strip (above header, only at top, slides up on scroll) */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${showAnnouncement ? "translate-y-0" : "-translate-y-full"}`}
        style={{ willChange: "transform 0.3s" }}
      >
        <AnnouncementStrip />
      </div>
      {/* Header (sticky/locked, below announcement strip when visible) */}
      <div
        className="sticky top-10 left-0 w-full z-40 bg-white transition-all duration-300 ease-in-out"
        style={{ top: showAnnouncement ? 40 : 0 }}
      >
        <Header />
      </div>
      <div className="pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Banner Section */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
              Start selling
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Paragraph - Left */}
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  Reach a purpose-driven audience and grow your business with lower customer acquisition costs and stronger long-term relationships. Offer your products or services through a new sales channel—ParishMart—where you can give back a portion of every sale to support a parish or cause of your choice.
                </p>
                <p className="text-lg text-gray-700 font-medium">
                  Ready to grow your business and support meaningful missions?
                </p>
              </div>
              {/* Video - Right */}
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-xl shadow-lg"
                  src="https://www.youtube.com/embed/flELulcfGlM"
                  title="Sell With Us Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Register today
                </h3>
                <p className="text-gray-700">
                  Share your business information and your story as an entrepreneur.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Get approved & list your offerings
                </h3>
                <p className="text-gray-700">
                  Once approved, you’ll get access to your dashboard to set up your seller page and showcase your products or services.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start selling with purpose
                </h3>
                <p className="text-gray-700">
                  Reach our community and offer your products or services while turning everyday commerce into meaningful impact.
                </p>
              </div>
            </div>
          </div>
          {/* CTA Section */}
          <div className="text-center mb-16">
            <p className="text-xl text-gray-700 mb-8">
              Join ParishMart today and be part of transforming everyday commerce into meaningful impact.
            </p>
            <Button
              className="bg-[#006699] hover:bg-[#005588] text-white font-semibold text-lg px-8 py-6 h-auto rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={() =>
                (window.location.href = "./vendor-registration-form")
              }
            >
              Join Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Sell on Parishmart?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Growth Opportunity
                </h3>
                <p className="text-gray-700">
                  Expand your business reach to new customers across multiple
                  communities.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Targeted Audience
                </h3>
                <p className="text-gray-700">
                  Connect with customers who are specifically looking for
                  purpose-driven products and services.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Easy Integration
                </h3>
                <p className="text-gray-700">
                  Simple onboarding process and user-friendly tools to manage
                  your listings.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Marketing Support
                </h3>
                <p className="text-gray-700">
                  Benefit from our platform's marketing efforts to faith
                  communities and non-profits.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Community Support
                </h3>
                <p className="text-gray-700">
                  Be part of a marketplace that supports community initiatives.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Secure Transactions
                </h3>
                <p className="text-gray-700">
                  Reliable payment processing and order management for peace of
                  mind.
                </p>
              </div>
              
              
            </div>
          </div>

          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellWithUs;
