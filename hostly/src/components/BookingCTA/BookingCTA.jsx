// src/components/BookingCTA/BookingCTA.jsx
/**
 * BookingCTA.jsx
 * Componente de chamada para ação de reserva no sistema Hostly.
 *
 * Exibe botão para consulta de quartos e direciona para página de reservas.
 *
 * Manutenção: Atualize textos e links conforme campanhas.
 * Última revisão: 18/08/2025
 * Autor: Equipe de Engenharia Hostly
 */
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
