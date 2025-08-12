import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckInPage.css";

const CheckInPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Busca a lista de todos os clientes
    axios
      .get("http://localhost:3001/api/customers")
      .then((response) => setCustomers(response.data))
      .catch((err) => setError("Falha ao carregar clientes."));

    // Busca os dados do quarto específico
    axios
      .get(`http://localhost:3001/api/rooms/${roomId}`)
      .then((response) => setRoom(response.data))
      .catch((err) => setError("Falha ao carregar dados do quarto."));
  }, [roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setError("Por favor, selecione um cliente.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/bookings/check-in", {
        room_id: roomId,
        customer_id: selectedCustomer,
      });
      navigate("/rooms");
    } catch (err) {
      setError(
        err.response?.data?.error || "Ocorreu um erro ao realizar o check-in."
      );
    }
  };

  if (!room) return <p>Carregando...</p>;

  return (
    <div className="check-in-container">
      <h1>Fazer Check-in no Quarto: {room.name}</h1>
      <form onSubmit={handleSubmit} className="check-in-form">
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="customer">Selecione o Cliente</label>
          <select
            id="customer"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Escolha um cliente --
            </option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Confirmar Check-in
        </button>
      </form>
    </div>
  );
};

export default CheckInPage;
