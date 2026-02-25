import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Check,
  ChevronRight,
  X,
  Store,
  BarChart3,
  Gift,
  BookOpen,
  Package,
  TrendingUp,
  Heart,
  ShieldCheck,
  Layers,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementStrip from "./AnnouncementStrip";

// ─── Data ────────────────────────────────────────────────────────────────────

const valueBarItems = [
  "Structured parish–business collaboration",
  "Increased engagement beyond donations",
  "Sustainable revenue growth",
  "Zero operational risk",
];

const howItWorksSteps = [
  {
    number: "1",
    title: "Launch Your Store",
    body: "Complete the onboarding form and begin building your personalized storefront aligned with your mission.",
    cta: { label: "Register Today!", href: "/store-registration" },
  },
  {
    number: "2",
    title: "Activate Your Community & Businesses",
    body: "Showcase curated products and invite your community and local businesses to support your mission.",
    cta: null as null,
  },
  {
    number: "3",
    title: "Generate Ongoing Support",
    body: "A portion of every purchase made through your store flows back to your parish or cause — creating sustainable, mission-aligned revenue.",
    cta: null as null,
  },
];

const whatYouReceiveItems = [
  {
    icon: Store,
    title: "Your Mission. Your Storefront.",
    body: "A fully personalized storefront reflecting your mission identity.",
  },
  {
    icon: Check,
    title: "Simple, Guided Onboarding",
    body: "A clear and user-friendly process to launch and manage your store with confidence.",
  },
  {
    icon: BarChart3,
    title: "Transparent Revenue Tracking",
    body: "A dedicated dashboard with clear reporting on purchases, tithes, and donations.",
  },
  {
    icon: Gift,
    title: "Donations as Store Products",
    body: "Redefined giving — every donation shares a story.",
  },
  {
    icon: BookOpen,
    title: "Religious & Faith-Based Products",
    body: "Access a curated selection of books, gifts, and essential religious items.",
  },
  {
    icon: Package,
    title: "No Inventory or Fulfillment Required",
    body: "We manage sourcing, logistics, and customer support.",
  },
];

const whyChooseItems = [
  {
    icon: TrendingUp,
    title: "Sustainable Mission Support",
    body: "Generate reliable, year-round revenue beyond traditional fundraising.",
  },
  {
    icon: Heart,
    title: "Purpose-Driven Engagement",
    body: "Provide parishioners and supporters with a meaningful way to support their mission through everyday commerce.",
  },
  {
    icon: ShieldCheck,
    title: "Structured & Transparent Model",
    body: "Clear, accountable systems designed specifically for Catholic communities and nonprofit organizations.",
  },
  {
    icon: Layers,
    title: "No Operational Complexity",
    body: "No inventory, fulfillment, or technical maintenance required — allowing you to focus on your mission.",
  },
];

interface Testimonial {
  id: string;
  initials: string;
  name: string;
  organization: string;
  shortQuote: string;
  fullQuote: string[];
  photos: string[];
}

