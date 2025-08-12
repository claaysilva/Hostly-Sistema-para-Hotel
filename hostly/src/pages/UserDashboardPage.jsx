// src/pages/UserDashboardPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import "./UserDashboardPage.css";

// Objeto para traduzir os status
const statusTranslations = {
  active: "Reservado",
  completed: "Finalizado",
  cancelled: "Cancelado",
};

const UserDashboardPage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const handleDelete = (bookingId) => {
    setDeleteId(bookingId);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    setDeleteError("");
    try {
      await axios.delete(`http://localhost:3001/api/bookings/${deleteId}`);
      setReservations((currentReservations) =>
        currentReservations.filter((r) => r.id !== deleteId)
      );
      setShowDeleteModal(false);
    } catch {
      setDeleteError("Falha ao excluir reserva.");
    }
  };
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      if (user && user.id) {
        try {
          setLoading(true);
          const res = await axios.get(
            `http://localhost:3001/api/bookings?user_id=${user.id}`
          );
          setReservations(res.data);
        } catch (err) {
          console.error("Erro ao carregar reservas:", err);
          setError("Não foi possível carregar suas reservas.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("Usuário não encontrado. Por favor, faça o login novamente.");
      }
    };
    fetchReservations();
  }, [user]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelError, setCancelError] = useState("");
  const handleCancel = async (bookingId) => {
    setCancelId(bookingId);
    setShowCancelModal(true);
  };
  const confirmCancel = async () => {
    setCancelError("");
    try {
      await axios.post(`http://localhost:3001/api/bookings/cancel`, {
        booking_id: cancelId,
      });
      setReservations((currentReservations) =>
        currentReservations.map((r) =>
          r.id === cancelId ? { ...r, status: "cancelled" } : r
        )
      );
      setShowCancelModal(false);
    } catch {
      setCancelError("Falha ao cancelar reserva.");
    }
  };

  if (loading)
    return <p className="loading-message">Carregando suas reservas...</p>;

  // Separar reservas
  const activeReservations = reservations.filter((r) => r.status === "active");
  const historyReservations = reservations.filter((r) => r.status !== "active");

  return (
    <div className="container">
      <div className="user-dashboard-container">
        <h1>Minhas Reservas</h1>
        {error && <p className="error-message">{error}</p>}
        {showCancelModal && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Tem certeza que deseja cancelar esta reserva?</h2>
              <p>Esta ação não pode ser desfeita.</p>
              {cancelError && <p className="error-message">{cancelError}</p>}
              <div className="popup-actions">
                <button className="confirm" onClick={confirmCancel}>
                  Sim, cancelar
                </button>
                <button
                  className="cancel"
                  onClick={() => setShowCancelModal(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Reservas Ativas */}
        <h2 style={{ marginTop: "2rem" }}>Reservados</h2>
        {activeReservations.length === 0 ? (
          <p className="info-message">Nenhuma reserva ativa.</p>
        ) : (
          <div className="reservations-list">
            {activeReservations.map((r) => {
              const translatedStatus = statusTranslations[r.status] || r.status;
              return (
                <div key={r.id} className="reservation-card">
                  <h2>{r.room_name}</h2>
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {r.check_in_date
                      ? format(new Date(r.check_in_date), "dd/MM/yyyy")
                      : "Data inválida"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status-${r.status}`}>
                      {translatedStatus}
                    </span>
                  </p>
                  <button
                    className="action-button delete"
                    onClick={() => handleCancel(r.id)}
                  >
                    Cancelar Reserva
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {/* Histórico de Reservas */}
        <h2 style={{ marginTop: "2rem" }}>Histórico de Reservas</h2>
        {showDeleteModal && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Deseja excluir esta reserva do histórico?</h2>
              <p>Esta ação não pode ser desfeita.</p>
              {deleteError && <p className="error-message">{deleteError}</p>}
              <div className="popup-actions">
                <button className="confirm" onClick={confirmDelete}>
                  Sim, excluir
                </button>
                <button
                  className="cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        )}
        {historyReservations.length === 0 ? (
          <p className="info-message">Nenhum histórico de reserva.</p>
        ) : (
          <div className="reservations-list">
            {historyReservations.map((r) => {
              const translatedStatus = statusTranslations[r.status] || r.status;
              return (
                <div
                  key={r.id}
                  className="reservation-card"
                  style={{ position: "relative" }}
                >
                  <button
                    className="icon-trash"
                    title="Excluir do Histórico"
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    onClick={() => handleDelete(r.id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#d32f2f"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zm3.46-8.12a1 1 0 0 1 1.41 0l.59.59.59-.59a1 1 0 0 1 1.41 1.41l-.59.59.59.59a1 1 0 0 1-1.41 1.41l-.59-.59-.59.59a1 1 0 0 1-1.41-1.41l.59-.59-.59-.59a1 1 0 0 1 0-1.41zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                  <h2>{r.room_name}</h2>
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {r.check_in_date
                      ? format(new Date(r.check_in_date), "dd/MM/yyyy")
                      : "Data inválida"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status-${r.status}`}>
                      {translatedStatus}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
