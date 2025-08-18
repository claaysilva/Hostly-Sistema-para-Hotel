// src/main.jsx
/**
 * main.jsx
 * Ponto de entrada do frontend React do sistema Hostly.
 *
 * Renderiza o componente App, provê contexto de autenticação e roteamento.
 *
 * Manutenção: Adicione provedores globais ou wrappers necessários para o sistema.
 * Última revisão: 18/08/2025
 * Autor: Equipe de Engenharia Hostly
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider envolve o App para prover contexto de autenticação global */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
