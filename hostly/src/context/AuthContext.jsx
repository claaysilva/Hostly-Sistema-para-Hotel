// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 1. O Contexto é criado aqui
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("hostly-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email,
          password,
        }
      );

      const userData = response.data;
      localStorage.setItem("hostly-user", JSON.stringify(userData));
      setUser(userData);

      if (userData.role === "admin" || userData.role === "operator") {
        navigate("/rooms");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error("Não foi possível conectar ao servidor.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("hostly-user");
    setUser(null);
    navigate("/login");
  };

  const value = { user, login, logout, loading };

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 2. O hook 'useAuth' usa o Contexto criado acima
export const useAuth = () => {
  return useContext(AuthContext);
};
