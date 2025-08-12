// src/pages/AdminReservationsPage.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import AdminReservationsFilters from "./AdminReservationsFilters";
import "./UserDashboardPage.css";

const statusTranslations = {
  active: "Reservado",
  completed: "Finalizado",
  cancelled: "Cancelado",
};

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    customer: "",
    room: "",
    status: "",
    date: "",
  });
  const [rooms, setRooms] = useState([]);

  // Monta query string dos filtros
  const buildQuery = () => {
    const params = [];
    params.push("all=true");
    if (filters.customer)
      params.push(`customer_name=${encodeURIComponent(filters.customer)}`);
    if (filters.room)
      params.push(`room_name=${encodeURIComponent(filters.room)}`);
    if (filters.status)
      params.push(`status=${encodeURIComponent(filters.status)}`);
    if (filters.date)
      params.push(`check_in_date=${encodeURIComponent(filters.date)}`);
    return params.length ? `?${params.join("&")}` : "";
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const query = buildQuery();
        const res = await axios.get(
          `http://localhost:3001/api/bookings${query}`
        );
        setReservations(res.data);
      } catch {
        setError("Não foi possível carregar as reservas.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
    // O React sugere adicionar buildQuery como dependência, mas como ela é estável, podemos ignorar ou suprimir o aviso:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/customers");
        setCustomers(response.data);
      } catch {
        setCustomers([]);
      }
    };
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/rooms");
        setRooms(response.data);
      } catch {
        setRooms([]);
      }
    };
    fetchCustomers();
    fetchRooms();
  }, []);

  if (loading) return <p className="loading-message">Carregando reservas...</p>;
  if (error) return <p className="error-message">{error}</p>;

  // Filtragem local
  const filteredReservations = reservations.filter((r) => {
    const matchCustomer =
      !filters.customer || r.customer_name === filters.customer;
    const matchRoom = !filters.room || r.room_name === filters.room;
    const matchStatus = !filters.status || r.status === filters.status;
    const matchDate =
      !filters.date ||
      (r.check_in_date && r.check_in_date.startsWith(filters.date));
    return matchCustomer && matchRoom && matchStatus && matchDate;
  });

  const activeReservations = filteredReservations.filter(
    (r) => r.status === "active"
  );
  const historyReservations = filteredReservations.filter(
    (r) => r.status !== "active"
  );

  return (
    <div className="container">
      <div className="user-dashboard-container">
        <h1>Reservas do Sistema</h1>
        <AdminReservationsFilters
          filters={filters}
          setFilters={setFilters}
          customers={customers}
          rooms={rooms}
        />
        <h2 style={{ marginTop: "2rem" }}>Reservados</h2>
        {activeReservations.length === 0 ? (
          <p className="info-message">Nenhuma reserva ativa.</p>
        ) : (
          <div className="reservations-list">
            {activeReservations.map((r) => (
              <div key={r.id} className="reservation-card">
                <h2>{r.room_name}</h2>
                <p>
                  <strong>Cliente:</strong> {r.customer_name}
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {r.check_in_date
                    ? format(new Date(r.check_in_date), "dd/MM/yyyy")
                    : "Data inválida"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-${r.status}`}>
                    {statusTranslations[r.status] || r.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
        <h2 style={{ marginTop: "2rem" }}>Histórico de Reservas</h2>
        {historyReservations.length === 0 ? (
          <p className="info-message">Nenhum histórico de reserva.</p>
        ) : (
          <div className="reservations-list">
            {historyReservations.map((r) => (
              <div key={r.id} className="reservation-card">
                <h2>{r.room_name}</h2>
                <p>
                  <strong>Cliente:</strong> {r.customer_name}
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {r.check_in_date
                    ? format(new Date(r.check_in_date), "dd/MM/yyyy")
                    : "Data inválida"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-${r.status}`}>
                    {statusTranslations[r.status] || r.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservationsPage;
