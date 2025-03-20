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
import { useNavigate } from "react-router-dom";
// Import logo directly

interface HeaderProps {
  logo?: string;
  isMenuOpen?: boolean;
  onMenuToggle?: () => void;
  onCartClick?: () => void;
  cartItemCount?: number;
}

const shopCategories = [
  {
    name: "Bibles & Religious Texts",
    subcategories: [
      "Bibles (Douay-Rheims, NAB, RSV-CE, Latin Vulgate)",
      "Study Bibles & Commentaries",
      "Catechism of the Church",
      "Missals (Daily, Sunday, Latin, Tridentine)",
      "Prayer Books & Devotionals",
      "Lives of the Saints & Biographies",
      "Papal Documents & Encyclicals",
    ],
  },
  {
    name: "Jewelry & Accessories",
    subcategories: [
      "Crucifix & Cross Necklaces",
      "Saint Medals (St. Benedict, St. Michael, Miraculous Medal, etc.)",
      "Rosary Bracelets & Rings",
      "Scapulars (Brown, Green, Red, Blue, White)",
      "Papal & Vatican Jewelry",
      "Patron Saint Keychains & Charms",
    ],
  },
  {
    name: "Home Décor & Art",
    subcategories: [
      "Statues & Figurines (Jesus, Mary, Saints, Angels)",
      "Wall Crucifixes & Crosses",
      "Religious Paintings & Icons",
      "Holy Water Fonts & Bottles",
      "Advent & Christmas Decorations (Nativity Sets, Star of Bethlehem)",
      "Religious Plaques & Inspirational Signs",
    ],
  },
  {
    name: "Music & Media",
    subcategories: [
      "Gregorian Chant & Sacred Music",
      "Hymnals & Worship Music",
      "Religious Movies (Marian Apparitions, Saints' Lives, The Passion)",
      "Audiobooks & Podcasts",
      "Latin Mass Recordings",
    ],
  },
  {
    name: "Clothing & Apparel",
    subcategories: [
      "Marian & Saint-Themed T-Shirts",
      "Hoodies & Sweatshirts",
      "Clergy & Religious Habit Apparel",
      "Mantillas & Veils for Mass",
      "Hats & Accessories",
    ],
  },
  {
    name: "Children's Items",
    subcategories: [
      "Children's Bibles & Storybooks",
      "First Communion Gifts & Keepsakes",
      "Dolls & Plush Toys",
      "Kids' Rosaries & Prayer Cards",
      "Coloring & Activity Books",
    ],
  },
  {
    name: "Sacramental Gifts & Devotional Items",
    subcategories: [
      "Baptism Gifts (Baby Crosses, Christening Gowns)",
      "First Communion Sets (Rosary, Missal, Medal, Candle)",
      "Confirmation Gifts (Holy Spirit Medals, Saint Books)",
      "Wedding & Anniversary Religious Gifts",
      "Ordination & Clergy Appreciation Gifts",
    ],
  },
  {
    name: "Devotional & Spirituality Items",
    subcategories: [
      "Rosaries (Handmade, Wooden, Crystal, Luminous, Cord)",
      "Chaplets (Divine Mercy, St. Michael, Holy Face, Seven Sorrows)",
      "Novena & Prayer Cards",
      "Holy Water & Blessed Oils",
      "Saint Relics & Ex-Voto Offerings",
      "Pilgrimage Souvenirs (Lourdes Water, Fatima Statues)",
    ],
  },
  {
    name: "Seasonal & Liturgical Calendar Items",
    subcategories: [
      "Advent Wreaths & Candles",
      "Lenten Devotional Books & Stations of the Cross Items",
      "Easter Decorations & Religious Gifts",
      "Christmas Ornaments & Nativity Sets",
      "Feast Day Celebrations Items",
    ],
  },
  {
    name: "Books & Study Materials",
    subcategories: [
      "Theology & Apologetics (Church Fathers, Doctors of the Church)",
      "Lives & Writings of the Saints",
      "Papal Encyclicals & Vatican Documents",
      "Traditional Latin Mass Resources",
      "Marian Apparitions & Devotions",
    ],
  },
  {
    name: "Personalized & Custom Items",
    subcategories: [
      "Engraved Crucifixes & Plaques",
      "Customized Rosaries & Chaplets",
      "Personalized Bible Covers",
      "Name-Engraved Medals & Jewelry",
    ],
  },
  {
    name: "Holy Land & Pilgrimage Items",
    subcategories: [
      "Olive Wood Crosses & Statues",
      "Lourdes & Fatima Holy Water Bottles",
      "Imported Incense & Anointing Oils",
      "Relic Cards & Medals",
    ],
  },
];

const marketplaceCategories = [
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
            <a href="/" className="h-12 flex items-center">
              <img
                src="/logo1.png"
                alt="ParishMart Logo"
                className="h-12 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </a>
          </div>

          {/* Desktop Navigation with Dropdown Menus */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[#006699] hover:text-[#005588] px-4 py-2 text-sm font-medium bg-transparent hover:bg-gray-50">
                    <NavigationMenuLink
                      href="/products"
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
                                  href={`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}/${subcat.toLowerCase().replace(/\s+/g, "-")}`}
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
                    Marketplace
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
                                  href={`/marketplace/${category.name.toLowerCase().replace(/\s+/g, "-")}/${subcat.toLowerCase().replace(/\s+/g, "-")}`}
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
                    href="/about"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="text-[#006699] hover:text-[#005588] px-4 py-2 text-sm font-medium"
                    href="/contact"
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
                      navigate("/login");
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
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-[#006699] hover:bg-[#005588] text-white"
                    onClick={() => navigate("/signup")}
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
                        href={`/products/${category.name.toLowerCase().replace(/\s+/g, "-")}/${subcat.toLowerCase().replace(/\s+/g, "-")}`}
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
                        href={`/marketplace/${category.name.toLowerCase().replace(/\s+/g, "-")}/${subcat.toLowerCase().replace(/\s+/g, "-")}`}
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
                href="/about"
                className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
              >
                About
              </a>
              <a
                href="/contact"
                className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
              >
                Contact Us
              </a>
              {user ? (
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/login");
                  }}
                  className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="py-2 px-4 text-[#006699] hover:bg-gray-100 rounded-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
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
