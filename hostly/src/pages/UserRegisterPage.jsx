// src/pages/UserRegisterPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./UserRegisterPage.css";

const UserRegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/users/register", {
        name,
        email,
        password,
      });
      alert(
        "Cadastro realizado com sucesso! Você será redirecionado para o login."
      );
      navigate("/area-cliente"); // Redireciona para o login do cliente
    } catch (err) {
      setError(
        err.response?.data?.error || "Falha ao cadastrar. Tente novamente."
      );
    }
  };

  return (
    <div className="container">
      <div className="user-auth-container">
        <h1>Crie sua Conta</h1>
        <form onSubmit={handleSubmit} className="user-auth-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            Cadastrar
          </button>
          <div className="auth-switch-link">
            <span>Já tem uma conta? </span>
            <Link to="/area-cliente">Faça o login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegisterPage;
