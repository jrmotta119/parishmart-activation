import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialProps {
  initials: string;
  name: string;
  organization: string;
  content: string;
}

const testimonials: TestimonialProps[] = [
  {
    initials: "OA",
    name: "Fr. Omar Ayubi",
    organization: "Saint Katharine Drexel – Weston, FL",
    content:
      "As ParishMart began to take shape, we launched a pilot online store for our parish. I saw how a simple, well-structured initiative aligned with the mission of the Church can evangelize through action — strengthening parish life and generating resources in an organized and transparent way, always in service of the pastoral mission.",
  },
  {
    initials: "MV",
    name: "María Angélica Valencia",
    organization: "Schoenstatt Apostolic Movement – Miami",
    content:
      "More than a platform, ParishMart became a providential tool for our mission — enabling fundraising, uniting missionaries across the country, and generating tangible support.",
  },
  {
    initials: "SR",
    name: "Soly Rodríguez",
    organization: "Schoenstatt Movement",
    content:
      "ParishMart has enabled us to manage multiple online stores for different apostolic initiatives in a simple and organized way. It has become a strategic tool that strengthens our mission — transforming community engagement into sustainable, tangible support for our causes.",
  },
];

const TestimonialCard = ({ initials, name, organization, content }: TestimonialProps) => {
  return (
    <Card className="h-full bg-white border-2 border-gray-200 shadow-md">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-5">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className="bg-[#006699] text-white font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <p className="text-sm text-gray-500 italic">{organization}</p>
          </div>
        </div>
        <p className="text-gray-600 flex-grow italic leading-relaxed">"{content}"</p>
      </CardContent>
    </Card>
  );
};

const TestimonialSection = () => {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <section className="py-20 px-4 md:px-8 bg-white w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header row with nav buttons on the right */}
        <div className="flex items-end justify-between mb-12">
          <div className="text-left">
            <p className="text-lg text-gray-500">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Faith in Action</h2>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => api?.scrollPrev()}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#006699] hover:text-[#006699] transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#006699] hover:text-[#006699] transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <TestimonialCard
                  initials={testimonial.initials}
                  name={testimonial.name}
                  organization={testimonial.organization}
                  content={testimonial.content}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;
