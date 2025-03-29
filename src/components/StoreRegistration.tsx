import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const StoreRegistration = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Store Registration
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expand your outreach and support a cause by opening a web store
              with us. Whether you're a parish, church, or non-profit, we make
              it easy to sell products, fundraise, and grow your community
              online. Start today and make a bigger impact!
            </p>
          </div>

          <div className="mb-16">
            <div className="bg-gray-50 rounded-xl p-8 mb-12">
              <p className="text-lg text-gray-700 mb-6">
                ParishMart is more than just an online store—it is a platform
                designed to support parishes, churches, and non-profits and
                their communities. Through ParishMart, you can offer a curated
                marketplace that connects local businesses, community
                fundraising, donation-based products, personalized merchandise,
                and faith-inspired gifts.
              </p>
              <p className="text-lg text-gray-700">
                This innovative solution allows parishes to raise funds, support
                their members, and promote evangelization—all with zero
                investment, no inventory, and no operational burden.
              </p>
            </div>

            <div className="mb-16">
              <img
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1512&q=80"
                alt="ParishMart Solution"
                className="w-full h-auto rounded-xl shadow-lg mb-8 max-h-[600px] object-cover"
              />
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Why Partner with ParishMart?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Your Cause, Your Platform
                  </h3>
                  <p className="text-gray-700">
                    Create an online marketplace that reflects your mission and
                    serves your community.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Support Local Businesses
                  </h3>
                  <p className="text-gray-700">
                    Offer products and services from trusted local vendors,
                    while supporting your cause.
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
                    Merch Store & Personalized Items
                  </h3>
                  <p className="text-gray-700">
                    Sell branded merchandise, customized apparel, and custom
                    products on demand.
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
                    Generate Passive Income
                  </h3>
                  <p className="text-gray-700">
                    Earn referral fees starting at 10% on every transaction.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    No Inventory Required
                  </h3>
                  <p className="text-gray-700">
                    ParishMart manages product sourcing, fulfillment, and
                    customer service.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Flexible Ordering
                  </h3>
                  <p className="text-gray-700">
                    No minimum purchase requirements—order only what is needed.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    Fast & Reliable Fulfillment
                  </h3>
                  <p className="text-gray-700">
                    Standard orders ship in 3-5 days, while personalized items
                    arrive in 7-15 days.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#006699] mb-2">
                    24/7 Support
                  </h3>
                  <p className="text-gray-700">
                    Dedicated assistance for you and your customers at any time.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
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
                    Gain access to your own community-driven online marketplace.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Customize Your Store
                  </h3>
                  <p className="text-gray-700">
                    Select and feature products that benefit your community and
                    local businesses.
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
                    Share your ParishMart store link and start raising funds for
                    your cause.
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
                Register Now
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

export default StoreRegistration;
