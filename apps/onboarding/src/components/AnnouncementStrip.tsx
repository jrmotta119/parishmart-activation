import React, { useEffect, useState } from "react";

interface AnnouncementStripProps {
  message?: string;
}

const AnnouncementStrip = ({
  message = "When you make a purchase, a portion of the sale supports a mission",
}: AnnouncementStripProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full bg-[#006699] text-white py-2 fixed top-0 left-0 z-[60] transition-all duration-300">
      <div className="container mx-auto text-center text-sm font-medium">
        {message}
      </div>
    </div>
  );
};

export default AnnouncementStrip;
