import React from "react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { ShoppingCart, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "./auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo1.png";

interface HeaderProps {
  logo?: string;
  isMenuOpen?: boolean;
  onMenuToggle?: () => void;
  onCartClick?: () => void;
  cartItemCount?: number;
}

export const shopCategories = [
  {
    name: "Apparel & Accessories",
    subcategories: [
      "Clothing, Footwear, and Accessories",
      "Uniforms, Workwear, and Custom Merchandise",
    ],
  },
  {
    name: "Electronics & Technology",
    subcategories: [
      "Mobile Devices, Laptops, and Accessories",
      "Audio/Video Equipment and Security Systems",
    ],
  },
  {
    name: "Home & Living",
    subcategories: [
      "Furniture, Kitchenware, and Home Decor",
      "Cleaning Supplies and Household Essentials",
      "Religious Paintings & Icons",
    ],
  },
  {
    name: "Automotive & Transportation",
    subcategories: [
      "Car Parts, Tools, and Accessories",
      "Electric Scooters, Bikes, and Mobility Solutions",
    ],
  },
  {
    name: "Food & Beverages",
    subcategories: [
      "Packaged Foods, Snacks, and Specialty Items",
      "Beverages, Coffee, and Tea",
    ],
  },
  {
    name: "Outdoor & Gardening",
    subcategories: [
      "Gardening Tools, Plants, and Landscaping Supplies",
      "Outdoor Furniture and Equipment",
    ],
  },
  {
    name: "Religious Products",
    subcategories: [
      "Liturgical Supplies, Sacramental Gifts, and Apparel",
      "Bibles, Prayer Books, and Devotional Items",
    ],
  },
  {
    name: "Toys, Games & Hobbies",
    subcategories: [
      "Educational Games, Board Games, and Crafts",
      "Sports Equipment and Musical Instruments",
    ],
  },
  {
    name: "Gifts & Souvenirs",
    subcategories: [
      "Personalized Items, Cards, and Custom Keepsakes",
      "Handmade Artisan Products from Local Communities",
    ],
  },
];

export const marketplaceCategories = [
  {
    name: "Community Businesses",
    subcategories: [
      "Meraki",
      "Dry Steam Pro",
      "Sebanda Insurance Weston",
      "PaleoLife",
      "Armando Fit",
      "Immigration Law Office",
      "Rent A Boat In Miami",
      "HarpsClub Store",
    ],
  },
  {
    name: "Fund Raising Stores",
    subcategories: ["Schoenstatt Store", "Emmaus"],
  },
  {
    name: "Products and Services",
    subcategories: [
      "Immigration Legal Services",
      "Rent a Boat with a Captain",
      "Cakes and Desserts",
      "Fitness Coach",
      "Insurance Broker",
      "Professional Floor Cleaning",
      "Custom Brand-Name Merchandise",
      "Natural Premium Supplements Store",
    ],
  },
];

const Header = ({
  isMenuOpen = false,
  onMenuToggle = () => console.log("Menu toggled"),
  onCartClick = () => console.log("Cart clicked"),
  cartItemCount = 0,
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(isMenuOpen);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    onMenuToggle();
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm left-0 z-50">
        {/* Top Row: Logo and Search Bar */}
        <div className="container mx-auto px-4 flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="h-12 flex items-center">
              <img
                src={logo}
                alt="ParishMart Logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>
          {/* Search Bar (visible on md+) */}
          {/* <div className="hidden md:flex items-center ml-8 flex-1 max-w-md justify-end">
            <input
              type="text"
              placeholder="Search for religious items, rosaries, bibles..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent"
            />
          </div> */}
        </div>
        {/* Bottom Row: Navigation Links */}
        <div className="w-full border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4">
            <nav className="flex justify-center space-x-8 h-12 items-center">
              <a
                href="/why-register"
                className="text-[#006699] hover:text-[#005588] px-2 py-1 text-sm font-medium"
              >
                Partner with us
              </a>
              <a
                href="/sell-with-us"
                className="text-[#006699] hover:text-[#005588] px-2 py-1 text-sm font-medium"
              >
                Sell with us
              </a>
              <a
                href="/launch-cause"
                className="text-[#006699] hover:text-[#005588] px-2 py-1 text-sm font-medium"
              >
                Launch your cause
              </a>
              <a
                href="https://shop.parishmart.com/"
                className="text-[#006699] hover:text-[#005588] px-2 py-1 text-sm font-medium"
              >
                Marketplace
              </a>
              
              <a
                href="/about-us"
                className="text-[#006699] hover:text-[#005588] px-2 py-1 text-sm font-medium"
              >
                About us
              </a>
              
            </nav>
          </div>
        </div>
        {/* Mobile Menu Button and Drawer (unchanged) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white absolute top-20 left-0 w-full shadow-md max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col p-4">
              <a
                href="https://parishmart.com/collections/all-products"
                className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
              >
                Shop
              </a>
              <a
                href="https://parishmart.com/collections/localbusinesses"
                className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
              >
                Marketplace
              </a>

              <div className="border-t border-gray-200 my-2"></div>

              <a
                href="/about-us"
                className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
              >
                About
              </a>
              <a
                href="https://parishmart.com/pages/contact"
                className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
              >
                Contact Us
              </a>
              {/* mobile user login and logout */}
              {/* {user ? (
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("./login");
                  }}
                  className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("./login")}
                    className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("./signup")}
                    className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
                  >
                    Sign Up
                  </button>
                </>
              )} */}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
