// src/pages/LoginPage.jsx (Agora serve para todos)
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"; // Adicionado para o link de cadastro
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
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
        </form>
        <div className="auth-switch-link">
          <span>Não tem uma conta de cliente? </span>
          <Link to="/cadastro">Cadastre-se aqui</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
