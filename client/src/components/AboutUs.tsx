import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

const AboutUs = () => {
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
        <Header />
      </div>
      
      <div className="pt-10">
        {/* Main Title */}
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            About Us
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-center text-gray-700 mb-8">
            ParishMart - Shop with purpose, serve with love.
          </p>
          {/* YouTube Video */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full rounded-xl shadow-lg"
                src="https://www.youtube.com/embed/yT9ZlgoEQyg"
                title="About ParishMart Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </div>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
            ParishMart is more than a marketplace—it's a mission uniting faith, service, and entrepreneurship.
            We bring faith-based communities, mission-driven causes and values-aligned businesses to create
            a marketplace where every transaction supports a greater purpose.
          </p>
        </div>

        {/* Mission and Vision Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="text-center lg:text-left">
              <div className="bg-blue-100 rounded-lg mb-6 h-48 flex items-center justify-center overflow-hidden">
                <img
                  src="https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/friends-embracing-beach-looking-sky.jpg"
                  alt="Mission - Helping hands"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                At ParishMart, we strive to turn everyday transactions into opportunities to support missions, 
                empower entrepreneurs, and uplift those called to serve.
              </p>
            </div>

            {/* Vision */}
            <div className="text-center lg:text-left">
              <div className="bg-blue-100 rounded-lg mb-6 h-48 flex items-center justify-center overflow-hidden">
                <img
                  src="https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/couple-s-hand-holding-tied-valentine-gift.jpg"
                  alt="Vision - Future planning"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To inspire a movement where purpose-driven commerce fuels generosity—enabling missions to flourish, 
                communities to thrive, and local businesses to succeed through shared purpose and meaningful support.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">Our Values</h2>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="faith">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-[#006699]">
                    Faith & Integrity
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Guided by moral principles and transparency.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="community">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-[#006699]">
                    Community
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Strengthening bonds between congregations and their members, entrepreneurs and their shoppers, 
                    and causes and their supporters. Created by the community, to serve the community.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="service">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-[#006699]">
                    Service
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Turning everyday actions into meaningful impact.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="evangelization">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-[#006699]">
                    Evangelization Through Action
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Inspiring others by living our values.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="empowerment">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-[#006699]">
                    Empowerment
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Enabling individuals and organizations to thrive with purpose.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="flex items-start justify-center mt-16 lg:mt-20">
              <div className="bg-blue-100 rounded-lg h-64 w-full flex items-center justify-center overflow-hidden">
                <img
                  src="https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/strength-people-hands-success-meeting.jpg"
                  alt="Values - Community and trust"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Our Origins Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Origins - Connecting the Dots with Purpose
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-xl italic text-gray-700 mb-8 text-center border-l-4 border-[#006699] pl-6">
              "In his iconic commencement speech at Stanford University on June 12, 2005, Steve Jobs said: 
              'You can't connect the dots looking forward; you can only connect them looking backward.'"
            </blockquote>
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                That phrase has stayed with us for years. And now, looking back, we realize that ParishMart 
                is the natural result of all the dots in our journey — the good ones, the difficult ones, 
                and those only God could have placed in our path.
              </p>
              
              <p>
                We are a family of entrepreneurs, immigrants, and believers. Over the past 30 years, we've 
                launched businesses in several industries, explored the digital frontier of e-commerce and 
                payment systems, and raised a family grounded in faith and resilience. Our story took a bold 
                turn when we had to start over in the United States, as adults, with two young daughters to 
                raise, facing uncertainty but driven by deep gratitude and determination.
              </p>
              
              <p>
                The road hasn't been easy. But through every challenge, we've seen the hand of God guiding us. 
                His timing, though not always understood at the moment, has been perfect. He never abandoned us — 
                He strengthened us. We feel truly blessed by the support this country has given us, opening its 
                doors and allowing us to begin again.
              </p>
              
              <p>
                ParishMart is the fruit of that journey. It's not just a marketplace — it's a mission. A platform 
                built to give back. To support our parishes, uplift our communities, and empower meaningful causes. 
                It brings together everything we've learned about business, people, and above all, faith.
              </p>
              
              <p>
                Through ParishMart, we want to share that experience. To offer a tool for churches, nonprofits, 
                and small businesses to generate income with purpose. To build a space where every transaction 
                supports something greater.
              </p>
            </div>
            
            <p className="text-xl font-semibold text-gray-900 mt-8 text-center">
              ParishMart is from the community, for the community. A place where faith becomes action, 
              and generosity becomes a way of life.
            </p>
            
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-blue-100 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/tourists-go-up-hill-sunrise.jpg"
                    alt="Entrepreneurship journey"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-blue-100 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/app-woman-white-solution-closeup-two.jpg"
                    alt="Faith and family"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-blue-100 rounded-lg h-48 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/businesses_w_t.png"
                    alt="Community support"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How It Works - A Virtuous Cycle of Support
          </h2>
          
          <div className="space-y-12">
            {/* For Religious Institutions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Religious Institutions:</h3>
                <p className="text-gray-600 leading-relaxed">
                  ParishMart offers a unique way for parishes, churches, and faith-based organizations to earn 
                  passive income that directly supports their missions, outreach programs, and community initiatives. 
                  By promoting products and services offered by their own members, they help local entrepreneurs 
                  grow while strengthening ties within the congregation. Our platform also provides digital tools 
                  that make it easy to engage the community and extend their impact beyond their walls.
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg h-64 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1719208829083-3c528a2c959a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Religious institution" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* For Sellers & Entrepreneurs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Sellers & Entrepreneurs:</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sellers and local business owners aligned with a purpose can use ParishMart to reach a dedicated 
                  audience that values mission-driven commerce. Every product or service sold not only grows their 
                  business but also contributes to the greater good by supporting local churches, parishes and missions. 
                  It's a chance for their business to do well—while doing good.
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg h-64 flex items-center justify-center overflow-hidden lg:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Entrepreneurs and business" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* For Shoppers & Supporters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Shoppers & Supporters:</h3>
                <p className="text-gray-600 leading-relaxed">
                  Shoppers on ParishMart can discover meaningful, purpose-driven products and services that reflect 
                  their beliefs and support their communities. Every purchase becomes a way to give back—helping fund 
                  church programs, empower local businesses, and support the missions that matter most. It's commerce 
                  with a conscience—where shopping becomes a purpose.
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg h-64 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Shoppers and supporters" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Join the Movement Section */}
        <div className="bg-[#006699] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
            <p className="text-xl mb-6 max-w-3xl mx-auto">
              When you buy, sell, or support ParishMart, you help build stronger communities and bring faith to life through action.
            </p>
            <p className="text-2xl font-bold mb-8">
              Together, let's make commerce a force for good.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="bg-white text-[#006699] hover:bg-gray-100 border-white"
                onClick={() => window.location.href = '/why-register'}
              >
                Partner with Us
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-[#006699] hover:bg-gray-100 border-white"
                onClick={() => window.location.href = '/sell-with-us'}
              >
                Sell with Us
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-[#006699] hover:bg-gray-100 border-white"
                onClick={() => window.location.href = 'https://parishmart.com'}
              >
                Support our Mission
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs; 