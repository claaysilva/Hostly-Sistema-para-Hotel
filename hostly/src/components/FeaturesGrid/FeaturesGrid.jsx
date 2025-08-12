// src/components/FeaturesGrid/FeaturesGrid.jsx
import React from "react";
import "./FeaturesGrid.css";

// Dados para os nossos cartões de destaque.
// No futuro, isso poderia vir de uma API.
const featuresData = [
  {
    title: "Gastronomia Exclusiva",
    description:
      "Sabores que encantam em um ambiente sofisticado, onde cada prato é uma obra de arte.",
    imageUrl:
      "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg", // Imagem genérica de restaurante
    alt: "Prato gourmet em um restaurante elegante",
  },
  {
    title: "Piscina & Lazer",
    description:
      "Um oásis de tranquilidade para você relaxar, com serviço impecável à beira da piscina.",
    imageUrl:
      "https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg", // Imagem genérica de piscina de hotel
    alt: "Piscina de luxo com cadeiras de sol",
  },
  {
    title: "Eventos Memoráveis",
    description:
      "Espaços versáteis e elegantes para eventos sociais ou corporativos, com uma equipe dedicada.",
    imageUrl:
      "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg", // Imagem genérica de evento/casamento
    alt: "Salão de eventos decorado para uma festa",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="features-section">
      <h2 className="section-title">Uma Experiência Completa</h2>
      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div className="feature-card" key={index}>
            <img
              src={feature.imageUrl}
              alt={feature.alt}
              className="feature-image"
            />
            <div className="feature-content">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
