// src/pages/HomePage.jsx
import React from "react";
import HeroSection from "../components/HeroSection/HeroSection";
import AboutSection from "../components/AboutSection/AboutSection";
import FeaturesGrid from "../components/FeaturesGrid/FeaturesGrid";
import BookingCTA from "../components/BookingCTA/BookingCTA";

const HomePage = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <AboutSection />
      <FeaturesGrid />
      <BookingCTA />
    </div>
  );
};

export default HomePage;
