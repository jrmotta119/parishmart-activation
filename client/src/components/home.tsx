import React, { useState, useEffect } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import GrowWithUs from "./GrowWithUs";
import ProductCarousel from "./ProductCarousel";
import ValueProposition from "./ValueProposition";
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
        <Header cartItemCount={cartItemCount} />
      </div>

      {/* Main Content with top padding to account for fixed header */}
      <main className="pt-10">
        {/* Hero Section */}
        <HeroSection/>

        {/* Grow With Us Section */}
        
        <GrowWithUs />
      

        {/* Product Carousel */}
        {/* <div id="products">
          <ProductCarousel
            onProductSelect={(product) => {
              // This now only handles product selection, not cart addition
              console.log("Product selected:", product.title);
            }}
          />
        </div> */}

        {/* Value Proposition */}
        {/* <ValueProposition /> */}

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
