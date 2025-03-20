import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star } from "lucide-react";

interface TestimonialProps {
  avatar?: string;
  name?: string;
  role?: string;
  content?: string;
  rating?: number;
}

const testimonials: TestimonialProps[] = [
  {
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    name: "Alice Johnson",
    role: "Parish Volunteer",
    content:
      "ParishMart has transformed how our community raises funds. The quality of products is exceptional, and the impact on our local initiatives has been tremendous.",
    rating: 5,
  },
  {
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    name: "Robert Chen",
    role: "Youth Minister",
    content:
      "Our youth group loves the merchandise from ParishMart. The designs are modern and appealing, and knowing each purchase supports our mission makes it even better.",
    rating: 5,
  },
  {
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    name: "Maria Garcia",
    role: "Community Leader",
    content:
      "I've been recommending ParishMart to everyone in our parish. The ordering process is seamless, and the products arrive quickly. It's shopping with real purpose.",
    rating: 4,
  },
  {
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    name: "James Wilson",
    role: "Parish Council Member",
    content:
      "As someone responsible for parish fundraising, I can't say enough good things about ParishMart. It's given us a sustainable way to support our community programs.",
    rating: 5,
  },
];

const TestimonialCard = ({
  avatar,
  name,
  role,
  content,
  rating = 5,
}: TestimonialProps) => {
  return (
    <Card className="h-full bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4 border-2 border-[#006699]">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-[#006699] text-white">
              {name?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-gray-900">{name}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>

        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>

        <p className="text-gray-600 flex-grow italic">"{content}"</p>
      </CardContent>
    </Card>
  );
};

interface TestimonialSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: TestimonialProps[];
}

const TestimonialSection = ({
  title = "What Our Community Says",
  subtitle = "Hear from the people who shop with purpose and serve with love",
  testimonials: customTestimonials = testimonials,
}: TestimonialSectionProps) => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="relative px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {customTestimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 pl-4 pr-4"
                >
                  <TestimonialCard
                    avatar={testimonial.avatar}
                    name={testimonial.name}
                    role={testimonial.role}
                    content={testimonial.content}
                    rating={testimonial.rating}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-6 bg-white hover:bg-gray-100 border border-gray-200" />
            <CarouselNext className="-right-4 md:-right-6 bg-white hover:bg-gray-100 border border-gray-200" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
