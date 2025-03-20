import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const DonationsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header cartItemCount={0} />

      {/* Main Content with top padding to account for fixed header */}
      <main className="flex-grow flex flex-col items-center justify-center pt-20 px-4 text-center">
        <div className="max-w-4xl mx-auto py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#006699] mb-8">
            Donations Coming Soon...
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            We're working on a powerful platform to help you raise funds for
            your parish, ministry, or charitable cause. Check back soon!
          </p>
          <div className="relative w-full max-w-2xl mx-auto h-64 md:h-96 overflow-hidden rounded-lg shadow-xl mb-12">
            <img
              src="https://images.unsplash.com/photo-1607275121013-8ab4e8532f8e?w=1200&q=80"
              alt="Donations"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#006699] bg-opacity-20 flex items-center justify-center">
              <span className="text-white text-2xl md:text-4xl font-bold px-6 py-4 bg-[#006699] bg-opacity-70 rounded-lg">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DonationsPage;
