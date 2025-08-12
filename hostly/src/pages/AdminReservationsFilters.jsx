// src/pages/AdminReservationsFilters.jsx
import React from "react";
import "./AdminReservationsFilters.css";

const AdminReservationsFilters = ({
  filters,
  setFilters,
  customers,
  rooms,
}) => {
  return (
    <div
      className="filters-container"
      style={{
        marginBottom: "2rem",
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <label>Cliente:</label>
        <select
          value={filters.customer}
          onChange={(e) =>
            setFilters((f) => ({ ...f, customer: e.target.value }))
          }
        >
          <option value="">Todos</option>
          {customers.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Quarto:</label>
        <select
          value={filters.room}
          onChange={(e) => setFilters((f) => ({ ...f, room: e.target.value }))}
        >
          <option value="">Todos</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Status:</label>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
        >
          <option value="">Todos</option>
          <option value="active">Reservado</option>
          <option value="completed">Finalizado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>
      <div>
        <label>Data (Check-in):</label>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
        />
      </div>
    </div>
  );
};

export default AdminReservationsFilters;
