// src/pages/RoomFormPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RoomFormPage.css"; // Usando CSS dedicado

const RoomFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [room, setRoom] = useState({
    name: "",
    description: "",
    capacity: "",
    price_per_night: "",
    is_available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      axios
        .get(`http://localhost:3001/api/rooms/${id}`)
        .then((response) => {
          setRoom({
            ...response.data,
            is_available: Boolean(response.data.is_available),
          });
        })
        .catch(() => setError("Não foi possível carregar os dados do quarto."));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setImageFile(files[0]);
    } else {
      setRoom((prevRoom) => ({
        ...prevRoom,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Cria o FormData em todos os casos
    const formData = new FormData();
    formData.append("name", room.name);
    formData.append("description", room.description);
    formData.append("capacity", room.capacity);
    formData.append("price_per_night", room.price_per_night);
    formData.append("is_available", room.is_available);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEditing) {
        await axios.put(
          `http://localhost:3001/api/rooms/${id}`,
          formData,
          config
        );
      } else {
        await axios.post("http://localhost:3001/api/rooms", formData, config);
      }
      // Força o recarregamento para garantir que a lista de quartos seja atualizada
      window.location.href = "/rooms";
    } catch (err) {
      setError(err.response?.data?.error || "Falha ao salvar o quarto.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>{isEditing ? "Editar Quarto" : "Cadastrar Novo Quarto"}</h1>
        <form onSubmit={handleSubmit} className="styled-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="name">Nome do Quarto</label>
            <input
              type="text"
              name="name"
              id="name"
              value={room.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              name="description"
              id="description"
              value={room.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="capacity">Capacidade</label>
            <input
              type="number"
              name="capacity"
              id="capacity"
              value={room.capacity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price_per_night">Preço por Noite (R$)</label>
            <input
              type="number"
              step="0.01"
              name="price_per_night"
              id="price_per_night"
              value={room.price_per_night}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Imagem do Quarto</label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          {isEditing && (
            <div className="form-group-checkbox">
              <input
                type="checkbox"
                name="is_available"
                checked={room.is_available}
                onChange={handleChange}
                id="is_available_checkbox"
              />
              <label htmlFor="is_available_checkbox">
                Disponível para reserva
              </label>
            </div>
          )}
          <button type="submit" className="submit-button">
            {isEditing ? "Salvar Alterações" : "Cadastrar Quarto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomFormPage;
