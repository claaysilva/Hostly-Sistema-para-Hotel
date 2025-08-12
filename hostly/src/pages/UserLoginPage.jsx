// src/pages/UserLoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./UserLoginPage.css";

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/users/login", {
        email,
        password,
      });
      // Salva o usuário do cliente em uma chave diferente do admin
      localStorage.setItem("hostly-client-user", JSON.stringify(res.data));
      navigate("/quartos-disponiveis");
    } catch {
      setError("E-mail ou senha inválidos.");
    }
  };

  return (
    <div className="container">
      <div className="user-auth-container">
        <h1>Login do Cliente</h1>
        <form onSubmit={handleSubmit} className="user-auth-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Entrar
          </button>
          <div className="auth-switch-link">
            <span>Não tem cadastro? </span>
            <Link to="/cadastro">Cadastre-se aqui</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLoginPage;
