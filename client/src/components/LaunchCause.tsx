import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";

const LaunchCause = () => {
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
              Launch your cause
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Paragraph - Left */}
              <div>
                <p className="text-xl text-gray-600 mb-6">
                  Share your mission, inspire generosity, and receive support through ParishMart. We make it easy for non-profits and causes to connect with faith-driven communities, receive donations, and create sustainable impact beyond traditional fundraising.
                </p>
              </div>
              {/* Video - Right */}
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-xl shadow-lg"
                  src="https://www.youtube.com/embed/Gb81W2dnNFk"
                  title="Launch Your Cause Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="mb-16">
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
                    Share your organization's information, mission, and cause.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Get approved & showcase your cause
                  </h3>
                  <p className="text-gray-700">
                    Once approved, you'll get access to your dashboard to complete your ParishMart cause page and donation offerings.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Promote & inspire giving
                  </h3>
                  <p className="text-gray-700">
                    Share your cause page with your community and supporters. Donations and purpose-driven purchases help fund your mission and extend your impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                className="bg-[#006699] hover:bg-[#005588] text-white font-semibold text-lg px-8 py-6 h-auto rounded-full transition-all duration-300 transform hover:scale-105"
                onClick={() => (window.location.href = "/launch-cause")}
              >
                Join now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LaunchCause;
