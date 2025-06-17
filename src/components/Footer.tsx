import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Heart,
  MapPin,
  Globe,
  ChevronDown,
} from "lucide-react";

interface FooterProps {
  missionStatement?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  newsletterPlaceholder?: string;
  copyrightText?: string;
  onLanguageChange?: (language: string) => void;
}

const Footer = ({
  missionStatement = "ParishMart is dedicated to connecting communities through purpose-driven shopping. Every purchase you make directly supports community initiatives and charitable causes.",
  socialLinks = {
    facebook: "https://facebook.com/parishmart",
    twitter: "https://twitter.com/parishmart",
    instagram: "https://instagram.com/parishmart",
  },
  newsletterPlaceholder = "Enter your email",
  copyrightText = "© 2023 ParishMart. All rights reserved.",
  onLanguageChange = (language: string) =>
    console.log(`Language changed to ${language}`),
}: FooterProps) => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("English");

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    setIsLanguageDropdownOpen(false);
    onLanguageChange(language);
  };
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    console.log("Newsletter signup submitted");
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Mission Statement */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-[#006699] mr-2" />
              <h3 className="text-lg font-semibold">Our Mission description</h3>
            </div>
            <p className="text-gray-600 mb-4">{missionStatement}</p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://parishmart.com/pages/about-us"
                  className="text-gray-600 hover:text-[#006699] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://parishmart.com/collections/all-products"
                  className="text-gray-600 hover:text-[#006699] transition-colors"
                >
                  Marketplace
                </a>
              </li>
            
              <li>
                <a
                  href="https://parishmart.com/pages/contact"
                  className="text-gray-600 hover:text-[#006699] transition-colors"
                >
                  Contact Us
                </a>
              </li>
              
            </ul>
          </div>

          {/* Your Business */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Business</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/why-register"
                  className="text-gray-600 hover:text-[#006699] transition-colors"
                >
                  Partner with us
                </a>
              </li>
              <li>
                <a
                  href="/sell-with-us"
                  className="text-gray-600 hover:text-[#006699] transition-colors"
                >
                  Sell with us
                </a>
              </li>
              <li>
                <a
                  href="/donations"
                  className="text-gray-600 hover:text-[#006699] transition-colors"
                >
                  Donations
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for updates and special offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mb-4">
              <div className="flex">
                <Input
                  type="email"
                  placeholder={newsletterPlaceholder}
                  className="rounded-r-none focus:ring-[#006699] focus:border-[#006699]"
                  required
                />
                <Button
                  type="submit"
                  className="bg-[#006699] hover:bg-[#005588] text-white rounded-l-none"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <div className="flex space-x-4">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#006699] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#006699] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#006699] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              {copyrightText}
            </p>
            <div className="relative">
              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-[#006699] transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{currentLanguage}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute bottom-full mb-1 left-0 bg-white shadow-md rounded-md py-1 w-32 z-10">
                  <button
                    onClick={() => handleLanguageChange("English")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange("Español")}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Español
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-[#006699] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-[#006699] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-[#006699] transition-colors"
            >
              Shipping & Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
