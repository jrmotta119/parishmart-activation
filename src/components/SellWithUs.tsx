import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const SellWithUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Banner Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sell With Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted online destination for Catholic faith resources and
              products
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-16">
            <img
              src="https://images.unsplash.com/photo-1556740772-1a741367b93e?w=1512&q=80"
              alt="Sell With ParishMart"
              className="w-full h-auto rounded-xl shadow-lg mb-8 max-h-[500px] object-cover"
            />
          </div>

          {/* Why Sell With Us Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Sell With Us
            </h2>
            <div className="bg-gray-50 rounded-xl p-8 mb-12">
              <p className="text-lg text-gray-700 mb-6">
                ParishMart, powered by Gurupia, is the first dedicated
                marketplace connecting Catholic parishes with trusted vendors,
                service providers, and community artisans. By selling on
                ParishMart, you gain access to a unique audience passionate
                about faith-based products and services. Our platform not only
                helps you expand your reach within Catholic communities but also
                contributes to meaningful causes, as parishes receive referral
                fees that support their missions. With easy onboarding, secure
                transactions, and a supportive network of parishes and
                parishioners, ParishMart offers a powerful channel to grow your
                business while making a positive impact.
              </p>
              <p className="text-lg text-gray-700 font-medium">
                Join us and become a part of a faith-driven marketplace that
                turns commerce into community support.
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Register to join
                </h3>
                <p className="text-gray-700">
                  Register to get the Custom feature set applied to your
                  account.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Enable your listings
                </h3>
                <p className="text-gray-700">
                  Once your account is registered, you'll be given access to
                  enable your product listings for customization.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Set up your experience
                </h3>
                <p className="text-gray-700">
                  Using our listing tool within PML, start configuring your
                  customization experiences.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start selling
                </h3>
                <p className="text-gray-700">
                  Start offering your Products or Services for our Parrish
                  community.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Benefits for Sellers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Targeted Audience
                </h3>
                <p className="text-gray-700">
                  Connect with customers who are specifically looking for
                  faith-based products and services.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Community Support
                </h3>
                <p className="text-gray-700">
                  Be part of a marketplace that supports parish missions and
                  community initiatives.
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
                  Secure Transactions
                </h3>
                <p className="text-gray-700">
                  Reliable payment processing and order management for peace of
                  mind.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Marketing Support
                </h3>
                <p className="text-gray-700">
                  Benefit from our platform's marketing efforts to parishes and
                  Catholic communities.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-[#006699] mb-2">
                  Growth Opportunity
                </h3>
                <p className="text-gray-700">
                  Expand your business reach to new customers across multiple
                  parish communities.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-8">
              Ready to grow your business while supporting Catholic communities?
            </p>
            <Button
              className="bg-[#006699] hover:bg-[#005588] text-white font-semibold text-lg px-8 py-6 h-auto rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={() =>
                (window.location.href = "/vendor-registration-form")
              }
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellWithUs;
