// Página de cadastro/edição de funcionário (admin/operator)
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CustomerFormPage.css"; // Usaremos um CSS dedicado

const UserFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator",
  });
  const [error, setError] = useState("");
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetStatus, setResetStatus] = useState("");

  /**
   * Busca dados do usuário para edição
   */
  useEffect(() => {
    const fetchUser = async () => {
      if (isEditing) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/${id}`
          );
          setUser({ ...response.data, password: "" });
        } catch (err) {
          console.error("Falha ao carregar dados do usuário:", err);
          setError("Falha ao carregar dados do usuário.");
        }
      }
    };
    fetchUser();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Lógica para resetar senha do usuário
   */
  const handleResetLogic = async () => {
    setResetStatus("aguardando");
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        name: user.name.toUpperCase(),
        email: user.email.toLowerCase(),
        role: user.role,
        password: "1234",
      });
      setResetStatus("success");
    } catch {
      setResetStatus("fail");
    }
  };

  const closeAndResetPopup = () => {
    setShowResetPopup(false);
    setResetStatus("");
  };

  /**
   * Envia dados do formulário para cadastrar ou editar usuário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userData = {
      name: user.name.toUpperCase(),
      email: user.email.toLowerCase(),
      role: user.role,
      password: user.password,
    };

    if (!isEditing && !userData.password) {
      setError("A senha é obrigatória para cadastrar um novo usuário.");
      return;
    }
    if (isEditing && !userData.password) {
      delete userData.password;
    }

    try {
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/${id}`,
          userData
        );
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, userData);
      }
      window.location.href = "/users";
    } catch (err) {
      setError(err.response?.data?.error || "Falha ao salvar o usuário.");
    }
  };

  return (
    <div className="container">
      <div className="user-form-container">
        <h1>
          {isEditing ? "Editar Funcionário" : "Cadastrar Novo Funcionário"}
        </h1>
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
                  <h2 className="popup-title success">✅ Senha resetada!</h2>
                  <p>
                    Nova senha: <b>1234</b>
                  </p>
                  <button className="close" onClick={closeAndResetPopup}>
                    Fechar
                  </button>
                </>
              ) : (
                <>
                  <h2 className="popup-title fail">❌ Falha ao resetar</h2>
                  <p>Tente novamente ou verifique a conexão.</p>
                  <button className="close" onClick={closeAndResetPopup}>
                    Fechar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="user-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder={isEditing ? "Deixe em branco para não alterar" : ""}
              required={!isEditing}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Função (Role)</label>
            <select
              id="role"
              name="role"
              value={user.role}
              onChange={handleChange}
            >
              <option value="operator">Operador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
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
            {isEditing ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserFormPage;
