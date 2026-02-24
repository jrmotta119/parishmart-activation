import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

interface HeaderProps {
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

const Header = (_props: HeaderProps) => {
  return (
    <header className="w-full bg-gray-50 shadow-sm z-50">
      {/* Logo row */}
      <div className="container mx-auto px-4 flex items-center h-20">
        <Link to="/" className="h-12 flex items-center">
          <img src={logo} alt="ParishMart Logo" className="h-12 w-auto" />
        </Link>
      </div>

      {/* Nav row */}
      <div className="w-full border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4">
          <nav className="flex justify-center items-center h-12 gap-1 md:gap-8 overflow-x-auto">
            <a
              href="/why-register"
              className="text-[#006699] hover:text-[#005588] px-2 py-1 text-xs md:text-sm font-medium whitespace-nowrap"
            >
              Partner with us
            </a>
            <a
              href="/sell-with-us"
              className="text-[#006699] hover:text-[#005588] px-2 py-1 text-xs md:text-sm font-medium whitespace-nowrap"
            >
              Sell with us
            </a>
            <a
              href="https://shop.parishmart.com/"
              className="text-[#006699] hover:text-[#005588] px-2 py-1 text-xs md:text-sm font-medium whitespace-nowrap"
            >
              Marketplace
            </a>
            <a
              href="/about-us"
              className="text-[#006699] hover:text-[#005588] px-2 py-1 text-xs md:text-sm font-medium whitespace-nowrap"
            >
              About us
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