const testimonials: Testimonial[] = [
  {
    id: "omar",
    initials: "OA",
    name: "Fr. Omar Ayubi",
    organization: "Saint Katharine Drexel – Weston, FL",
    shortQuote:
      "As ParishMart began to take shape, we launched a pilot online store for our parish. I saw how a simple, well-structured initiative aligned with the mission of the Church can evangelize through action — always in service of the pastoral mission.",
    fullQuote: [
      "From the very beginning, I had the opportunity to learn about and support the vision behind ParishMart. As this idea began to take shape, we started developing an online store for my parish, St. Katharine Drexel, featuring a broad catalog of religious items, as a pilot experience.",
      "This first step allowed me to see how a simple, well-structured initiative, aligned with the mission of the Church, can become a concrete way to evangelize through action, by offering practical support to my parish community.",
      "ParishMart opens the door to a solution that can help strengthen parish life, support the missions, ministries, and causes of my parish, and generate resources in an organized and transparent way, always in service of the pastoral mission.",
      "I invite my community and all my parishioners to join this initiative — supporting the parish and local small businesses and entrepreneurs — so that together we may continue building a living, compassionate, and community-centered Church.",
    ],
    photos: [
      "https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/Picture1.jpg",
      "https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/Picture2.jpg",
      "https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/Picture3.jpg",
      "https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/Picture4.jpg",
    ],
  },
  {
    id: "maria",
    initials: "MV",
    name: "María Angélica Valencia",
    organization: "Schoenstatt Apostolic Movement – Miami",
    shortQuote:
      "More than a platform, ParishMart became a providential tool for our mission — enabling fundraising, uniting missionaries across the country, and generating tangible support.",
    fullQuote: [
      "I am María Angélica Valencia, and together with my husband, Vicente Miralles, we are members of the Schoenstatt Apostolic Movement in Miami. In our journey of faith as lay missionaries, we strive to place our talents and resources at the service of the mission, wherever God and Our Blessed Mother lead us.",
      "During the Jubilee Year of the Pilgrim Mother Apostolate, under the theme \u201CMissionaries of Hope,\u201D ParishMart became a providential tool for our mission. Through its platform, we were able to facilitate the acquisition of promotional materials while simultaneously raising funds directly for the Pilgrim Mother Apostolate in Miami. The online store allowed missionaries from across the United States to participate in this special year, generating not only tangible financial support but also a profound sense of unity in the mission.",
      "At the same time, for Mary's Hope Network — an emerging initiative dedicated to bringing hope to children by reminding them that God loves them deeply — ParishMart has become a true ally. Through the platform, we have been able to channel donations to meet very specific needs, such as sending gifts and providing assistance, in a simple and effective way.",
      "Our experience with ParishMart has been deeply positive. More than just a platform, it has been a true support system that allows the mission to move forward. We sincerely believe in its potential to empower apostolic and charitable works seeking to evangelize and serve, facilitating fundraising in a way that is personal, creative, and impactful — reaching the hearts of people.",
    ],
    photos: [
      "https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/Picture5.jpg",
      "https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/Picture6.jpg",
      "https://parishmart-files-public.s3.us-east-2.amazonaws.com/media/Picture7.jpg",
    ],
  },
  {
    id: "soly",
    initials: "SR",
    name: "Soly Rodríguez",
    organization: "Schoenstatt Movement",
    shortQuote:
      "ParishMart has enabled us to manage multiple online stores for different apostolic initiatives in a simple and organized way — transforming community engagement into sustainable, tangible support.",
    fullQuote: [
      "ParishMart has enabled us to create and manage multiple online stores for different initiatives within the Schoenstatt Movement — including Missionaries of Milwaukee, CAM, FORTA, and FaCE — in a way that is simple, organized, and fully aligned with our apostolic mission.",
      "The platform allows us to centralize our efforts, engage our community, and transform that engagement into tangible and sustainable support for our causes. More than just a technological solution, ParishMart has become a strategic tool that strengthens our mission and helps us generate resources without losing focus on evangelization.",
      "It is a practical and effective way to turn community commitment into real impact.",
    ],
    photos: [],
  },
];

const builtForParishItems = [
  {
    title: "Ministry Sub-Stores",
    body: "Each parish can activate multiple ministries as individual storefronts.",
  },
  {
    title: "Diocese & Archdiocese-Level Scalability",
    body: "Deploy across multiple parishes under unified oversight.",
  },
  {
    title: "Transparent Revenue Sharing",
    body: "Access clear dashboards with detailed reporting on purchases, tithes, and donation-based products.",
  },
  {
    title: "Community-Driven Commerce",
    body: "Support vetted, values-aligned local businesses — safeguarding trust and mission integrity.",
  },
];

// ─── Testimonial Modal ────────────────────────────────────────────────────────

