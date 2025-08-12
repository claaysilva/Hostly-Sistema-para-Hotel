// src/pages/CustomerFormPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomerFormPage.css";

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetStatus, setResetStatus] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    if (isEditing) {
      axios
        .get(`http://localhost:3001/api/customers/${id}`)
        .then((response) => {
          setCustomer(response.data);
          setOriginalEmail(response.data.email);
        })
        .catch((err) => {
          console.error("Não foi possível carregar os dados do cliente:", err);
          setError("Falha ao carregar os dados.");
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetLogic = async () => {
    setResetStatus("aguardando");
    try {
      // Chama a rota dedicada no backend, muito mais rápido e seguro
      await axios.put(
        "http://localhost:3001/api/users/reset-password-by-email",
        {
          email: customer.email,
        }
      );
      setResetStatus("success");
    } catch {
      setResetStatus("fail");
    }
  };

  const closeAndResetPopup = () => {
    setShowResetPopup(false);
    setResetStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEditing) {
        await axios.put(`http://localhost:3001/api/customers/${id}`, customer);
        if (originalEmail && originalEmail !== customer.email) {
          const res = await axios.get("http://localhost:3001/api/users");
          const user = res.data.find(
            (u) => u.email === originalEmail && u.role === "user"
          );
          if (user) {
            await axios.put(`http://localhost:3001/api/users/${user.id}`, {
              name: customer.name.toUpperCase(),
              email: customer.email.toLowerCase(),
              role: "user",
            });
          }
        }
      } else {
        await axios.post(
          "http://localhost:3001/api/customers/with-user",
          customer
        );
      }
      window.location.href = "/customers"; // Força o recarregamento
    } catch (err) {
      setError(err.response?.data?.error || "Falha ao salvar o cliente.");
    }
  };

  return (
    <div className="container">
      <div className="customer-form-container">
        <h1>{isEditing ? "Editar Cliente" : "Cadastrar Novo Cliente"}</h1>
        {showResetPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              {!resetStatus ? (
                <>
                  <h2>⚠️ Tem certeza?</h2>
                  <p>
                    A senha será alterada para <b>1234</b>.<br />
                    Esta ação não pode ser desfeita!
                  </p>
                  <div className="popup-actions">
                    <button className="confirm" onClick={handleResetLogic}>
                      Sim
                    </button>
                    <button className="cancel" onClick={closeAndResetPopup}>
                      Não
                    </button>
                  </div>
                </>
              ) : resetStatus === "success" ? (
                <>
                  <h2 style={{ color: "var(--cor-sucesso)" }}>
                    ✅ Senha resetada!
                  </h2>
                  <p>
                    Nova senha: <b>1234</b>
                  </p>
                  <button className="close" onClick={closeAndResetPopup}>
                    Fechar
                  </button>
                </>
              ) : (
                <>
                  <h2 style={{ color: "var(--cor-perigo)" }}>
                    ❌ Falha ao resetar
                  </h2>
                  <p>Tente novamente ou verifique a conexão.</p>
                  <button className="close" onClick={closeAndResetPopup}>
                    Fechar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="customer-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={customer.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customer.phone || ""}
              onChange={handleChange}
              placeholder="(XX) XXXXX-XXXX"
            />
          </div>
          {!isEditing && (
            <div className="form-group">
              <label htmlFor="password">Senha para acesso do cliente</label>
              <input
                type="password"
                id="password"
                name="password"
                value={customer.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {isEditing && (
            <button
              type="button"
              className="reset-button"
              onClick={() => setShowResetPopup(true)}
            >
              Resetar Senha
            </button>
          )}
          <button type="submit" className="submit-button">
            {isEditing ? "Salvar Alterações" : "Cadastrar Cliente"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormPage;
