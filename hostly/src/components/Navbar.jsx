// src/components/Navbar/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  // Pegamos também o 'loading' do contexto
  const { user, logout, loading } = useAuth();

  // Enquanto o contexto está carregando, não mostramos nada para evitar erros
  if (loading) {
    return null;
  }

  // Agora, quando este código for executado, 'user' será ou um objeto válido ou 'null',
  // mas o estado de 'loading' já terá passado.
  return (
    <nav className="navbar">
      {/* O link da marca agora é mais inteligente */}
      <Link
        to={user?.role === "user" ? "/" : "/rooms"}
        className="navbar-brand"
      >
        Hostly
      </Link>

      <div className="navbar-links">
        {/* Usamos o 'user?' (optional chaining) para segurança extra */}
        {user?.role === "user" && (
          <>
            <NavLink to="/">Início</NavLink>
            <NavLink to="/quartos-disponiveis">Quartos</NavLink>
            <NavLink to="/dashboard">Minhas Reservas</NavLink>
          </>
        )}

        {user && (user.role === "admin" || user.role === "operator") && (
          <>
            <NavLink to="/rooms">Quartos</NavLink>
            <NavLink to="/customers">Clientes</NavLink>
            <NavLink to="/reservas-historico">Histórico de Reservas</NavLink>
          </>
        )}

        {user?.role === "admin" && <NavLink to="/users">Funcionários</NavLink>}
      </div>

      <div className="navbar-user-section">
        {user ? (
          <>
            <span className="user-greeting">Olá, {user.name}</span>
            <button onClick={logout} className="logout-button">
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>
            {/* <Link
              to="/cadastro"
              className="add-new-button"
              style={{ marginLeft: "1rem" }}
            >
              Cadastre-se
            </Link> */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
