// src/pages/RoomDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./RoomDetailPage.css";

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3001/api/rooms/${id}`);
        setRoom(res.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do quarto:", err); // Adicione esta linha
        setError("Quarto não encontrado!");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading)
    return <p className="loading-message">Carregando detalhes do quarto...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!room) return <p className="info-message">Quarto não encontrado!</p>;

  return (
    <div className="container">
      <div className="detail-container">
        <Link to="/rooms" className="back-link">
          ← Voltar para a lista
        </Link>
        <h1>{room.name}</h1>
        {room.image_url && (
          <img src={room.image_url} alt={room.name} className="detail-image" />
        )}
        <p className="description">{room.description}</p>
        <p>
          <strong>Capacidade:</strong> {room.capacity} pessoas
        </p>
        <p>
          <strong>Preço:</strong> R${" "}
          {parseFloat(room.price_per_night).toFixed(2)} por noite
        </p>
        <div className="booking-section">
          <span
            className={
              room.is_available ? "status-available" : "status-unavailable"
            }
          >
            {room.is_available
              ? "Disponível para reserva"
              : "Atualmente indisponível"}
          </span>
          {room.is_available && (
            <Link to="/quartos-disponiveis" className="book-button">
              Reservar Agora
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
