import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";

const StoreRegistration = () => {
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
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
              Build your store
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Paragraph - Left */}
              <div>
                <p className="text-xl text-gray-600 mb-6">
                  Expand your outreach and support your mission with your own personalized storefront on ParishMart. We make it easy for parishes and local businesses to support one another by offering curated products, engaging your community, and creating sustainable support beyond donations.                </p>
                <p className="text-lg text-gray-700 font-medium">
                  Get started today and make an even greater impact!
                </p>
              </div>
              {/* Video - Right */}
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-xl shadow-lg"
                  src="https://www.youtube.com/embed/Gb81W2dnNFk"
                  title="Build Your Store Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="mb-16">
            {/* <div className="mb-16">
              <img
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1512&q=80"
                alt="ParishMart Solution"
                className="w-full h-auto rounded-xl shadow-lg mb-8 max-h-[600px] object-cover"
              />
            </div> */}
            <div className="mb-16">
              <h2 className="text-3xl text-center font-bold text-gray-900 mb-8">
                How it works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Register today
                  </h3>
                  <p className="text-gray-700">
                    Share your organization’s information and submit your application.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Get approved & build your store
                  </h3>
                  <p className="text-gray-700">
                    Once approved, you’ll get access to your dashboard to finish setting up your ParishMart storefront.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Promote & earn
                  </h3>
                  <p className="text-gray-700">
                    Share your storefront link with your community. A portion of every purchase made through your storefront goes back to support your mission.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl text-gray-700 mb-8">
                Join ParishMart today and receive sustainable support through purpose-driven shopping.
              </p>
              <Button
                className="bg-[#006699] hover:bg-[#005588] text-white font-semibold text-lg px-8 py-6 h-auto rounded-full transition-all duration-300 transform hover:scale-105"
                onClick={() => (window.location.href = "/store-registration")}
              >
                Join now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mb-16 pt-10">
              <h2 className="text-3xl text-center font-bold text-gray-900 mb-8">
                Why partner with ParishMart?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Your mission, your storefront
                  </h3>
                  <p className="text-gray-700">
                    Create a personalized storefront to share your story, support ministries, and serve your community.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Sustainable support for your parish
                  </h3>
                  <p className="text-gray-700">
                    Earn referrals from every purchase made through your storefront.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Donations as store products
                  </h3>
                  <p className="text-gray-700">
                    Offer donation-based products that make it easy for your community to support your mission.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Religious gifts & faith-based products
                  </h3>
                  <p className="text-gray-700">
                    Access to a curated selection of books, gifts, and essential religious items.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Merch store & personalized items
                  </h3>
                  <p className="text-gray-700">
                    Sell parish branded merchandise, customized apparel, and custom products on demand.
                  </p>
                </div>
                
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    No inventory or fullfillment required
                  </h3>
                  <p className="text-gray-700">
                    ParishMart handles product sourcing, fulfillment, and customer support—so you can focus on your mission.
                  </p>
                </div>
                
                {/* <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    24/7 Support
                  </h3>
                  <p className="text-gray-700">
                    Dedicated assistance for you and your customers at any time.
                  </p>
                </div> */}
              </div>
            </div>

            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoreRegistration;
