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
      <header className="w-full h-20 bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
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

          {/* Desktop Navigation with Dropdown Menus */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#006699] hover:text-[#005588] px-4 py-2 text-sm font-medium bg-transparent hover:bg-gray-50">
                    <NavigationMenuLink
                      href="/shop"
                      className="text-[#006699] hover:text-[#005588] px-4 py-2 text-sm font-medium bg-transparent hover:bg-gray-50 flex items-center gap-1"
                    >
                      Shop
                    </NavigationMenuLink>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-3 gap-3 p-4 w-[900px] bg-white">
                      {shopCategories.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="font-medium text-[#006699]">
                            {category.name}
                          </h3>
                          <ul className="space-y-1">
                            {category.subcategories.map((subcat, idx) => (
                              <li key={idx}>
                                <NavigationMenuLink
                                  href={`./products/${category.name.toLowerCase().replace(/\s+/g, "-")}/${subcat.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="block text-sm text-gray-600 hover:text-[#006699] hover:underline"
                                >
                                  {subcat}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#006699] hover:text-[#005588] px-4 py-2 text-sm font-medium bg-transparent hover:bg-gray-50">
                  <NavigationMenuLink
                      href="/marketplace"
                      className="text-[#006699] hover:text-[#005588] px-4 py-2 text-sm font-medium bg-transparent hover:bg-gray-50 flex items-center gap-1"
                    >
                      Marketplace
                    </NavigationMenuLink>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-3 gap-3 p-4 w-[600px] bg-white">
                      {marketplaceCategories.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="font-medium text-[#006699]">
                            {category.name}
                          </h3>
                          <ul className="space-y-1">
                            {category.subcategories.map((subcat, idx) => (
                              <li key={idx}>
                                <NavigationMenuLink
                                  href={`/marketplace/vendor/${subcat.toLowerCase().replace(/\s+/g, "-")}`}
                                  className="block text-sm text-gray-600 hover:text-[#006699] hover:underline"
                                >
                                  {subcat}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center mx-4 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search for religious items, rosaries, bibles..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006699] focus:border-transparent"
            />
          </div>

          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-[#006699] hover:text-[#005588] px-4 py-2 text-sm font-medium"
                    href="./about"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-[#006699] hover:text-[#005588] px-4 py-2 text-sm font-medium"
                    href="./contact"
                  >
                    Contact Us
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons and Cart */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-[#006699] mr-2">
                    Hello, {user.user_metadata?.full_name || "User"}
                  </span>
                  <Button
                    variant="outline"
                    className="text-[#006699] border-[#006699] hover:bg-[#006699] hover:text-white"
                    onClick={async () => {
                      await signOut();
                      navigate("./login");
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="text-[#006699] border-[#006699] hover:bg-[#006699] hover:text-white"
                    onClick={() => navigate("./login")}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-[#006699] hover:bg-[#005588] text-white"
                    onClick={() => navigate("./signup")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative text-[#006699] hover:text-[#005588] hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#006699] hover:text-[#005588] hover:bg-gray-100"
              onClick={handleMobileMenuToggle}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white absolute top-20 left-0 w-full shadow-md max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col p-4">
              <div className="py-2 px-4 text-[#006699] font-medium">
                Shop Categories
              </div>
              {shopCategories.map((category, index) => (
                <div key={index} className="ml-4">
                  <div className="py-1 px-4 text-[#006699] font-medium">
                    {category.name}
                  </div>
                  <div className="ml-4">
                    {category.subcategories.map((subcat, idx) => (
                      <a
                        key={idx}
                        href={`./products/${category.name.toLowerCase().replace(/\s+/g, "-")}/${subcat.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block py-1 px-4 text-sm text-gray-600 hover:text-[#006699]"
                      >
                        {subcat}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              <div className="py-2 px-4 text-[#006699] font-medium mt-2">
                Marketplace
              </div>
              {marketplaceCategories.map((category, index) => (
                <div key={index} className="ml-4">
                  <div className="py-1 px-4 text-[#006699] font-medium">
                    {category.name}
                  </div>
                  <div className="ml-4">
                    {category.subcategories.map((subcat, idx) => (
                      <a
                        key={idx}
                        href={`/marketplace/vendor/${subcat.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block py-1 px-4 text-sm text-gray-600 hover:text-[#006699]"
                      >
                        {subcat}
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 my-2"></div>

              <a
                href="./about"
                className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
              >
                About
              </a>
              <a
                href="./contact"
                className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
              >
                Contact Us
              </a>
              {user ? (
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
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
