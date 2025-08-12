// src/components/BookingCTA/BookingCTA.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./BookingCTA.css";

const BookingCTA = () => {
  return (
    <section className="cta-booking-section">
      <div className="cta-content">
        <h2>Prepare-se para uma experiência inesquecível</h2>
        <p>
          Consulte nossas acomodações e encontre o quarto perfeito para a sua
          estadia.
        </p>
        <Link to="/quartos-disponiveis" className="cta-booking-button">
          Ver Quartos e Disponibilidade
        </Link>
      </div>
    </section>
  );
};

export default BookingCTA;
