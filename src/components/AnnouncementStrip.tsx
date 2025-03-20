import React from "react";

interface AnnouncementStripProps {
  message?: string;
}

const AnnouncementStrip = ({
  message = "When you make a purchase, a portion of the sale supports your Parish.",
}: AnnouncementStripProps) => {
  return (
    <div className="w-full bg-[#006699] text-white py-2">
      <div className="container mx-auto text-center text-sm font-medium">
        {message}
      </div>
    </div>
  );
};

export default AnnouncementStrip;
