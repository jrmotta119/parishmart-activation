import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const SellWithUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Banner Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sell With Us
            </h1>
          </div>
          {/* Why Sell With Us Section */}
          <div className="mb-16">
            <div className=" rounded-xl p-0 mb-12">
              <p className="text-lg text-center text-gray-700 mb-6">
                By selling on ParishMart, you gain access to a unique audience passionate about purpose-driven shopping. Our platform helps expand your reach while contributing a portion of each sale to a meaningful cause. With easy onboarding, secure transactions, and a supportive network, ParishMart offers a powerful way to grow your business while making a positive impact.
              </p>
              <p className="text-lg text-center text-gray-700 font-medium">
                Ready to grow your business and support meaningful missions?
                
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select Your Membership
                </h3>
                <p className="text-gray-700">
                  Explore and select the membership that best suits your needs.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Complete Your Registration
                </h3>
                <p className="text-gray-700">
                  Provide your business information and set up your listings.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="w-12 h-12 bg-[#006699] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start Selling
                </h3>
                <p className="text-gray-700">
                  Amplify your reach and offer your products and services to our
                  community.
                </p>
              </div>
            </div>
          </div>
          {/* CTA Section */}
          <div className="text-center mb-16">
            <p className="text-xl text-gray-700 mb-8">
              Join us today and become part of a marketplace where commerce turns into community support.
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
