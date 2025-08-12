// src/pages/RoomListPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./RoomListPage.css";

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ type: null, room: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const user = JSON.parse(localStorage.getItem("hostly-user"));

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, customersRes] = await Promise.all([
        axios.get("http://localhost:3001/api/rooms"),
        axios.get("http://localhost:3001/api/customers"),
      ]);
      setRooms(roomsRes.data);
      setCustomers(customersRes.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseModal = () => {
    setModal({ type: null, room: null });
    setSelectedCustomer("");
  };

  const handleConfirmCheckin = async () => {
    if (!selectedCustomer) return;
    try {
      await axios.post("http://localhost:3001/api/bookings/check-in", {
        room_id: modal.room.id,
        customer_id: selectedCustomer,
      });
      fetchData();
      handleCloseModal();
    } catch {
      alert("Falha ao fazer check-in.");
    }
  };

  const handleConfirmCheckout = async () => {
    try {
      await axios.post("http://localhost:3001/api/bookings/check-out", {
        room_id: modal.room.id,
      });
      fetchData();
      handleCloseModal();
    } catch {
      alert("Falha ao fazer o check-out.");
    }
  };

  const handleDelete = async (roomToDelete) => {
    setDeleteTarget(roomToDelete);
  };

  if (loading) return <p className="loading-message">Carregando quartos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="container">
      <div className="room-list-container">
        <div className="room-list-header">
          <h1>Nossos Quartos</h1>
          <Link to="/rooms/new" className="add-new-button">
            Novo Quarto
          </Link>
        </div>
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <img
                src={room.image_url || "/images/default.png"}
                alt={room.name}
                className="room-image"
              />
              <div className="room-card-content">
                <h2>{room.name}</h2>
                <p>Capacidade: {room.capacity} pessoas</p>
                <p className="price">
                  R$ {parseFloat(room.price_per_night).toFixed(2)}{" "}
                  <span>/ noite</span>
                </p>
                <div className="occupancy-status">
                  <span
                    className={
                      room.is_available
                        ? "status-available"
                        : "status-unavailable"
                    }
                  >
                    {room.is_available ? "Disponível" : "Ocupado"}
                  </span>
                  {!room.is_available && room.customer_name && (
                    <p className="guest-info">
                      Hóspede: <strong>{room.customer_name}</strong>
                    </p>
                  )}
                </div>
                <div className="room-card-actions">
                  {room.is_available ? (
                    <button
                      className="action-button check-in"
                      onClick={() => setModal({ type: "check-in", room })}
                    >
                      Check-in
                    </button>
                  ) : (
                    <button
                      className="action-button check-out"
                      onClick={() => setModal({ type: "check-out", room })}
                    >
                      Check-out
                    </button>
                  )}
                  <Link
                    to={`/rooms/edit/${room.id}`}
                    className="action-button edit"
                    title="Editar"
                  >
                    <FiEdit size={18} />
                  </Link>
                  {user?.role === "admin" && (
                    <button
                      className="action-button delete"
                      title="Apagar"
                      onClick={() => handleDelete(room)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Modal de confirmação de exclusão (fora do grid) */}
          {deleteTarget && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Confirmar exclusão</h2>
                <p>Deseja realmente apagar o quarto "{deleteTarget.name}"?</p>
                <div className="modal-actions">
                  <button
                    className="action-button cancel"
                    onClick={() => setDeleteTarget(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="action-button delete"
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `http://localhost:3001/api/rooms/${deleteTarget.id}`,
                          {
                            headers: { "x-user-role": user.role },
                          }
                        );
                        setRooms((currentRooms) =>
                          currentRooms.filter((r) => r.id !== deleteTarget.id)
                        );
                        setDeleteTarget(null);
                      } catch {
                        setError("Falha ao apagar o quarto.");
                        setDeleteTarget(null);
                      }
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Check-in */}
        {modal.type === "check-in" && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Fazer Check-in no Quarto "{modal.room?.name}"</h2>
              <p>Selecione o cliente que está entrando no quarto.</p>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="modal-select"
              >
                <option value="">Selecione um cliente...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button
                  className="action-button cancel"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  className="action-button check-in"
                  disabled={!selectedCustomer}
                  onClick={handleConfirmCheckin}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Check-out */}
        {modal.type === "check-out" && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirmar Check-out</h2>
              <p>
                Deseja realmente fazer o check-out do quarto "{modal.room?.name}
                "?
              </p>
              <div className="modal-actions">
                <button
                  className="action-button cancel"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  className="action-button check-out"
                  onClick={handleConfirmCheckout}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomListPage;
