import React from "react";

interface TransparentImpactReportingProps {
  title?: string;
  description?: string;
  bulletPoints?: string[];
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
}

const TransparentImpactReporting = ({
  title = "Transparent Impact Reporting",
  description = "We publish quarterly reports detailing exactly how your purchases translate to community support. Our commitment to transparency means you can see the direct impact of your shopping.",
  bulletPoints = [
    "Detailed financial breakdowns",
    "Community project updates",
    "Impact measurement metrics",
  ],
  imageSrc = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
  imageAlt = "Community impact",
  imageCaption = "Local food bank supported by ParishMart purchases",
}: TransparentImpactReportingProps) => {
  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-50 p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
              <p className="text-gray-600 mb-6">{description}</p>
              <ul className="space-y-2">
                {bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-[#006699] mr-2"></div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white font-medium">{imageCaption}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransparentImpactReporting;
