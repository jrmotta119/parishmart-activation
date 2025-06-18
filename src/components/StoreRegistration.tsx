import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const StoreRegistration = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Build your Store
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Expand your outreach and empower your mission with your own ParishMart storefront. Whether you're a parish, church, or mission, we make it easy to showcase products, collect donations, and engage and grow your community. 
            </p>
            <p className="text-lg text-center text-gray-700 font-medium">
              Get started today and make an even greater impact! 
            </p>
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
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Register
                  </h3>
                  <p className="text-gray-700">
                  Provide your organization’s basic information to get started.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Customize Your Storefront
                  </h3>
                  <p className="text-gray-700">
                  Upload your logo and images that reflect your mission and identity.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Promote & Earn
                  </h3>
                  <p className="text-gray-700">
                    Share your ParishMart link with your community and start raising funds through every purchase from your storefront.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl text-gray-700 mb-8">
                Join ParishMart today and elevate your cause through
                purchase-driven shopping.
              </p>
              <Button
                className="bg-[#006699] hover:bg-[#005588] text-white font-semibold text-lg px-8 py-6 h-auto rounded-full transition-all duration-300 transform hover:scale-105"
                onClick={() => (window.location.href = "/store-registration")}
              >
                Join Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mb-16 pt-10">
              <h2 className="text-3xl text-center font-bold text-gray-900 mb-8">
                Why Partner with ParishMart?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Your Cause, Your Storefront
                  </h3>
                  <p className="text-gray-700">
                    Join an online marketplace that empowers your mission and serves your community.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Generate Passive Income
                  </h3>
                  <p className="text-gray-700">
                    Earn referral fees on every transaction from your storefront.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Donations as Store Products
                  </h3>
                  <p className="text-gray-700">
                    Provide an easy way for your community to contribute to
                    causes by purchasing donation-based items.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Religious Gifts & Faith-Based Products
                  </h3>
                  <p className="text-gray-700">
                    Access to a curated selection of books, gifts, and essential
                    religious items.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Merch Store & Personalized Items
                  </h3>
                  <p className="text-gray-700">
                    Sell branded merchandise, customized apparel, and custom
                    products on demand.
                  </p>
                </div>
                
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    No Inventory or Fullfillment Required
                  </h3>
                  <p className="text-gray-700">
                    ParishMart manages product sourcing, fulfillment, and
                    customer services.
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
