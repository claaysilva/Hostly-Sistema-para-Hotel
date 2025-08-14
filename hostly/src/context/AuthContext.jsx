// Contexto de autenticação do usuário
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  /**
   * Realiza login do usuário na aplicação.
   * @param {string} email
   * @param {string} password
   * @throws {Error} Mensagem de erro amigável para o usuário
   */
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      const userData = response.data;
      localStorage.setItem("hostly-user", JSON.stringify(userData));
      setUser(userData);

      // Redireciona conforme o tipo de usuário
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

  /**
   * Realiza logout do usuário e limpa dados locais.
   */
  const logout = () => {
    localStorage.removeItem("hostly-user");
    setUser(null);
    navigate("/login");
  };

  // Valor do contexto para uso nos componentes
  const value = { user, login, logout, loading };

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acessar o contexto de autenticação
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
