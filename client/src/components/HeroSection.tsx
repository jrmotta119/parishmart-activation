import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  logo?: string;
  tagline?: string;
  ctaText?: string;
  backgroundImage?: string;
  onCtaClick?: () => void;
}

const slides = [
  {
    key: "join",
    backgroundImage: "https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg", // Example image, replace as needed
    content: (
      <div className="flex flex-col justify-center h-full pl-10">
        <p className="text-white text-lg md:text-xl mb-2">Become a part of ParishMart</p>
        <h2 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: '#006699' }}>JOIN OUR COMMUNITY</h2>
        <p className="text-white text-xl md:text-3xl font-medium">Sell with us or support a cause. Make a difference today!</p>
      </div>
    ),
    // image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Example icon, optional
    // imageAlt: "Join Community Icon",
    // imageRight: true,
  },
  {
    key: "main",
    backgroundImage: "https://s3-us-west-2.amazonaws.com/tota-images/1280px-sainte-ch-f916f606d44074ce.jpg",
    content: (
      <div className="flex flex-col justify-center h-full pl-10">
        <p className="text-white text-lg md:text-xl mb-2">Discover products that make a difference</p>
        <h2 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: '#006699' }}>SHOP WITH PURPOSE.</h2>
        <p className="text-white text-xl md:text-3xl font-medium">Every purchase supports community initiatives and charitable causes.</p>
      </div>
    ),
    imageRight: true,
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const [direction, setDirection] = useState(0); // for animation

  const goTo = (idx: number, dir = 0) => {
    setDirection(dir);
    setCurrent((idx + total) % total);
  };
  const next = () => goTo(current + 1, 1);
  const prev = () => goTo(current - 1, -1);

  const slide = slides[current];

  // Handler for slide click
  const handleSlideClick = () => {
    if (current === 0) {
      const el = document.getElementById('grow-with-us');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (current === 1) {
      window.location.href = 'https://parishmart.com';
    }
  };

  // Animation variants for swipe
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute' as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative' as const,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      position: 'absolute' as const,
    }),
  };

  // Swipe detection threshold
  const swipeConfidenceThreshold = 100;
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -swipeConfidenceThreshold) {
      next();
    } else if (info.offset.x > swipeConfidenceThreshold) {
      prev();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <section className="relative w-full mt-8 rounded-2xl overflow-hidden bg-white shadow-lg flex items-center min-h-[320px] md:min-h-[400px] lg:min-h-[480px] px-4 md:px-8 lg:px-16">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.backgroundImage}
            alt="Slide background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1a2341]/90" />
        </div>
        {/* Left Arrow - now inside the card */}
        <button
          aria-label="Previous slide"
          onClick={prev}
          className="absolute z-20 text-white/80 hover:text-white hover:bg-white/20 bg-black/20 backdrop-blur-sm transition-all duration-200 rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/30 left-4 top-1/2 -translate-y-1/2"
        >
          <span className="text-2xl font-normal">‹</span>
        </button>
        {/* Slide Content - swipeable and clickable */}
        <motion.div
          key={current}
          className="relative z-10 flex flex-1 flex-row items-center justify-between px-12 py-12 cursor-pointer"
          onClick={handleSlideClick}
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleSlideClick(); }}
          style={{ outline: 'none' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Text */}
          <div className="flex-1 min-w-0">
            {current === 0 ? (
              <div className="flex flex-col justify-center h-full pl-10">
                <p className="text-white text-lg md:text-xl mb-2">Become a part of ParishMart</p>
                <h2 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: '#006699' }}>JOIN OUR COMMUNITY</h2>
                <p className="text-white text-xl md:text-3xl font-medium">Sell with us or support a cause. Make a difference today!</p>
              </div>
            ) : (
              <div className="flex flex-col justify-center h-full pl-10">
                <p className="text-white text-lg md:text-xl mb-2">Discover products that make a difference</p>
                <h2 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: '#006699' }}>SHOP WITH PURPOSE.</h2>
                <p className="text-white text-xl md:text-3xl font-medium">Empower parishes, causes & local entrepreneurs. Make a difference today!</p>
              </div>
            )}
          </div>
          {/* No image rendering here */}
        </motion.div>
        {/* Right Arrow - now inside the card */}
        <button
          aria-label="Next slide"
          onClick={next}
          className="absolute z-20 text-white/80 hover:text-white hover:bg-white/20 bg-black/20 backdrop-blur-sm transition-all duration-200 rounded-full w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/30 right-4 top-1/2 -translate-y-1/2"
        >
          <span className="text-2xl font-normal">›</span>
        </button>
        {/* Dots */}
        <div className="absolute left-0 right-0 bottom-6 flex justify-center z-30">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block mx-1 w-4 h-2 rounded-full transition-all duration-300 ${idx === current ? 'bg-white' : 'bg-white/40'}`}
              style={{ minWidth: '22px' }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
