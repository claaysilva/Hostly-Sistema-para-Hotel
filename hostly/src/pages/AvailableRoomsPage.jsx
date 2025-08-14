// Página de listagem e reserva de quartos disponíveis
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./AvailableRoomsPage.css"; // Usando o novo CSS

const AvailableRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [customerId, setCustomerId] = useState(null);

  /**
   * Busca quartos disponíveis e cliente vinculado ao usuário logado
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const roomsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rooms?available=true`
        );
        setRooms(roomsRes.data);
        if (user && user.id) {
          const customersRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/customers`
          );
          const customer = customersRes.data.find((c) => c.user_id === user.id);
          if (customer) setCustomerId(customer.id);
        }
      } catch (err) {
        setError(
          "Não foi possível carregar os quartos disponíveis ou cliente."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  /**
   * Realiza reserva do quarto para o cliente logado
   */
  const handleReserve = async (roomId) => {
    setError("");
    if (!user || !user.id || !customerId) {
      setSuccessMessage(
        "Você precisa estar logado e ser um cliente válido para reservar. Por favor, faça o login novamente."
      );
      setShowSuccess(true);
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings/check-in`,
        {
          room_id: roomId,
          customer_id: customerId,
        }
      );
      setRooms((currentRooms) => currentRooms.filter((r) => r.id !== roomId));
      setSuccessMessage("Reserva realizada com sucesso!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      console.error("Erro na reserva:", err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
          "Falha ao reservar o quarto. Tente novamente."
      );
    }
  };

  if (loading) return <p className="loading-message">Carregando quartos...</p>;

  return (
    <div className="container">
      <div className="available-rooms-container">
        <h1>Quartos Disponíveis para Reserva</h1>
        {error && <p className="error-message">{error}</p>}
        {showSuccess && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2 style={{ color: "var(--cor-sucesso)" }}>{successMessage}</h2>
              <button className="close" onClick={() => setShowSuccess(false)}>
                Fechar
              </button>
            </div>
          </div>
        )}
        <div className="rooms-grid">
          {!loading && rooms.length === 0 && (
            <p className="info-message">Nenhum quarto disponível no momento.</p>
          )}
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <img
                src={room.image_url || "/images/default.png"}
                alt={room.name}
                className="room-image"
              />
              <div className="room-card-content">
                <h2>{room.name}</h2>
                <p>{room.description}</p>
                <p>Capacidade: {room.capacity}</p>
                <p className="price">
                  R$ {parseFloat(room.price_per_night).toFixed(2)}{" "}
                  <span>/ noite</span>
                </p>
                <button
                  className="action-button reserve"
                  onClick={() => handleReserve(room.id)}
                >
                  Reservar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableRoomsPage;
