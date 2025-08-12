// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Enquanto o contexto verifica a autenticação, não renderiza nada
  if (loading) {
    return <div>Carregando...</div>; // Ou um componente de Spinner/Loading mais elegante
  }

  // 2. Se não houver usuário, redireciona para a página de login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Se a rota exige uma função específica E o usuário não tem essa função, redireciona
  if (allowRoles && !allowRoles.includes(user.role)) {
    // Se for um funcionário tentando acessar uma página de cliente, manda para /rooms
    if (user.role === "admin" || user.role === "operator") {
      return <Navigate to="/rooms" replace />;
    }
    // Se for um cliente tentando acessar uma página de admin, manda para /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Se passou em todas as verificações, permite o acesso à página
  return children;
};

export default ProtectedRoute;
