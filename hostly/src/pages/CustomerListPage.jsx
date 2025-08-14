// Página de listagem e gerenciamento de clientes
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CustomerListPage.css";

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  /**
   * Busca lista de clientes do backend
   */
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/customers`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        setCustomers(response.data);
      } catch {
        setError("Erro ao carregar clientes.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  /**
   * Define cliente alvo para exclusão
   */
  const handleDelete = (customer) => {
    setDeleteTarget(customer);
  };

  if (loading) {
    return <p className="loading-message">Carregando clientes...</p>;
  }

  return (
    <div className="container">
      <div className="customer-list-container">
        <div className="list-page-header">
          <h1>Clientes Cadastrados</h1>
          <Link to="/customers/new" className="add-new-button">
            Cadastrar Novo Cliente
          </Link>
        </div>
        {error && <p className="error-message">{error}</p>}
        <table className="customers-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || "N/A"}</td>
                  <td>
                    <div className="action-buttons-container">
                      <Link
                        to={`/customers/edit/${customer.id}`}
                        className="action-button edit"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(customer)}
                        className="action-button delete"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Modal de confirmação de exclusão de cliente */}
        {deleteTarget && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirmar exclusão</h2>
              <p>
                Deseja realmente excluir o cliente &#39;{deleteTarget.name}
                &#39;?
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
                        `${import.meta.env.VITE_API_URL}/api/customers/${
                          deleteTarget.id
                        }`
                      );
                      setCustomers((currentCustomers) =>
                        currentCustomers.filter((c) => c.id !== deleteTarget.id)
                      );
                      setDeleteTarget(null);
                    } catch {
                      setError("Falha ao excluir o cliente.");
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

export default CustomerListPage;
