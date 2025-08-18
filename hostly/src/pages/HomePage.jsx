/**
 * HomePage.jsx
 * Página inicial do sistema Hostly.
 *
 * Exibe seções de destaque, informações institucionais e chamada para reserva.
 *
 * Manutenção: Adicione ou remova seções conforme evolução do produto.
 * Última revisão: 18/08/2025
 * Autor: Equipe de Engenharia Hostly
 */
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
