import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import logo from "../assets/logo1.png";

interface HeaderProps {
  cartItemCount?: number;
}

// Kept for backward-compat — used by ShopPage, MarketplacePage, ProductsPage, VendorProfilePage
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

const NAV_LINKS = [
  { label: "Parishes", href: "/parish-activation" },
  { label: "Local Business", href: "/vendor-registration-form" },
  { label: "Sponsors", href: "/sponsor-activation" },
  { label: "Marketplace", href: "https://shop.parishmart.com/", external: true },
  { label: "About", href: "/about-us" },
];

const Header = (_props: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">

        {/* Logo — always visible */}
        <Link to="/" className="flex-shrink-0 mr-2">
          <img src={logo} alt="ParishMart" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map((link) => {
            const isActive = !link.external && pathname.startsWith(link.href);
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-[#006699] rounded-lg hover:bg-[#e8f4f9] transition-colors"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-[#006699] bg-[#e8f4f9]"
                    : "text-gray-600 hover:text-[#006699] hover:bg-[#e8f4f9]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Activate CTA + mobile toggle */}
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/activate"
            className="hidden md:inline-flex items-center gap-1.5 bg-[#006699] hover:bg-[#1e3960] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm"
          >
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#006699] hover:bg-[#e8f4f9] rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#006699] hover:bg-[#e8f4f9] rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <div className="pt-2">
            <Link
              to="/activate"
              className="flex items-center justify-center gap-2 w-full bg-[#006699] hover:bg-[#1e3960] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
