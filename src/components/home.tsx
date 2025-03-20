import React, { useState } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import GrowWithUs from "./GrowWithUs";
import ProductCarousel from "./ProductCarousel";
import ValueProposition from "./ValueProposition";
import TestimonialSection from "./TestimonialSection";
import TransparentImpactReporting from "./TransparentImpactReporting";
import Footer from "./Footer";
import Notification from "./Notification";
import AnnouncementStrip from "./AnnouncementStrip";

interface HomePageProps {
  showNotification?: boolean;
  notificationType?: "success" | "error" | "info" | "warning";
  notificationMessage?: string;
}

const HomePage = ({
  showNotification = false,
  notificationType = "success",
  notificationMessage = "Item added to cart successfully!",
}: HomePageProps) => {
  const [notification, setNotification] = useState({
    visible: showNotification,
    type: notificationType,
    message: notificationMessage,
  });

  const [cartItemCount, setCartItemCount] = useState(0);

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  const showCartNotification = (productName: string) => {
    setNotification({
      visible: true,
      type: "success",
      message: `${productName} added to cart successfully!`,
    });
    setCartItemCount((prevCount) => {
      console.log("Previous count:", prevCount);
      return prevCount + 1;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header cartItemCount={cartItemCount} />

      {/* Main Content with top padding to account for fixed header */}
      <main className="pt-20">
        <AnnouncementStrip />
        {/* Hero Section */}
        <HeroSection
          onCtaClick={() => {
            // Scroll to product section
            document
              .getElementById("products")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Grow With Us Section */}
        <GrowWithUs />

        {/* Product Carousel */}
        <div id="products">
          <ProductCarousel
            onProductSelect={(product) => {
              // This now only handles product selection, not cart addition
              console.log("Product selected:", product.title);
            }}
          />
        </div>

        {/* Value Proposition */}
        <ValueProposition />

        {/* Footer */}
        <Footer />
      </main>

      {/* Notification */}
      <Notification
        type={notification.type}
        title={
          notification.type === "success"
            ? "Success"
            : notification.type === "error"
              ? "Error"
              : "Notification"
        }
        message={notification.message}
        isVisible={notification.visible}
        onClose={handleCloseNotification}
        autoClose={true}
        duration={3000}
      />
    </div>
  );
};

export default HomePage;