const TestimonialModal = ({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-8"
    onClick={onClose}
  >
    <div
      className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>

      <div className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#006699] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">{testimonial.initials}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
            <p className="text-sm text-gray-500 italic">{testimonial.organization}</p>
          </div>
        </div>

        {testimonial.fullQuote.map((para, i) => (
          <p key={i} className="text-gray-700 leading-relaxed mb-4 italic">
            {i === 0 && '"'}{para}{i === testimonial.fullQuote.length - 1 && '"'}
          </p>
        ))}

        {testimonial.photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-6">
            {testimonial.photos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${testimonial.name} ${i + 1}`}
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const StoreRegistration = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    const handleScroll = () => setShowAnnouncement(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedTestimonial ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedTestimonial]);

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Strip */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${showAnnouncement ? "translate-y-0" : "-translate-y-full"}`}
        style={{ willChange: "transform" }}
      >
        <AnnouncementStrip />
      </div>

      {/* Header */}
      <div
        className="sticky left-0 w-full z-40 bg-gray-50 transition-all duration-300 ease-in-out"
        style={{ top: showAnnouncement ? 40 : 0 }}
      >
        <Header />
      </div>

      {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
      <section className="relative w-full flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1207965/pexels-photo-1207965.jpeg"
            alt="Parish community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2341]/95 via-[#1a2341]/80 to-[#1a2341]/20" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — text */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Activate Sustainable Support for Your Mission
              </h1>
              <p className="text-lg text-white/85 mb-10">
                ParishMart helps Catholic parishes, dioceses, apostolic causes and non-profit
                organizations generate year-round revenue through mission-aligned commerce —
                without inventory or operational burden.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => (window.location.href = "/store-registration")}
                  className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-8 py-3 text-base h-auto"
                >
                  Launch your Store
                </Button>
                <Button
                  onClick={() => (window.location.href = "https://shop.parishmart.com/contact")}
                  variant="outline"
                  className="border-2 border-white text-white bg-[#006699] hover:bg-white/30 font-semibold px-8 py-3 text-base h-auto"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>

            {/* Right — video */}
            <div className="w-full">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/Gb81W2dnNFk"
                  title="Build Your Store — ParishMart"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE BAR ─────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-nowrap justify-center items-center overflow-x-auto">
          {valueBarItems.map((item, idx) => (
            <div key={item} className="flex items-center">
              <div className="flex items-center gap-1.5 text-gray-700 text-sm font-medium px-3 whitespace-nowrap">
                <Check className="w-4 h-4 text-[#006699] flex-shrink-0" />
                <span>{item}</span>
              </div>
              {idx < valueBarItems.length - 1 && (
                <div className="w-px h-5 bg-gray-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW PARISHMART WORKS ──────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-14">
            <p className="text-lg text-gray-500 mb-1">Getting Started</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How ParishMart Works
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
            {howItWorksSteps.map((step, idx) => (
              <div key={step.number} className="flex flex-1 items-stretch">
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-full bg-[#006699] flex items-center justify-center mb-5">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                  {step.cta ? (
                    <a
                      href={step.cta.href}
                      className="text-lg font-semibold text-black hover:text-[#006699] mb-3 cursor-pointer"
                    >
                      {step.title}
                    </a>
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  )}
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">{step.body}</p>
                </div>
                {idx < howItWorksSteps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center px-1 self-center">
                    <ChevronRight className="w-5 h-5 text-[#006699]/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button
              onClick={() => (window.location.href = "/store-registration")}
              className="bg-[#006699] hover:bg-[#005588] text-white font-semibold px-10 py-3 text-base h-auto"
            >
              Register Today!
            </Button>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU RECEIVE ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-14">
            <p className="text-lg text-gray-500 mb-1">Included in Every Store</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What You Receive</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatYouReceiveItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 flex gap-4 items-start shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-[#006699]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#006699]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY PARISHES CHOOSE PARISHMART ────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-14">
            <p className="text-lg text-gray-500 mb-1">Our Commitment</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Parishes &amp; Causes Choose ParishMart
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyChooseItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-4 items-start p-6 rounded-xl border-2 border-gray-200 shadow-sm bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-full bg-[#006699] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-14">
            <p className="text-lg text-gray-500 mb-1">Real Stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trusted by Parishes and Apostolic Movements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#006699] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{t.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500 italic">{t.organization}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic text-sm leading-relaxed flex-grow line-clamp-5">
                  "{t.shortQuote}"
                </p>
                <button
                  onClick={() => setSelectedTestimonial(t)}
                  className="mt-4 text-[#006699] text-sm font-medium hover:underline text-left self-start"
                >
                  Learn more →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILT WITH PARISHES IN MIND ───────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built with Parishes in Mind
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mb-12">
            ParishMart is a purpose-driven ecosystem thoughtfully designed around parish life,
            ministries, and diocesan structures — supporting sustainable growth while preserving
            pastoral focus.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {builtForParishItems.map((item) => (
              <div key={item.title} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-[#006699]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-sm bg-[#006699] rotate-45" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#006699]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Launch Your Store?
          </h2>
          <p className="text-white/85 text-lg mb-10">
            Join ParishMart today and receive sustainable support through purpose-driven commerce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/store-registration")}
              className="bg-white text-[#006699] hover:bg-gray-100 font-semibold px-8 py-3 text-base h-auto"
            >
              Launch your Store
            </Button>
           
          </div>
        </div>
      </section>

      <Footer />

      {/* ── TESTIMONIAL MODAL ─────────────────────────────────────────────── */}
      {selectedTestimonial && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      )}
    </div>
  );
};

export default StoreRegistration;
