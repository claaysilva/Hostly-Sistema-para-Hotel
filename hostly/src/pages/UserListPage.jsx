// src/pages/UserListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CustomerListPage.css"; // Reutiliza o mesmo CSS para um visual idêntico

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Em UserListPage.jsx

  const fetchUsers = async () => {
    try {
      // Adicionamos 'headers' para desabilitar o cache
      const response = await axios.get("http://localhost:3001/api/users", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      console.log("DADOS RECEBIDOS DE /api/users:", response.data);

      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = (user) => {
    setDeleteTarget(user);
  };

  if (loading) {
    return <p className="loading-message">Carregando funcionários...</p>;
  }

  return (
    <div className="container">
      <div className="customer-list-container">
        <div className="list-page-header">
          <h1>Gerenciamento de Funcionários</h1>
          <Link to="/users/new" className="add-new-button">
            Novo Funcionário
          </Link>
        </div>
        {error && <p className="error-message">{error}</p>}
        <table className="customers-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Função</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) => u.role !== "user")
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className="action-buttons-container">
                      <Link
                        to={`/users/edit/${user.id}`}
                        className="action-button edit"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(user)}
                        className="action-button delete"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* Modal de confirmação de exclusão de usuário */}
        {deleteTarget && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirmar exclusão</h2>
              <p>
                Deseja realmente excluir o usuário &quot;{deleteTarget.name}
                &quot;?
              </p>
              <div className="modal-actions">
                <button
                  className="action-button cancel"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancelar
                </button>
                <button
                  className="action-button delete"
                  onClick={async () => {
                    try {
                      await axios.delete(
                        `http://localhost:3001/api/users/${deleteTarget.id}`
                      );
                      setUsers((currentUsers) =>
                        currentUsers.filter((u) => u.id !== deleteTarget.id)
                      );
                      setDeleteTarget(null);
                    } catch {
                      setError("Falha ao excluir o usuário.");
                      setDeleteTarget(null);
                    }
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;
